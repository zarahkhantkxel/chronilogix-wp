<?php
/**
 * ACF field group for the Partner Solutions page (slug: partner-solutions).
 * Tab per section. Image fields return a URL string. Repeaters model repeating
 * collections; `bundles` nests repeaters for its paragraph/pointer/step lists.
 *
 * The partner_logos repeater feeds two surfaces: the hero proof row on this
 * page, and the Partner Solutions promo card in the Solutions nav menu (read by
 * components/Nav.tsx via the same page slug).
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_partner_solutions',
    'title'        => 'Partner Solutions',
    'location'     => chronilogix_acf_page_location('partner-solutions'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ────────────────────────────────────────────────────────────
        [ 'key'=>'field_ps_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_hero_eyebrow', 'label'=>'Eyebrow', 'name'=>'hero_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_heading_lead', 'label'=>'Heading (lead)', 'name'=>'hero_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_heading_brand', 'label'=>'Heading (italic brand)', 'name'=>'hero_heading_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_intro', 'label'=>'Intro paragraph', 'name'=>'hero_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_ps_hero_subintro', 'label'=>'Sub-intro (quiet line)', 'name'=>'hero_subintro', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_cta_label', 'label'=>'CTA label', 'name'=>'hero_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_ps_hero_cta_url', 'label'=>'CTA url', 'name'=>'hero_cta_url', 'type'=>'text' ],

        // ── Partner logos ───────────────────────────────────────────────────
        [ 'key'=>'field_ps_logos_tab', 'label'=>'Partner logos', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_partner_logos', 'label'=>'Partner logos (hero proof row + Solutions nav card)', 'name'=>'partner_logos', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ps_partner_logos_logo', 'label'=>'Logo (transparent PNG preferred)', 'name'=>'logo', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_ps_partner_logos_alt', 'label'=>'Alt text', 'name'=>'alt', 'type'=>'text' ],
        ] ],

        // ── Nav card ────────────────────────────────────────────────────────
        [ 'key'=>'field_ps_nav_tab', 'label'=>'Nav card', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_nav_card_title', 'label'=>'Solutions menu card — title', 'name'=>'nav_card_title', 'type'=>'text' ],
        [ 'key'=>'field_ps_nav_card_hook', 'label'=>'Solutions menu card — hook', 'name'=>'nav_card_hook', 'type'=>'textarea' ],

        // ── Bundles ─────────────────────────────────────────────────────────
        [ 'key'=>'field_ps_bundles_tab', 'label'=>'Bundles', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_bundles', 'label'=>'Partner bundles (order sets the layout flip)', 'name'=>'bundles', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ps_b_key', 'label'=>'Key (slug; drives the "on this page" anchor)', 'name'=>'key', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_category', 'label'=>'Category eyebrow', 'name'=>'category', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_lead', 'label'=>'Lead paragraphs', 'name'=>'lead', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_lead_text', 'label'=>'Paragraph', 'name'=>'text', 'type'=>'textarea' ],
            ] ],
            [ 'key'=>'field_ps_b_pointers_heading', 'label'=>'Pointers heading (leave empty to hide)', 'name'=>'pointers_heading', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_pointers', 'label'=>'Pointers (bullet rows)', 'name'=>'pointers', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_pointers_text', 'label'=>'Pointer', 'name'=>'text', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_ps_b_lead_after', 'label'=>'Resolution paragraph (after the pointers)', 'name'=>'lead_after', 'type'=>'textarea' ],
            [ 'key'=>'field_ps_b_tagline', 'label'=>'Tagline (italic serif, inside the graphic card)', 'name'=>'tagline', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_graphic', 'label'=>'Graphic type', 'name'=>'graphic', 'type'=>'select', 'choices'=>[
                'video' => 'Video (demo card)',
                'list'  => 'List (icon-tile grid)',
                'steps' => 'Steps (connected blocks)',
            ], 'default_value'=>'list', 'return_format'=>'value' ],
            [ 'key'=>'field_ps_b_graphic_heading', 'label'=>'Graphic list heading', 'name'=>'graphic_heading', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_graphic_list', 'label'=>'Graphic list items', 'name'=>'graphic_list', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_graphic_list_text', 'label'=>'Item', 'name'=>'text', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_ps_b_graphic_footnote', 'label'=>'Graphic list footnote', 'name'=>'graphic_footnote', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_graphic_steps', 'label'=>'Graphic steps', 'name'=>'graphic_steps', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_ps_b_graphic_steps_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
                [ 'key'=>'field_ps_b_graphic_steps_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
                [ 'key'=>'field_ps_b_graphic_steps_meta', 'label'=>'Meta (middot list)', 'name'=>'meta', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_ps_b_logo', 'label'=>'Partner logo', 'name'=>'logo', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_ps_b_logo_alt', 'label'=>'Partner logo alt text', 'name'=>'logo_alt', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_poster', 'label'=>'Video poster', 'name'=>'video_poster', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_ps_b_video_src', 'label'=>'Video src (path or url)', 'name'=>'video_src', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_runtime', 'label'=>'Video runtime', 'name'=>'video_runtime', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_eyebrow', 'label'=>'Video eyebrow', 'name'=>'video_eyebrow', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_title', 'label'=>'Video title', 'name'=>'video_title', 'type'=>'text' ],
            [ 'key'=>'field_ps_b_video_blurb', 'label'=>'Video blurb', 'name'=>'video_blurb', 'type'=>'textarea' ],
            [ 'key'=>'field_ps_b_video_credit', 'label'=>'Video credit line', 'name'=>'video_credit', 'type'=>'text' ],
        ] ],

        // ── Closing panel ───────────────────────────────────────────────────
        [ 'key'=>'field_ps_closing_tab', 'label'=>'Closing', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ps_closing_heading_brand', 'label'=>'Heading (italic brand)', 'name'=>'closing_heading_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_heading_rest', 'label'=>'Heading (rest)', 'name'=>'closing_heading_rest', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_sub_lead', 'label'=>'Sub-heading (lead)', 'name'=>'closing_sub_lead', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_sub_brand', 'label'=>'Sub-heading (italic brand)', 'name'=>'closing_sub_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_closing_body', 'label'=>'Body', 'name'=>'closing_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ps_closing_body_brand', 'label'=>'Body (brand-tinted tail)', 'name'=>'closing_body_brand', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_heading_lead', 'label'=>'CTA heading (bright)', 'name'=>'cta_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_heading_muted', 'label'=>'CTA heading (muted)', 'name'=>'cta_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_body', 'label'=>'CTA body', 'name'=>'cta_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ps_cta_label', 'label'=>'CTA label', 'name'=>'cta_label', 'type'=>'text' ],
        [ 'key'=>'field_ps_cta_url', 'label'=>'CTA url', 'name'=>'cta_url', 'type'=>'text' ],
    ],
]);
