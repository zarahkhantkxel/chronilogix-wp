<?php
/**
 * ACF field group for the Solutions — Vendors page (slug: solutions-vendors).
 * A Tab per section. Image fields return a URL string so they drop straight
 * into the frontend's existing `src` props. Repeaters model the repeating
 * collections (signal lists, properties, barriers, stats, reframes, carousel,
 * transcript).
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_solutions_vendors',
    'title'        => 'Solutions — Vendors Page',
    'location'     => chronilogix_acf_page_location('solutions-vendors'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ────────────────────────────────────────────────────────────
        [ 'key'=>'field_ven_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_hero_eyebrow', 'label'=>'Eyebrow', 'name'=>'hero_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ven_hero_headline_lead', 'label'=>'Headline (lead line, muted)', 'name'=>'hero_headline_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_hero_headline_hero', 'label'=>'Headline (payoff line, ink)', 'name'=>'hero_headline_hero', 'type'=>'text' ],
        [ 'key'=>'field_ven_hero_intro', 'label'=>'Intro', 'name'=>'hero_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_hero_cta_label', 'label'=>'CTA label', 'name'=>'hero_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_ven_hero_cta_url', 'label'=>'CTA url', 'name'=>'hero_cta_url', 'type'=>'text' ],

        // ── After Delivery ───────────────────────────────────────────────────
        [ 'key'=>'field_ven_after_tab', 'label'=>'After Delivery', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_after_eyebrow', 'label'=>'Eyebrow', 'name'=>'after_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_heading_lead', 'label'=>'Heading (lead)', 'name'=>'after_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_heading_emph', 'label'=>'Heading (emphasis, italic brand)', 'name'=>'after_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_body', 'label'=>'Body', 'name'=>'after_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_after_reframe_lead', 'label'=>'Reframe (lead)', 'name'=>'after_reframe_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_reframe_emph', 'label'=>'Reframe (emphasis, brand)', 'name'=>'after_reframe_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_left_label', 'label'=>'Left panel label', 'name'=>'after_left_label', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_left_sub', 'label'=>'Left panel sub', 'name'=>'after_left_sub', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_right_label', 'label'=>'Right panel label', 'name'=>'after_right_label', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_right_sub', 'label'=>'Right panel sub', 'name'=>'after_right_sub', 'type'=>'text' ],
        [ 'key'=>'field_ven_after_behaviors', 'label'=>'Left signals (what patients do)', 'name'=>'after_behaviors', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_after_behaviors_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_ven_after_results', 'label'=>'Right signals (what it costs you)', 'name'=>'after_results', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_after_results_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
        ] ],

        // ── Upgrade ────────────────────────────────────────────────────────
        [ 'key'=>'field_ven_upgrade_tab', 'label'=>'Upgrade', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_upgrade_eyebrow', 'label'=>'Eyebrow', 'name'=>'upgrade_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ven_upgrade_heading_pre', 'label'=>'Heading (before emphasis)', 'name'=>'upgrade_heading_pre', 'type'=>'text' ],
        [ 'key'=>'field_ven_upgrade_heading_emph', 'label'=>'Heading (emphasis, brand)', 'name'=>'upgrade_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_upgrade_heading_post', 'label'=>'Heading (after emphasis)', 'name'=>'upgrade_heading_post', 'type'=>'text' ],
        [ 'key'=>'field_ven_upgrade_body', 'label'=>'Body (leave empty to keep the styled default)', 'name'=>'upgrade_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_upgrade_properties', 'label'=>'Properties', 'name'=>'upgrade_properties', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_upgrade_properties_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_ven_upgrade_properties_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Program Gap ──────────────────────────────────────────────────────
        [ 'key'=>'field_ven_program_tab', 'label'=>'Program Gap', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_program_heading_lead', 'label'=>'Heading (lead)', 'name'=>'program_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_program_heading_emph', 'label'=>'Heading (emphasis, italic brand)', 'name'=>'program_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_program_body1', 'label'=>'Body 1', 'name'=>'program_body1', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_program_body2', 'label'=>'Body 2', 'name'=>'program_body2', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_program_pills', 'label'=>'Attribute pills', 'name'=>'program_pills', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_program_pills_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
        ] ],

        // ── Behavior Gap ─────────────────────────────────────────────────────
        [ 'key'=>'field_ven_behavior_tab', 'label'=>'Behavior Gap', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_behavior_eyebrow', 'label'=>'Eyebrow', 'name'=>'behavior_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ven_behavior_heading_lead', 'label'=>'Heading (lead)', 'name'=>'behavior_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_behavior_heading_emph', 'label'=>'Heading (emphasis, italic brand)', 'name'=>'behavior_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_behavior_body', 'label'=>'Body', 'name'=>'behavior_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_behavior_image', 'label'=>'Image', 'name'=>'behavior_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_ven_behavior_image_alt', 'label'=>'Image alt text', 'name'=>'behavior_image_alt', 'type'=>'text' ],
        [ 'key'=>'field_ven_behavior_caption_lead', 'label'=>'Caption (lead)', 'name'=>'behavior_caption_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_behavior_caption_emph', 'label'=>'Caption (emphasis, italic brand)', 'name'=>'behavior_caption_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_behavior_barriers', 'label'=>'Barriers', 'name'=>'behavior_barriers', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_behavior_barriers_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_ven_behavior_barriers_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Impact ──────────────────────────────────────────────────────────
        [ 'key'=>'field_ven_impact_tab', 'label'=>'Impact', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_impact_eyebrow', 'label'=>'Eyebrow', 'name'=>'impact_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ven_impact_heading_lead', 'label'=>'Heading (lead)', 'name'=>'impact_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_impact_heading_emph', 'label'=>'Heading (emphasis, italic brand)', 'name'=>'impact_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_impact_body', 'label'=>'Body', 'name'=>'impact_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_impact_stats', 'label'=>'Stats', 'name'=>'impact_stats', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_impact_stats_lead', 'label'=>'Lead (figure)', 'name'=>'lead', 'type'=>'text' ],
            [ 'key'=>'field_ven_impact_stats_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_ven_impact_stats_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Reposition ───────────────────────────────────────────────────────
        [ 'key'=>'field_ven_reposition_tab', 'label'=>'Reposition', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_reposition_eyebrow', 'label'=>'Eyebrow', 'name'=>'reposition_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ven_reposition_heading_lead', 'label'=>'Heading (lead)', 'name'=>'reposition_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_reposition_heading_emph', 'label'=>'Heading (emphasis, italic brand)', 'name'=>'reposition_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_reposition_body', 'label'=>'Body', 'name'=>'reposition_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_reposition_left_header', 'label'=>'Left column header', 'name'=>'reposition_left_header', 'type'=>'text' ],
        [ 'key'=>'field_ven_reposition_right_header', 'label'=>'Right column header', 'name'=>'reposition_right_header', 'type'=>'text' ],
        [ 'key'=>'field_ven_reposition_reframes', 'label'=>'Reframes', 'name'=>'reposition_reframes', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_reposition_reframes_before', 'label'=>'Before (struck through)', 'name'=>'before', 'type'=>'text' ],
            [ 'key'=>'field_ven_reposition_reframes_after_pre', 'label'=>'After — before accent (optional)', 'name'=>'after_pre', 'type'=>'text' ],
            [ 'key'=>'field_ven_reposition_reframes_after_emph', 'label'=>'After — accent word (brand)', 'name'=>'after_emph', 'type'=>'text' ],
            [ 'key'=>'field_ven_reposition_reframes_after_post', 'label'=>'After — after accent (optional)', 'name'=>'after_post', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_ven_reposition_closing_lead', 'label'=>'Closing line (lead)', 'name'=>'reposition_closing_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_reposition_closing_emph', 'label'=>'Closing line (emphasis, brand)', 'name'=>'reposition_closing_emph', 'type'=>'text' ],

        // ── Closing CTA ──────────────────────────────────────────────────────
        [ 'key'=>'field_ven_cta_tab', 'label'=>'Closing CTA', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_cta_eyebrow', 'label'=>'Eyebrow', 'name'=>'cta_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_ven_cta_heading_lead', 'label'=>'Heading (lead)', 'name'=>'cta_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_ven_cta_heading_emph', 'label'=>'Heading (emphasis, brand)', 'name'=>'cta_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_ven_cta_body', 'label'=>'Body', 'name'=>'cta_body', 'type'=>'textarea' ],
        [ 'key'=>'field_ven_cta_primary_label', 'label'=>'Primary CTA label', 'name'=>'cta_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_ven_cta_primary_url', 'label'=>'Primary CTA url', 'name'=>'cta_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_ven_cta_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'cta_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_ven_cta_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'cta_secondary_url', 'type'=>'text' ],
        [ 'key'=>'field_ven_cta_carousel', 'label'=>'Carousel images', 'name'=>'cta_carousel', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_cta_carousel_image', 'label'=>'Image', 'name'=>'image', 'type'=>'image', 'return_format'=>'url' ],
        ] ],

        // ── Audio ────────────────────────────────────────────────────────────
        [ 'key'=>'field_ven_audio_tab', 'label'=>'Audio', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_ven_audio_src', 'label'=>'Audio file', 'name'=>'audio_src', 'type'=>'file', 'return_format'=>'url' ],
        [ 'key'=>'field_ven_audio_track_title', 'label'=>'Track title', 'name'=>'audio_track_title', 'type'=>'text' ],
        [ 'key'=>'field_ven_audio_track_subtitle', 'label'=>'Track subtitle', 'name'=>'audio_track_subtitle', 'type'=>'text' ],
        [ 'key'=>'field_ven_audio_transcript', 'label'=>'Transcript', 'name'=>'audio_transcript', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_ven_audio_transcript_t', 'label'=>'Start time (seconds)', 'name'=>'t', 'type'=>'number' ],
            [ 'key'=>'field_ven_audio_transcript_text', 'label'=>'Text', 'name'=>'text', 'type'=>'textarea' ],
        ] ],
    ],
]);
