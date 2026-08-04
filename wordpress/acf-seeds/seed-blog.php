<?php
/**
 * Seeder — Blog articles (post_type = post). Reads blog-articles.json (extracted
 * verbatim from the original Chronilogix blog source) and creates one WordPress
 * post per article: title/slug/date/category + all ACF card fields and the block
 * body as Flexible Content. Idempotent (matches posts by slug). Trashes the
 * default "hello-world" post so only real articles show.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-blog.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$json = file_get_contents(__DIR__ . '/blog-articles.json');
$articles = json_decode($json, true);
if (!is_array($articles)) {
    if (class_exists('WP_CLI')) {
        WP_CLI::error('Could not read blog-articles.json');
    }
    return;
}

/** Find a post by slug (any status) or create it; returns the post ID. */
function chr_post($slug, $title, $date)
{
    $existing = get_posts([
        'name'        => $slug,
        'post_type'   => 'post',
        'post_status' => 'any',
        'numberposts' => 1,
        'fields'      => 'ids',
    ]);
    $data = [
        'post_type'    => 'post',
        'post_name'    => $slug,
        'post_title'   => $title,
        'post_status'  => 'publish',
        'post_date'    => $date . ' 09:00:00',
    ];
    if ($existing) {
        $data['ID'] = $existing[0];
        wp_update_post($data);
        return $existing[0];
    }
    return wp_insert_post($data);
}

/** Map the source blocks to an ACF Flexible Content value. */
function chr_blocks_to_flexible(array $blocks)
{
    $rows = [];
    foreach ($blocks as $b) {
        switch ($b['type']) {
            case 'para':
            case 'heading':
            case 'subheading':
            case 'callout':
                $rows[] = ['acf_fc_layout' => $b['type'], 'text' => $b['text']];
                break;
            case 'stat':
                $rows[] = [
                    'acf_fc_layout' => 'stat',
                    'value'         => $b['value'] ?? '',
                    'label'         => $b['label'] ?? '',
                    'source'        => $b['source'] ?? '',
                ];
                break;
            case 'list':
                $items = array_map(
                    fn($i) => ['item' => $i],
                    $b['items'] ?? [],
                );
                $rows[] = [
                    'acf_fc_layout' => 'list',
                    'ordered'       => !empty($b['ordered']),
                    'items'         => $items,
                ];
                break;
        }
    }
    return $rows;
}

$count = 0;
foreach ($articles as $a) {
    $pid = chr_post($a['slug'], $a['title'], $a['date']);
    if (!$pid || is_wp_error($pid)) {
        continue;
    }

    // Topic → category (created if missing).
    if (!empty($a['topic'])) {
        $cat_id = wp_create_category($a['topic']);
        if ($cat_id) {
            wp_set_post_categories($pid, [$cat_id]);
        }
    }
    // Excerpt mirrors the dek for non-ACF consumers.
    wp_update_post(['ID' => $pid, 'post_excerpt' => $a['dek']]);

    // Write by field KEY (not name): on a fresh post ACF can't resolve a field
    // by name yet, so a name-based update_field would store raw meta and break
    // flexible-content loading. Keys resolve the field definition directly.
    update_field('field_blog_eyebrow', $a['eyebrow'] ?? '', $pid);
    update_field('field_blog_tag', $a['tag'] ?? '', $pid);
    update_field('field_blog_topic', $a['topic'] ?? '', $pid);
    update_field('field_blog_read_time', $a['readTime'] ?? '', $pid);
    update_field('field_blog_gradient', $a['gradient'] ?? '', $pid);
    update_field('field_blog_text_tone', $a['textTone'] ?? 'light', $pid);
    update_field('field_blog_featured', !empty($a['featured']), $pid);
    update_field('field_blog_sidebar', !empty($a['sidebar']), $pid);
    update_field('field_blog_dek', $a['dek'] ?? '', $pid);
    update_field('field_blog_body', chr_blocks_to_flexible($a['blocks'] ?? []), $pid);
    $count++;
}

// Trash the default sample post so the blog shows only real articles.
$hello = get_posts(['name' => 'hello-world', 'post_type' => 'post', 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids']);
if ($hello) {
    wp_trash_post($hello[0]);
}

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded {$count} blog articles.");
}
