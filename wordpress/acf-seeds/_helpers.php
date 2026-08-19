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
if (!defined('CHR_PUBLIC_DIR')) {
    define('CHR_PUBLIC_DIR', '/Users/zarah.sajjad/Documents/next-wp-main/public');
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

    $abs = CHR_PUBLIC_DIR . '/' . $rel;

    $found = get_posts([
        'post_type'      => 'attachment',
        'posts_per_page' => 1,
        'fields'         => 'ids',
        'meta_key'       => '_chr_src',
        'meta_value'     => $rel,
    ]);
    if ($found) {
        // Reuse the existing attachment only while the source file is
        // unchanged. Matching on the path alone made this permanently
        // idempotent: when upstream REPLACED the team portraits, the new
        // bytes in public/ were never imported and WordPress kept serving
        // the old photos — invisible, because the filename and the URL were
        // identical. `_chr_size` makes "same path, different file" a
        // re-import instead of a silent no-op.
        $size   = file_exists($abs) ? (string) filesize($abs) : '';
        $stored = (string) get_post_meta($found[0], '_chr_size', true);

        // No local file to compare against (production imports over HTTP, or
        // the asset lives outside this checkout) — keep what is already there.
        if ($size === '' || $stored === $size) {
            return $found[0];
        }

        // A missing $stored means the attachment predates this check, so
        // whether the bytes still match is unknown. Re-import rather than
        // assume: that is the case this fix exists for, and it is a one-time
        // cost per asset since the marker is written on the way out.

        // Source changed. Unmark the stale attachment rather than deleting
        // it — anything still pointing at the old URL keeps working — and
        // fall through to import the new bytes.
        delete_post_meta($found[0], '_chr_src');
        if (class_exists('WP_CLI')) {
            WP_CLI::log("media changed, re-importing: {$rel} ({$stored} -> {$size} bytes)");
        }
    }
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
    // Size of the bytes actually imported, so a later run can tell whether the
    // source file in public/ has been replaced. See the lookup above.
    update_post_meta($attach_id, '_chr_size', (string) filesize($abs));
    return $attach_id;
}

/** Set many ACF fields on a post at once: chr_fields($id, ['name' => $value]). */
function chr_fields($post_id, array $fields)
{
    foreach ($fields as $name => $value) {
        update_field($name, $value, $post_id);
    }
}
