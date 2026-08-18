<?php
/**
 * ACF field group for the Product V4 page (slug: product-v4). Tab per section.
 * Image fields return a URL string. Repeaters model repeating collections.
 *
 * Mirrors the Product page, except the Coaches section is the V4 "one engine,
 * two clinical voices" framing (Roni AI engine + Roni/Millie personas).
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_product_v4',
    'title'        => 'Product V4 Page',
    'location'     => chronilogix_acf_page_location('product-v4'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ────────────────────────────────────────────────────────────
        [ 'key'=>'field_prodv4_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prodv4_hero_subheadline', 'label'=>'Subheadline', 'name'=>'v4hero_subheadline', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_hero_headline_lines', 'label'=>'Headline lines', 'name'=>'v4hero_headline_lines', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_hero_headline_lines_text', 'label'=>'Text', 'name'=>'text', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_hero_headline_lines_tone', 'label'=>'Tone', 'name'=>'tone', 'type'=>'select', 'choices'=>[ 'bright'=>'bright', 'muted'=>'muted' ], 'default_value'=>'bright' ],
        ] ],
        [ 'key'=>'field_prodv4_hero_agents', 'label'=>'Agents', 'name'=>'v4hero_agents', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_hero_agents_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_hero_agents_role', 'label'=>'Role', 'name'=>'role', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_hero_agents_avatar', 'label'=>'Avatar', 'name'=>'avatar', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_prodv4_hero_agents_cta_href', 'label'=>'CTA href', 'name'=>'cta_href', 'type'=>'text' ],
        ] ],

        // ── Reply ───────────────────────────────────────────────────────────
        [ 'key'=>'field_prodv4_reply_tab', 'label'=>'Reply', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prodv4_reply_heading_lead', 'label'=>'Heading (lead)', 'name'=>'v4reply_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_reply_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'v4reply_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_reply_dissection_eyebrow', 'label'=>'Dissection eyebrow', 'name'=>'v4reply_dissection_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_reply_member_view_eyebrow', 'label'=>'Member view eyebrow', 'name'=>'v4reply_member_view_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_reply_member_name', 'label'=>'Member name', 'name'=>'v4reply_member_name', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_reply_member_message', 'label'=>'Member message', 'name'=>'v4reply_member_message', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_reply_coach_name', 'label'=>'Coach name', 'name'=>'v4reply_coach_name', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_reply_coach_avatar', 'label'=>'Coach avatar', 'name'=>'v4reply_coach_avatar', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_prodv4_reply_coach_reply', 'label'=>'Coach reply', 'name'=>'v4reply_coach_reply', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_reply_thinking_label', 'label'=>'Thinking label', 'name'=>'v4reply_thinking_label', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_reply_reasoning_rows', 'label'=>'Reasoning rows', 'name'=>'v4reply_reasoning_rows', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_reply_reasoning_rows_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_reply_reasoning_rows_value', 'label'=>'Value', 'name'=>'value', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_prodv4_reply_mockup_image', 'label'=>'Mockup image', 'name'=>'v4reply_mockup_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_prodv4_reply_mockup_alt', 'label'=>'Mockup alt', 'name'=>'v4reply_mockup_alt', 'type'=>'text' ],

        // ── Coaches (V4: engine + personas) ─────────────────────────────────
        [ 'key'=>'field_prodv4_agents_tab', 'label'=>'Coaches', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prodv4_agents_eyebrow', 'label'=>'Eyebrow', 'name'=>'agentsv4_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_agents_heading_lead', 'label'=>'Heading (lead)', 'name'=>'agentsv4_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_agents_heading_muted', 'label'=>'Heading (muted)', 'name'=>'agentsv4_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_agents_intro', 'label'=>'Intro (leave empty to keep the styled default)', 'name'=>'agentsv4_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_agents_engine_label', 'label'=>'Engine label', 'name'=>'agentsv4_engine_label', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_agents_engine_name', 'label'=>'Engine name', 'name'=>'agentsv4_engine_name', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_agents_engine_name_suffix', 'label'=>'Engine name suffix', 'name'=>'agentsv4_engine_name_suffix', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_agents_engine_body', 'label'=>'Engine body (leave empty to keep the styled default)', 'name'=>'agentsv4_engine_body', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_agents_engine_stats', 'label'=>'Engine stats', 'name'=>'agentsv4_engine_stats', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_agents_engine_stats_lead', 'label'=>'Lead', 'name'=>'lead', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_agents_engine_stats_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_prodv4_agents_persona_intro', 'label'=>'Persona intro', 'name'=>'agentsv4_persona_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_agents_personas', 'label'=>'Personas', 'name'=>'agentsv4_personas', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_agents_personas_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_agents_personas_role', 'label'=>'Role', 'name'=>'role', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_agents_personas_scope', 'label'=>'Scope', 'name'=>'scope', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_agents_personas_avatar', 'label'=>'Avatar', 'name'=>'avatar', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_prodv4_agents_personas_member_line', 'label'=>'Member line', 'name'=>'member_line', 'type'=>'textarea' ],
            [ 'key'=>'field_prodv4_agents_personas_coach_reply', 'label'=>'Coach reply', 'name'=>'coach_reply', 'type'=>'textarea' ],
            [ 'key'=>'field_prodv4_agents_personas_capabilities', 'label'=>'Capabilities', 'name'=>'capabilities', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_prodv4_agents_personas_capabilities_value', 'label'=>'Value', 'name'=>'value', 'type'=>'text' ],
            ] ],
        ] ],

        // ── Capabilities ────────────────────────────────────────────────────
        [ 'key'=>'field_prodv4_caps_tab', 'label'=>'Capabilities', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prodv4_caps_heading_lead', 'label'=>'Heading (lead)', 'name'=>'v4caps_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_caps_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'v4caps_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_caps_intro', 'label'=>'Intro', 'name'=>'v4caps_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_caps_blocks', 'label'=>'Capability blocks (text only; visuals fixed)', 'name'=>'v4caps_blocks', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_caps_blocks_eyebrow', 'label'=>'Eyebrow', 'name'=>'eyebrow', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_caps_blocks_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_prodv4_caps_privacy_eyebrow', 'label'=>'Privacy eyebrow', 'name'=>'v4caps_privacy_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_caps_privacy_heading_lead', 'label'=>'Privacy heading (lead)', 'name'=>'v4caps_privacy_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_caps_privacy_heading_emph', 'label'=>'Privacy heading (emphasis)', 'name'=>'v4caps_privacy_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_caps_trust_pillars', 'label'=>'Trust pillars', 'name'=>'v4caps_trust_pillars', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_caps_trust_pillars_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_caps_trust_pillars_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Audience ────────────────────────────────────────────────────────
        [ 'key'=>'field_prodv4_audience_tab', 'label'=>'Audience', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prodv4_audience_sr_heading', 'label'=>'Screen-reader heading', 'name'=>'v4audience_sr_heading', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_audience_profiles', 'label'=>'Profiles', 'name'=>'v4audience_profiles', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_audience_profiles_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_audience_profiles_intro', 'label'=>'Intro', 'name'=>'intro', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_audience_profiles_headline1', 'label'=>'Headline line 1', 'name'=>'headline1', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_audience_profiles_headline2', 'label'=>'Headline line 2', 'name'=>'headline2', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_audience_profiles_description', 'label'=>'Description', 'name'=>'description', 'type'=>'textarea' ],
            [ 'key'=>'field_prodv4_audience_profiles_extended_label', 'label'=>'Extended label (optional)', 'name'=>'extended_label', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_audience_profiles_extended', 'label'=>'Extended body (optional)', 'name'=>'extended', 'type'=>'textarea' ],
            [ 'key'=>'field_prodv4_audience_profiles_pull_lead', 'label'=>'Pull stat lead (optional)', 'name'=>'pull_lead', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_audience_profiles_pull_caption', 'label'=>'Pull stat caption (optional)', 'name'=>'pull_caption', 'type'=>'text' ],
        ] ],

        // ── Integration ─────────────────────────────────────────────────────
        [ 'key'=>'field_prodv4_integration_tab', 'label'=>'Integration', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prodv4_integration_heading_lead', 'label'=>'Heading (lead)', 'name'=>'v4integration_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_integration_heading_muted', 'label'=>'Heading (muted)', 'name'=>'v4integration_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_integration_intro', 'label'=>'Intro', 'name'=>'v4integration_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_integration_paths', 'label'=>'Paths', 'name'=>'v4integration_paths', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_integration_paths_index', 'label'=>'Index', 'name'=>'index', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_integration_paths_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_integration_paths_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_integration_paths_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_prodv4_integration_infra_label', 'label'=>'Infrastructure label', 'name'=>'v4integration_infra_label', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_integration_infra_text', 'label'=>'Infrastructure text', 'name'=>'v4integration_infra_text', 'type'=>'textarea' ],

        // ── Platform ────────────────────────────────────────────────────────
        [ 'key'=>'field_prodv4_platform_tab', 'label'=>'Platform', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prodv4_platform_heading_lead', 'label'=>'Heading (lead)', 'name'=>'v4platform_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_platform_heading_muted', 'label'=>'Heading (muted)', 'name'=>'v4platform_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_prodv4_platform_intro', 'label'=>'Intro', 'name'=>'v4platform_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prodv4_platform_rows', 'label'=>'Rows (eyebrow + heading; body & visual fixed)', 'name'=>'v4platform_rows', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_platform_rows_eyebrow', 'label'=>'Eyebrow', 'name'=>'eyebrow', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_platform_rows_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_prodv4_platform_modules', 'label'=>'Coverage modules (name + domain; state fixed)', 'name'=>'v4platform_modules', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prodv4_platform_modules_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_prodv4_platform_modules_domain', 'label'=>'Domain', 'name'=>'domain', 'type'=>'text' ],
        ] ],
    ],
]);
