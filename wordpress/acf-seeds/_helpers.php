<?php
/**
 * Shared helpers for the ACF content seeders. Run via:
 *   wpx eval-file wordpress/acf-seeds/seed-<page>.php
 *
 * These are idempotent: pages are matched/created by slug, and media is
 * imported once (tracked by the `_chr_src` meta) and reused on re-runs.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Absolute path to the Next.js public/ folder that holds the source images.
//
// Resolved relative to this file (wordpress/acf-seeds/_helpers.php → ../../public)
// so the seeders run unchanged on any machine — a hardcoded local path meant
// every chr_media() call failed with "media missing:" anywhere but the author's
// laptop. Override order, first match wins:
//   1. A CHR_PUBLIC_DIR constant already defined by the caller.
//   2. The CHR_PUBLIC_DIR environment variable — use this when the Next repo
//      and WordPress live in different places on the server:
//        CHR_PUBLIC_DIR=/var/www/next-wp-main/public wp eval-file …
//   3. The repo-relative default below.
if (!defined('CHR_PUBLIC_DIR')) {
    $chr_env_dir = getenv('CHR_PUBLIC_DIR');
    define(
        'CHR_PUBLIC_DIR',
        $chr_env_dir !== false && $chr_env_dir !== ''
            ? rtrim($chr_env_dir, '/')
            : dirname(__DIR__, 2) . '/public',
    );
}

if (!is_dir(CHR_PUBLIC_DIR) && class_exists('WP_CLI')) {
    WP_CLI::warning(
        'CHR_PUBLIC_DIR does not exist: ' . CHR_PUBLIC_DIR
        . ' — every image import will be skipped. Point it at the Next.js'
        . ' public/ folder with the CHR_PUBLIC_DIR environment variable.',
    );
}

// WordPress blocks SVG uploads by default; allow them for the seed import so
// logos/illustrations shipped as SVG land in the media library.
add_filter('upload_mimes', function ($mimes) {
    $mimes['svg']  = 'image/svg+xml';
    $mimes['svgz'] = 'image/svg+xml';
    return $mimes;
});
add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename) {
    if (preg_match('/\.svgz?$/i', $filename)) {
        $data['ext']  = 'svg';
        $data['type'] = 'image/svg+xml';
    }
    return $data;
}, 10, 3);

/** Find or create a published Page by slug; returns the post ID. */
function chr_page($slug, $title)
{
    $existing = get_page_by_path($slug);
    if ($existing) {
        return $existing->ID;
    }
    $id = wp_insert_post([
        'post_type'   => 'page',
        'post_name'   => $slug,
        'post_title'  => $title,
        'post_status' => 'publish',
        'post_content' => '',
    ]);
    if (is_wp_error($id)) {
        if (class_exists('WP_CLI')) {
            WP_CLI::error("Failed to create page {$slug}: " . $id->get_error_message());
        }
        return 0;
    }
    return $id;
}

/**
 * Import a file from the Next.js public/ folder into the media library and
 * return its attachment ID. Idempotent via the `_chr_src` meta marker.
 *
 * @param string $rel Path relative to CHR_PUBLIC_DIR, e.g. "statement-bg.png".
 */
function chr_media($rel)
{
    $rel = ltrim($rel, '/');

    $found = get_posts([
        'post_type'      => 'attachment',
        'posts_per_page' => 1,
        'fields'         => 'ids',
        'meta_key'       => '_chr_src',
        'meta_value'     => $rel,
    ]);
    if ($found) {
        return $found[0];
    }

    $abs = CHR_PUBLIC_DIR . '/' . $rel;
    if (!file_exists($abs)) {
        if (class_exists('WP_CLI')) {
            WP_CLI::warning("media missing: {$rel}");
        }
        return 0;
    }

    $filename = basename($abs);
    $upload   = wp_upload_bits($filename, null, file_get_contents($abs));
    if (!empty($upload['error'])) {
        if (class_exists('WP_CLI')) {
            WP_CLI::warning("upload failed for {$rel}: {$upload['error']}");
        }
        return 0;
    }

    $type       = wp_check_filetype($upload['file']);
    $attachment = [
        'post_mime_type' => $type['type'] ?: 'application/octet-stream',
        'post_title'     => sanitize_file_name(pathinfo($filename, PATHINFO_FILENAME)),
        'post_status'    => 'inherit',
    ];
    $attach_id = wp_insert_attachment($attachment, $upload['file']);
    if (is_wp_error($attach_id) || !$attach_id) {
        return 0;
    }

    require_once ABSPATH . 'wp-admin/includes/image.php';
    // Raster metadata (skipped gracefully for SVG/PDF/etc).
    $meta = wp_generate_attachment_metadata($attach_id, $upload['file']);
    if ($meta) {
        wp_update_attachment_metadata($attach_id, $meta);
    }
    update_post_meta($attach_id, '_chr_src', $rel);
    return $attach_id;
}

/** Set many ACF fields on a post at once: chr_fields($id, ['name' => $value]). */
function chr_fields($post_id, array $fields)
{
    foreach ($fields as $name => $value) {
        update_field($name, $value, $post_id);
    }
}
