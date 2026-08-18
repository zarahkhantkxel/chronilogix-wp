<?php
/**
 * ACF field group for the Aetna case study (slug: case-study-aetna). Tab per
 * section. Outcome figures are HTML (they carry a colored arrow) and render via
 * dangerouslySetInnerHTML.
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_case_study_aetna',
    'title'        => 'Case Study — Aetna',
    'location'     => chronilogix_acf_page_location('case-study-aetna'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ──────────────────────────────────────────────────────────
        [ 'key'=>'field_aetna_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_aetna_hero_eyebrow', 'label'=>'Eyebrow', 'name'=>'hero_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_aetna_hero_logo', 'label'=>'Logo', 'name'=>'hero_logo', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_aetna_hero_logo_alt', 'label'=>'Logo alt', 'name'=>'hero_logo_alt', 'type'=>'text' ],
        [ 'key'=>'field_aetna_hero_heading_lead', 'label'=>'Heading (lead)', 'name'=>'hero_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_aetna_hero_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'hero_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_aetna_hero_body', 'label'=>'Body', 'name'=>'hero_body', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_hero_meta', 'label'=>'Meta chips', 'name'=>'hero_meta', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_aetna_hero_meta_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_aetna_hero_meta_value', 'label'=>'Value', 'name'=>'value', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_aetna_hero_primary_label', 'label'=>'Primary CTA label', 'name'=>'hero_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_aetna_hero_primary_url', 'label'=>'Primary CTA url', 'name'=>'hero_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_aetna_hero_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'hero_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_aetna_hero_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'hero_secondary_url', 'type'=>'text' ],

        // ── Outcomes ────────────────────────────────────────────────────────
        [ 'key'=>'field_aetna_outcomes_tab', 'label'=>'Outcomes', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_aetna_outcomes_label', 'label'=>'Label', 'name'=>'outcomes_label', 'type'=>'text' ],
        [ 'key'=>'field_aetna_outcomes_items', 'label'=>'Items', 'name'=>'outcomes_items', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_aetna_outcomes_items_figure', 'label'=>'Figure (HTML)', 'name'=>'figure', 'type'=>'text' ],
            [ 'key'=>'field_aetna_outcomes_items_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_aetna_outcomes_items_note', 'label'=>'Note', 'name'=>'note', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_aetna_outcomes_source', 'label'=>'Source line', 'name'=>'outcomes_source', 'type'=>'textarea' ],

        // ── Challenge ───────────────────────────────────────────────────────
        [ 'key'=>'field_aetna_challenge_tab', 'label'=>'Challenge', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_aetna_challenge_eyebrow', 'label'=>'Eyebrow', 'name'=>'challenge_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_aetna_challenge_heading', 'label'=>'Heading', 'name'=>'challenge_heading', 'type'=>'text' ],
        [ 'key'=>'field_aetna_challenge_body1', 'label'=>'Body 1', 'name'=>'challenge_body1', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_challenge_body2', 'label'=>'Body 2', 'name'=>'challenge_body2', 'type'=>'textarea' ],

        // ── Solution ────────────────────────────────────────────────────────
        [ 'key'=>'field_aetna_solution_tab', 'label'=>'Solution', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_aetna_solution_eyebrow', 'label'=>'Eyebrow', 'name'=>'solution_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_aetna_solution_heading', 'label'=>'Heading', 'name'=>'solution_heading', 'type'=>'text' ],
        [ 'key'=>'field_aetna_solution_body', 'label'=>'Body', 'name'=>'solution_body', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_solution_quote', 'label'=>'Quote', 'name'=>'solution_quote', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_solution_quote_attr', 'label'=>'Quote attribution', 'name'=>'solution_quote_attr', 'type'=>'text' ],
        [ 'key'=>'field_aetna_conv_member', 'label'=>'Conversation — member line', 'name'=>'conv_member', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_conv_scripted_label', 'label'=>'Conversation — scripted label', 'name'=>'conv_scripted_label', 'type'=>'text' ],
        [ 'key'=>'field_aetna_conv_scripted_text', 'label'=>'Conversation — scripted text', 'name'=>'conv_scripted_text', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_conv_mi_label', 'label'=>'Conversation — MI label', 'name'=>'conv_mi_label', 'type'=>'text' ],
        [ 'key'=>'field_aetna_conv_mi_text', 'label'=>'Conversation — MI text', 'name'=>'conv_mi_text', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_conv_bg', 'label'=>'Conversation background image', 'name'=>'conv_bg', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_aetna_bio_image', 'label'=>'Bio image', 'name'=>'bio_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_aetna_bio_role', 'label'=>'Bio role', 'name'=>'bio_role', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bio_name', 'label'=>'Bio name', 'name'=>'bio_name', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bio_body', 'label'=>'Bio body', 'name'=>'bio_body', 'type'=>'textarea' ],

        // ── What Changed ────────────────────────────────────────────────────
        [ 'key'=>'field_aetna_changed_tab', 'label'=>'What Changed', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_aetna_changed_eyebrow', 'label'=>'Eyebrow', 'name'=>'changed_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_aetna_changed_heading', 'label'=>'Heading', 'name'=>'changed_heading', 'type'=>'text' ],
        [ 'key'=>'field_aetna_changed_body', 'label'=>'Body', 'name'=>'changed_body', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_changed_shifts', 'label'=>'Shifts', 'name'=>'changed_shifts', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_aetna_changed_shifts_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_aetna_changed_shifts_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_aetna_changed_downstream', 'label'=>'Downstream wins', 'name'=>'changed_downstream', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_aetna_changed_downstream_text', 'label'=>'Text', 'name'=>'text', 'type'=>'text' ],
        ] ],

        // ── Why It Works ────────────────────────────────────────────────────
        [ 'key'=>'field_aetna_why_tab', 'label'=>'Why It Works', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_aetna_why_eyebrow', 'label'=>'Eyebrow', 'name'=>'why_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_aetna_why_heading_lead', 'label'=>'Heading (lead)', 'name'=>'why_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_aetna_why_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'why_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_aetna_why_body', 'label'=>'Body', 'name'=>'why_body', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_why_creates', 'label'=>'Creates list', 'name'=>'why_creates', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_aetna_why_creates_text', 'label'=>'Text', 'name'=>'text', 'type'=>'text' ],
        ] ],

        // ── Bridge ──────────────────────────────────────────────────────────
        [ 'key'=>'field_aetna_bridge_tab', 'label'=>'Bridge', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_aetna_bridge_eyebrow', 'label'=>'Eyebrow', 'name'=>'bridge_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bridge_heading_lead', 'label'=>'Heading (lead)', 'name'=>'bridge_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bridge_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'bridge_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bridge_body', 'label'=>'Body', 'name'=>'bridge_body', 'type'=>'textarea' ],
        [ 'key'=>'field_aetna_bridge_primary_label', 'label'=>'Primary CTA label', 'name'=>'bridge_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bridge_primary_url', 'label'=>'Primary CTA url', 'name'=>'bridge_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bridge_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'bridge_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_aetna_bridge_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'bridge_secondary_url', 'type'=>'text' ],
    ],
]);
