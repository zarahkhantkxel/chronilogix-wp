<?php
/**
 * ACF field group for the Product page (slug: product). Tab per section.
 * Image fields return a URL string. Repeaters model repeating collections.
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_product',
    'title'        => 'Product Page',
    'location'     => chronilogix_acf_page_location('product'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Hero ────────────────────────────────────────────────────────────
        [ 'key'=>'field_prod_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prod_hero_subheadline', 'label'=>'Subheadline', 'name'=>'hero_subheadline', 'type'=>'textarea' ],
        [ 'key'=>'field_prod_hero_headline_lines', 'label'=>'Headline lines', 'name'=>'hero_headline_lines', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_hero_headline_lines_text', 'label'=>'Text', 'name'=>'text', 'type'=>'text' ],
            [ 'key'=>'field_prod_hero_headline_lines_tone', 'label'=>'Tone', 'name'=>'tone', 'type'=>'select', 'choices'=>[ 'bright'=>'bright', 'muted'=>'muted' ], 'default_value'=>'bright' ],
        ] ],
        [ 'key'=>'field_prod_hero_agents', 'label'=>'Agents', 'name'=>'hero_agents', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_hero_agents_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_prod_hero_agents_role', 'label'=>'Role', 'name'=>'role', 'type'=>'text' ],
            [ 'key'=>'field_prod_hero_agents_avatar', 'label'=>'Avatar', 'name'=>'avatar', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_prod_hero_agents_cta_href', 'label'=>'CTA href', 'name'=>'cta_href', 'type'=>'text' ],
        ] ],

        // ── Reply ───────────────────────────────────────────────────────────
        [ 'key'=>'field_prod_reply_tab', 'label'=>'Reply', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prod_reply_heading_lead', 'label'=>'Heading (lead)', 'name'=>'reply_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prod_reply_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'reply_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_prod_reply_dissection_eyebrow', 'label'=>'Dissection eyebrow', 'name'=>'reply_dissection_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prod_reply_member_view_eyebrow', 'label'=>'Member view eyebrow', 'name'=>'reply_member_view_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prod_reply_member_name', 'label'=>'Member name', 'name'=>'reply_member_name', 'type'=>'text' ],
        [ 'key'=>'field_prod_reply_member_message', 'label'=>'Member message', 'name'=>'reply_member_message', 'type'=>'textarea' ],
        [ 'key'=>'field_prod_reply_coach_name', 'label'=>'Coach name', 'name'=>'reply_coach_name', 'type'=>'text' ],
        [ 'key'=>'field_prod_reply_coach_avatar', 'label'=>'Coach avatar', 'name'=>'reply_coach_avatar', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_prod_reply_coach_reply', 'label'=>'Coach reply', 'name'=>'reply_coach_reply', 'type'=>'textarea' ],
        [ 'key'=>'field_prod_reply_thinking_label', 'label'=>'Thinking label', 'name'=>'reply_thinking_label', 'type'=>'text' ],
        [ 'key'=>'field_prod_reply_reasoning_rows', 'label'=>'Reasoning rows', 'name'=>'reply_reasoning_rows', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_reply_reasoning_rows_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_prod_reply_reasoning_rows_value', 'label'=>'Value', 'name'=>'value', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_prod_reply_mockup_image', 'label'=>'Mockup image', 'name'=>'reply_mockup_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_prod_reply_mockup_alt', 'label'=>'Mockup alt', 'name'=>'reply_mockup_alt', 'type'=>'text' ],

        // ── Coaches ─────────────────────────────────────────────────────────
        [ 'key'=>'field_prod_agents_tab', 'label'=>'Coaches', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prod_agents_eyebrow', 'label'=>'Eyebrow', 'name'=>'agents_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prod_agents_heading_lead', 'label'=>'Heading (lead)', 'name'=>'agents_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prod_agents_heading_muted', 'label'=>'Heading (muted)', 'name'=>'agents_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_prod_agents_paragraph1', 'label'=>'Paragraph 1', 'name'=>'agents_paragraph1', 'type'=>'textarea' ],
        [ 'key'=>'field_prod_agents_paragraph2', 'label'=>'Paragraph 2', 'name'=>'agents_paragraph2', 'type'=>'textarea' ],

        // ── Capabilities ────────────────────────────────────────────────────
        [ 'key'=>'field_prod_caps_tab', 'label'=>'Capabilities', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prod_caps_heading_lead', 'label'=>'Heading (lead)', 'name'=>'caps_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prod_caps_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'caps_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_prod_caps_intro', 'label'=>'Intro', 'name'=>'caps_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prod_caps_blocks', 'label'=>'Capability blocks (text only; visuals fixed)', 'name'=>'caps_blocks', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_caps_blocks_eyebrow', 'label'=>'Eyebrow', 'name'=>'eyebrow', 'type'=>'text' ],
            [ 'key'=>'field_prod_caps_blocks_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_prod_caps_privacy_eyebrow', 'label'=>'Privacy eyebrow', 'name'=>'caps_privacy_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_prod_caps_privacy_heading_lead', 'label'=>'Privacy heading (lead)', 'name'=>'caps_privacy_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prod_caps_privacy_heading_emph', 'label'=>'Privacy heading (emphasis)', 'name'=>'caps_privacy_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_prod_caps_trust_pillars', 'label'=>'Trust pillars', 'name'=>'caps_trust_pillars', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_caps_trust_pillars_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_prod_caps_trust_pillars_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Audience ────────────────────────────────────────────────────────
        [ 'key'=>'field_prod_audience_tab', 'label'=>'Audience', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prod_audience_sr_heading', 'label'=>'Screen-reader heading', 'name'=>'audience_sr_heading', 'type'=>'text' ],
        [ 'key'=>'field_prod_audience_profiles', 'label'=>'Profiles', 'name'=>'audience_profiles', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_audience_profiles_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_prod_audience_profiles_intro', 'label'=>'Intro', 'name'=>'intro', 'type'=>'text' ],
            [ 'key'=>'field_prod_audience_profiles_headline1', 'label'=>'Headline line 1', 'name'=>'headline1', 'type'=>'text' ],
            [ 'key'=>'field_prod_audience_profiles_headline2', 'label'=>'Headline line 2', 'name'=>'headline2', 'type'=>'text' ],
            [ 'key'=>'field_prod_audience_profiles_description', 'label'=>'Description', 'name'=>'description', 'type'=>'textarea' ],
            [ 'key'=>'field_prod_audience_profiles_extended_label', 'label'=>'Extended label (optional)', 'name'=>'extended_label', 'type'=>'text' ],
            [ 'key'=>'field_prod_audience_profiles_extended', 'label'=>'Extended body (optional)', 'name'=>'extended', 'type'=>'textarea' ],
            [ 'key'=>'field_prod_audience_profiles_pull_lead', 'label'=>'Pull stat lead (optional)', 'name'=>'pull_lead', 'type'=>'text' ],
            [ 'key'=>'field_prod_audience_profiles_pull_caption', 'label'=>'Pull stat caption (optional)', 'name'=>'pull_caption', 'type'=>'text' ],
        ] ],

        // ── Integration ─────────────────────────────────────────────────────
        [ 'key'=>'field_prod_integration_tab', 'label'=>'Integration', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prod_integration_heading_lead', 'label'=>'Heading (lead)', 'name'=>'integration_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prod_integration_heading_muted', 'label'=>'Heading (muted)', 'name'=>'integration_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_prod_integration_intro', 'label'=>'Intro', 'name'=>'integration_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prod_integration_paths', 'label'=>'Paths', 'name'=>'integration_paths', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_integration_paths_index', 'label'=>'Index', 'name'=>'index', 'type'=>'text' ],
            [ 'key'=>'field_prod_integration_paths_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_prod_integration_paths_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
            [ 'key'=>'field_prod_integration_paths_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_prod_integration_infra_label', 'label'=>'Infrastructure label', 'name'=>'integration_infra_label', 'type'=>'text' ],
        [ 'key'=>'field_prod_integration_infra_text', 'label'=>'Infrastructure text', 'name'=>'integration_infra_text', 'type'=>'textarea' ],

        // ── Platform ────────────────────────────────────────────────────────
        [ 'key'=>'field_prod_platform_tab', 'label'=>'Platform', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_prod_platform_heading_lead', 'label'=>'Heading (lead)', 'name'=>'platform_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_prod_platform_heading_muted', 'label'=>'Heading (muted)', 'name'=>'platform_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_prod_platform_intro', 'label'=>'Intro', 'name'=>'platform_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_prod_platform_rows', 'label'=>'Rows (eyebrow + heading; body & visual fixed)', 'name'=>'platform_rows', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_platform_rows_eyebrow', 'label'=>'Eyebrow', 'name'=>'eyebrow', 'type'=>'text' ],
            [ 'key'=>'field_prod_platform_rows_heading', 'label'=>'Heading', 'name'=>'heading', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_prod_platform_modules', 'label'=>'Coverage modules (name + domain; state fixed)', 'name'=>'platform_modules', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_prod_platform_modules_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_prod_platform_modules_domain', 'label'=>'Domain', 'name'=>'domain', 'type'=>'text' ],
        ] ],
    ],
]);
