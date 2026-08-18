<?php
/**
 * ACF field group for the Solutions — Brokers page (slug: solutions-brokers).
 * A Tab per section. Image/audio fields return a URL string so they drop
 * straight into the frontend's existing `src` props. Repeaters model the
 * repeating collections (cost pressures, proof stats, capability tags, impact
 * cards, payoffs, carousel, transcript).
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_solutions_brokers',
    'title'        => 'Solutions — Brokers Page',
    'location'     => chronilogix_acf_page_location('solutions-brokers'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ────────────────────────────────────────────────────────────
        [ 'key'=>'field_brk_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_hero_eyebrow', 'label'=>'Eyebrow', 'name'=>'hero_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_brk_hero_headline_lead', 'label'=>'Headline (lead line, muted)', 'name'=>'hero_headline_lead', 'type'=>'text' ],
        [ 'key'=>'field_brk_hero_headline_hero', 'label'=>'Headline (payoff line, ink)', 'name'=>'hero_headline_hero', 'type'=>'text' ],
        [ 'key'=>'field_brk_hero_intro', 'label'=>'Intro', 'name'=>'hero_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_brk_hero_cta_label', 'label'=>'CTA label', 'name'=>'hero_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_brk_hero_cta_url', 'label'=>'CTA url', 'name'=>'hero_cta_url', 'type'=>'text' ],

        // ── The Reality ──────────────────────────────────────────────────────
        [ 'key'=>'field_brk_reality_tab', 'label'=>'The Reality', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_reality_eyebrow', 'label'=>'Eyebrow', 'name'=>'reality_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_brk_reality_heading_lead', 'label'=>'Heading (lead)', 'name'=>'reality_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_brk_reality_heading_emph', 'label'=>'Heading (emphasis, italic muted)', 'name'=>'reality_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_brk_reality_intro', 'label'=>'Intro (supporting paragraph)', 'name'=>'reality_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_brk_reality_pressures', 'label'=>'Cost drivers', 'name'=>'reality_pressures', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_brk_reality_pressures_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_brk_reality_pressures_detail', 'label'=>'Detail', 'name'=>'detail', 'type'=>'textarea' ],
            [ 'key'=>'field_brk_reality_pressures_image', 'label'=>'Image', 'name'=>'image', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_brk_reality_pressures_alt', 'label'=>'Image alt text', 'name'=>'alt', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_brk_reality_closing_lead', 'label'=>'Closing line (lead)', 'name'=>'reality_closing_lead', 'type'=>'textarea' ],
        [ 'key'=>'field_brk_reality_closing_emph', 'label'=>'Closing line (emphasis, italic muted)', 'name'=>'reality_closing_emph', 'type'=>'text' ],

        // ── Strategy ─────────────────────────────────────────────────────────
        [ 'key'=>'field_brk_strategy_tab', 'label'=>'Strategy', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_strategy_eyebrow', 'label'=>'Eyebrow', 'name'=>'strategy_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_brk_strategy_heading_lead', 'label'=>'Heading (lead)', 'name'=>'strategy_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_brk_strategy_heading_emph', 'label'=>'Heading (emphasis, italic brand)', 'name'=>'strategy_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_brk_strategy_intro', 'label'=>'Intro', 'name'=>'strategy_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_brk_strategy_image', 'label'=>'Member photo', 'name'=>'strategy_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_brk_strategy_image_alt', 'label'=>'Member photo alt text', 'name'=>'strategy_image_alt', 'type'=>'text' ],
        [ 'key'=>'field_brk_strategy_stats', 'label'=>'Proof stats', 'name'=>'strategy_stats', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_brk_strategy_stats_value', 'label'=>'Value (figure)', 'name'=>'value', 'type'=>'text' ],
            [ 'key'=>'field_brk_strategy_stats_caption', 'label'=>'Caption', 'name'=>'caption', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_brk_strategy_footer_title', 'label'=>'First stat footer title', 'name'=>'strategy_footer_title', 'type'=>'text' ],
        [ 'key'=>'field_brk_strategy_footer_subtitle', 'label'=>'First stat footer subtitle', 'name'=>'strategy_footer_subtitle', 'type'=>'text' ],

        // ── Member Experience ────────────────────────────────────────────────
        [ 'key'=>'field_brk_member_tab', 'label'=>'Member Experience', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_member_heading', 'label'=>'Heading', 'name'=>'member_heading', 'type'=>'text' ],
        [ 'key'=>'field_brk_member_body', 'label'=>'Body', 'name'=>'member_body', 'type'=>'textarea' ],
        [ 'key'=>'field_brk_member_pivot_lead', 'label'=>'Pivot line (lead)', 'name'=>'member_pivot_lead', 'type'=>'text' ],
        [ 'key'=>'field_brk_member_pivot_emph', 'label'=>'Pivot line (emphasis, italic brand)', 'name'=>'member_pivot_emph', 'type'=>'text' ],
        [ 'key'=>'field_brk_member_tags', 'label'=>'Capability tags', 'name'=>'member_tags', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_brk_member_tags_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
        ] ],

        // ── Why It Works ─────────────────────────────────────────────────────
        [ 'key'=>'field_brk_why_tab', 'label'=>'Why It Works', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_why_eyebrow', 'label'=>'Eyebrow', 'name'=>'why_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_brk_why_heading_lead', 'label'=>'Heading (lead)', 'name'=>'why_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_brk_why_heading_emph', 'label'=>'Heading (emphasis, italic brand)', 'name'=>'why_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_brk_why_aside', 'label'=>'Aside line (top-right)', 'name'=>'why_aside', 'type'=>'text' ],
        [ 'key'=>'field_brk_why_cards', 'label'=>'Impact cards', 'name'=>'why_cards', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_brk_why_cards_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_brk_why_cards_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Advantage ────────────────────────────────────────────────────────
        [ 'key'=>'field_brk_advantage_tab', 'label'=>'Advantage', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_advantage_eyebrow', 'label'=>'Eyebrow', 'name'=>'advantage_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_brk_advantage_heading_lead', 'label'=>'Heading (lead)', 'name'=>'advantage_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_brk_advantage_heading_emph', 'label'=>'Heading (emphasis, brand)', 'name'=>'advantage_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_brk_advantage_intro', 'label'=>'Intro', 'name'=>'advantage_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_brk_advantage_payoffs', 'label'=>'Payoffs', 'name'=>'advantage_payoffs', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_brk_advantage_payoffs_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_brk_advantage_payoffs_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Closing CTA ──────────────────────────────────────────────────────
        [ 'key'=>'field_brk_cta_tab', 'label'=>'Closing CTA', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_cta_heading_line1', 'label'=>'Heading (line 1)', 'name'=>'cta_heading_line1', 'type'=>'text' ],
        [ 'key'=>'field_brk_cta_heading_line2', 'label'=>'Heading (line 2, brand)', 'name'=>'cta_heading_line2', 'type'=>'text' ],
        [ 'key'=>'field_brk_cta_body', 'label'=>'Body', 'name'=>'cta_body', 'type'=>'textarea' ],
        [ 'key'=>'field_brk_cta_primary_label', 'label'=>'Primary CTA label', 'name'=>'cta_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_brk_cta_primary_url', 'label'=>'Primary CTA url', 'name'=>'cta_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_brk_cta_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'cta_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_brk_cta_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'cta_secondary_url', 'type'=>'text' ],
        [ 'key'=>'field_brk_cta_signoff', 'label'=>'Brand sign-off line', 'name'=>'cta_signoff', 'type'=>'text' ],
        [ 'key'=>'field_brk_cta_carousel', 'label'=>'Carousel images', 'name'=>'cta_carousel', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_brk_cta_carousel_image', 'label'=>'Image', 'name'=>'image', 'type'=>'image', 'return_format'=>'url' ],
        ] ],

        // ── Audio ────────────────────────────────────────────────────────────
        [ 'key'=>'field_brk_audio_tab', 'label'=>'Audio', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_brk_audio_src', 'label'=>'Audio file', 'name'=>'audio_src', 'type'=>'file', 'return_format'=>'url' ],
        [ 'key'=>'field_brk_audio_track_title', 'label'=>'Track title', 'name'=>'audio_track_title', 'type'=>'text' ],
        [ 'key'=>'field_brk_audio_track_subtitle', 'label'=>'Track subtitle', 'name'=>'audio_track_subtitle', 'type'=>'text' ],
        [ 'key'=>'field_brk_audio_transcript', 'label'=>'Transcript', 'name'=>'audio_transcript', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_brk_audio_transcript_t', 'label'=>'Start time (seconds)', 'name'=>'t', 'type'=>'number' ],
            [ 'key'=>'field_brk_audio_transcript_text', 'label'=>'Text', 'name'=>'text', 'type'=>'textarea' ],
        ] ],
    ],
]);
