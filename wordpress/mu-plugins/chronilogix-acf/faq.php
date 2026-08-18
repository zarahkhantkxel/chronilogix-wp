<?php
/**
 * ACF field group for the FAQ page (slug: faq). Tab per section.
 * FAQ answers are stored as HTML (they carry inline emphasis + links) and
 * rendered on the frontend via dangerouslySetInnerHTML.
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_faq',
    'title'        => 'FAQ Page',
    'location'     => chronilogix_acf_page_location('faq'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ──────────────────────────────────────────────────────────
        [ 'key'=>'field_faq_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_faq_hero_eyebrow', 'label'=>'Eyebrow', 'name'=>'hero_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_faq_hero_heading_lead', 'label'=>'Heading (lead)', 'name'=>'hero_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_faq_hero_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'hero_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_faq_hero_body', 'label'=>'Body (leave empty to keep the styled default with its link)', 'name'=>'hero_body', 'type'=>'textarea' ],

        // ── List ──────────────────────────────────────────────────────────
        [ 'key'=>'field_faq_list_tab', 'label'=>'FAQ List', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_faq_list_groups', 'label'=>'Groups', 'name'=>'list_groups', 'type'=>'repeater', 'layout'=>'block', 'sub_fields'=>[
            [ 'key'=>'field_faq_list_groups_key', 'label'=>'Key (anchor slug)', 'name'=>'key', 'type'=>'text' ],
            [ 'key'=>'field_faq_list_groups_eyebrow', 'label'=>'Eyebrow (number)', 'name'=>'eyebrow', 'type'=>'text' ],
            [ 'key'=>'field_faq_list_groups_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
            [ 'key'=>'field_faq_list_groups_items', 'label'=>'Items', 'name'=>'items', 'type'=>'repeater', 'layout'=>'block', 'sub_fields'=>[
                [ 'key'=>'field_faq_list_groups_items_q', 'label'=>'Question', 'name'=>'q', 'type'=>'text' ],
                [ 'key'=>'field_faq_list_groups_items_a', 'label'=>'Answer (HTML)', 'name'=>'a', 'type'=>'textarea', 'rows'=>4 ],
            ] ],
        ] ],

        // ── Closing CTA ─────────────────────────────────────────────────────
        [ 'key'=>'field_faq_cta_tab', 'label'=>'Closing CTA', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_faq_cta_eyebrow', 'label'=>'Eyebrow', 'name'=>'cta_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_faq_cta_heading_lead', 'label'=>'Heading (lead)', 'name'=>'cta_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_faq_cta_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'cta_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_faq_cta_body', 'label'=>'Body', 'name'=>'cta_body', 'type'=>'textarea' ],
        [ 'key'=>'field_faq_cta_primary_label', 'label'=>'Primary CTA label', 'name'=>'cta_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_faq_cta_primary_url', 'label'=>'Primary CTA url', 'name'=>'cta_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_faq_cta_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'cta_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_faq_cta_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'cta_secondary_url', 'type'=>'text' ],
    ],
]);
