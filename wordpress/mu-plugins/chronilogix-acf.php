<?php
/**
 * Plugin Name: Chronilogix ACF Field Groups
 * Description: Registers ACF field groups (code-defined, REST-exposed) for the
 *              headless Chronilogix pages. Must-use plugin — auto-active.
 *
 * One file per page lives in chronilogix-acf/. Each registers a field group via
 * acf_add_local_field_group() with 'show_in_rest' => true so the Next.js
 * frontend can read the content from /wp-json/wp/v2/pages?slug=...&_fields=acf.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Resolve an ACF location that targets a single Page by slug. Falls back to
 * "all pages" if the page doesn't exist yet (harmless until it's created).
 */
function chronilogix_acf_page_location($slug)
{
    $page = get_page_by_path($slug);
    if ($page) {
        return [[[
            'param'    => 'page',
            'operator' => '==',
            'value'    => (string) $page->ID,
        ]]];
    }
    return [[[
        'param'    => 'post_type',
        'operator' => '==',
        'value'    => 'page',
    ]]];
}

add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }
    foreach (glob(__DIR__ . '/chronilogix-acf/*.php') as $file) {
        require $file;
    }
});
