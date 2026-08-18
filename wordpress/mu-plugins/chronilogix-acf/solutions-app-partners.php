<?php
/**
 * ACF field group for the Solutions — App Partners page
 * (slug: solutions-app-partners). Tab per section. Image fields return a
 * URL string. Repeaters model repeating collections.
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_solutions_app_partners',
    'title'        => 'Solutions — App Partners',
    'location'     => chronilogix_acf_page_location('solutions-app-partners'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ────────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_hero_eyebrow', 'label'=>'Eyebrow', 'name'=>'hero_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_hero_heading_bright', 'label'=>'Heading line 1 (bright)', 'name'=>'hero_heading_bright', 'type'=>'text' ],
        [ 'key'=>'field_sap_hero_heading_muted', 'label'=>'Heading line 2 (muted)', 'name'=>'hero_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_sap_hero_intro', 'label'=>'Intro (leave empty to keep the styled default with inline emphasis)', 'name'=>'hero_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_hero_primary_label', 'label'=>'Primary CTA label', 'name'=>'hero_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_sap_hero_primary_url', 'label'=>'Primary CTA url', 'name'=>'hero_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_sap_hero_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'hero_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_sap_hero_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'hero_secondary_url', 'type'=>'text' ],

        // ── Problem ─────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_problem_tab', 'label'=>'Problem', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_problem_eyebrow', 'label'=>'Eyebrow', 'name'=>'problem_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_problem_heading_lead', 'label'=>'Heading (lead)', 'name'=>'problem_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_sap_problem_heading_muted', 'label'=>'Heading (muted)', 'name'=>'problem_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_sap_problem_lead', 'label'=>'Lead paragraph', 'name'=>'problem_lead', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_problem_closing', 'label'=>'Closing paragraph', 'name'=>'problem_closing', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_problem_roadmap_you_heading', 'label'=>'Roadmap — "You" heading', 'name'=>'problem_roadmap_you_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_problem_roadmap_competitor_heading', 'label'=>'Roadmap — "Competitors" heading', 'name'=>'problem_roadmap_competitor_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_problem_you_tickets', 'label'=>'Roadmap — "You" tickets', 'name'=>'problem_you_tickets', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_problem_you_tickets_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_sap_problem_you_tickets_priority', 'label'=>'Priority', 'name'=>'priority', 'type'=>'text' ],
            [ 'key'=>'field_sap_problem_you_tickets_variant', 'label'=>'Variant (blank, pending, or shipped)', 'name'=>'variant', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_sap_problem_competitor_tickets', 'label'=>'Roadmap — "Competitors" tickets', 'name'=>'problem_competitor_tickets', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_problem_competitor_tickets_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_sap_problem_competitor_tickets_priority', 'label'=>'Priority', 'name'=>'priority', 'type'=>'text' ],
            [ 'key'=>'field_sap_problem_competitor_tickets_variant', 'label'=>'Variant (blank, pending, or shipped)', 'name'=>'variant', 'type'=>'text' ],
        ] ],

        // ── Pillars ─────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_pillars_tab', 'label'=>'Pillars', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_pillars_eyebrow', 'label'=>'Eyebrow', 'name'=>'pillars_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_pillars_heading', 'label'=>'Heading', 'name'=>'pillars_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_pillars_items', 'label'=>'Pillars', 'name'=>'pillars_items', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_pillars_items_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_sap_pillars_items_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Diagram ─────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_diagram_tab', 'label'=>'Diagram', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_diagram_eyebrow', 'label'=>'Eyebrow', 'name'=>'diagram_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_diagram_heading', 'label'=>'Heading', 'name'=>'diagram_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_diagram_engine_title', 'label'=>'Engine panel title', 'name'=>'diagram_engine_title', 'type'=>'text' ],
        [ 'key'=>'field_sap_diagram_engine_cards', 'label'=>'Engine sub-cards', 'name'=>'diagram_engine_cards', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_diagram_engine_cards_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_sap_diagram_engine_cards_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_sap_diagram_captions', 'label'=>'Caption columns', 'name'=>'diagram_captions', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_diagram_captions_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_sap_diagram_captions_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Numbers ─────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_numbers_tab', 'label'=>'Numbers', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_numbers_eyebrow', 'label'=>'Eyebrow', 'name'=>'numbers_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_numbers_heading', 'label'=>'Heading', 'name'=>'numbers_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_numbers_range_label', 'label'=>'Range label', 'name'=>'numbers_range_label', 'type'=>'text' ],
        [ 'key'=>'field_sap_numbers_footnote', 'label'=>'Footnote', 'name'=>'numbers_footnote', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_numbers_metrics', 'label'=>'Metrics', 'name'=>'numbers_metrics', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_numbers_metrics_lead', 'label'=>'Lead (stat)', 'name'=>'lead', 'type'=>'text' ],
            [ 'key'=>'field_sap_numbers_metrics_caption', 'label'=>'Caption', 'name'=>'caption', 'type'=>'text' ],
            [ 'key'=>'field_sap_numbers_metrics_comparison', 'label'=>'Comparison (use → to split)', 'name'=>'comparison', 'type'=>'text' ],
        ] ],

        // ── Distribution ────────────────────────────────────────────────────
        [ 'key'=>'field_sap_distribution_tab', 'label'=>'Distribution', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_distribution_eyebrow', 'label'=>'Eyebrow', 'name'=>'distribution_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_distribution_heading', 'label'=>'Heading', 'name'=>'distribution_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_distribution_body1', 'label'=>'Body paragraph 1', 'name'=>'distribution_body1', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_distribution_body2', 'label'=>'Body paragraph 2', 'name'=>'distribution_body2', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_distribution_deals', 'label'=>'Deal tickets', 'name'=>'distribution_deals', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_distribution_deals_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_sap_distribution_deals_caption', 'label'=>'Caption', 'name'=>'caption', 'type'=>'text' ],
        ] ],

        // ── Proof ───────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_proof_tab', 'label'=>'Proof', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_proof_label', 'label'=>'Label', 'name'=>'proof_label', 'type'=>'text' ],
        [ 'key'=>'field_sap_proof_quote', 'label'=>'Quote (leave empty to keep the shared Aetna quote)', 'name'=>'proof_quote', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_proof_attribution', 'label'=>'Attribution (leave empty to keep the shared Aetna attribution)', 'name'=>'proof_attribution', 'type'=>'text' ],
        [ 'key'=>'field_sap_proof_footer', 'label'=>'Footer', 'name'=>'proof_footer', 'type'=>'text' ],

        // ── Trust ───────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_trust_tab', 'label'=>'Trust', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_trust_eyebrow', 'label'=>'Eyebrow', 'name'=>'trust_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_trust_heading', 'label'=>'Heading', 'name'=>'trust_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_trust_lines', 'label'=>'Trust lines', 'name'=>'trust_lines', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_trust_lines_line', 'label'=>'Line', 'name'=>'line', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_sap_trust_compliance_label', 'label'=>'Compliance label', 'name'=>'trust_compliance_label', 'type'=>'text' ],
        [ 'key'=>'field_sap_trust_compliance_body', 'label'=>'Compliance body', 'name'=>'trust_compliance_body', 'type'=>'textarea' ],

        // ── FAQ ─────────────────────────────────────────────────────────────
        [ 'key'=>'field_sap_faq_tab', 'label'=>'FAQ', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_faq_eyebrow', 'label'=>'Eyebrow', 'name'=>'faq_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_faq_heading', 'label'=>'Heading', 'name'=>'faq_heading', 'type'=>'text' ],
        [ 'key'=>'field_sap_faq_intro', 'label'=>'Intro', 'name'=>'faq_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_faq_questions', 'label'=>'Questions', 'name'=>'faq_questions', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_sap_faq_questions_q', 'label'=>'Question', 'name'=>'q', 'type'=>'text' ],
            [ 'key'=>'field_sap_faq_questions_a', 'label'=>'Answer', 'name'=>'a', 'type'=>'textarea' ],
        ] ],

        // ── Closing CTA ─────────────────────────────────────────────────────
        [ 'key'=>'field_sap_cta_tab', 'label'=>'Closing CTA', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_sap_cta_eyebrow', 'label'=>'Eyebrow', 'name'=>'cta_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_sap_cta_heading_lead', 'label'=>'Heading (lead)', 'name'=>'cta_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_sap_cta_heading_brand', 'label'=>'Heading (brand)', 'name'=>'cta_heading_brand', 'type'=>'text' ],
        [ 'key'=>'field_sap_cta_body', 'label'=>'Body', 'name'=>'cta_body', 'type'=>'textarea' ],
        [ 'key'=>'field_sap_cta_primary_label', 'label'=>'Primary CTA label', 'name'=>'cta_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_sap_cta_primary_url', 'label'=>'Primary CTA url', 'name'=>'cta_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_sap_cta_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'cta_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_sap_cta_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'cta_secondary_url', 'type'=>'text' ],
        [ 'key'=>'field_sap_cta_footer', 'label'=>'Footer', 'name'=>'cta_footer', 'type'=>'text' ],
    ],
]);
