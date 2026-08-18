<?php
/**
 * ACF field group for the Home page (slug: home).
 * A Tab per homepage section. Image fields return a URL string so they drop
 * straight into the frontend's existing `src` props. Repeaters model the
 * repeating collections (stats, chat, agents, cards, personas, testimonials…).
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_home',
    'title'        => 'Home Page',
    'location'     => chronilogix_acf_page_location('home'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'position'     => 'normal',
    'style'        => 'default',
    'fields'       => [

        // ── Hero ──────────────────────────────────────────────────────────
        [ 'key'=>'field_home_hero_tab', 'label'=>'Hero', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_hero_heading_lead', 'label'=>'Heading Lead', 'name'=>'hero_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_heading_highlight1', 'label'=>'Heading Highlight 1', 'name'=>'hero_heading_highlight1', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_heading_highlight2', 'label'=>'Heading Highlight 2', 'name'=>'hero_heading_highlight2', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_heading_italic', 'label'=>'Heading Italic', 'name'=>'hero_heading_italic', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_heading_tail', 'label'=>'Heading Tail', 'name'=>'hero_heading_tail', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_subtext_lead', 'label'=>'Subtext Lead', 'name'=>'hero_subtext_lead', 'type'=>'textarea' ],
        [ 'key'=>'field_home_hero_subtext_name', 'label'=>'Subtext Name', 'name'=>'hero_subtext_name', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_subtext_emphasis', 'label'=>'Subtext Emphasis', 'name'=>'hero_subtext_emphasis', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_cta_label', 'label'=>'CTA Label', 'name'=>'hero_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_cta_url', 'label'=>'CTA URL', 'name'=>'hero_cta_url', 'type'=>'text' ],
        [ 'key'=>'field_home_hero_bg_image', 'label'=>'Background Image', 'name'=>'hero_bg_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_home_hero_phone_image', 'label'=>'Phone Image', 'name'=>'hero_phone_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_home_hero_avatar_image', 'label'=>'Avatar Image', 'name'=>'hero_avatar_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_home_hero_stats', 'label'=>'Stats', 'name'=>'hero_stats', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_home_hero_stats_value', 'label'=>'Value', 'name'=>'value', 'type'=>'text' ],
            [ 'key'=>'field_home_hero_stats_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_home_hero_chat', 'label'=>'Chat', 'name'=>'hero_chat', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_home_hero_chat_who', 'label'=>'Who', 'name'=>'who', 'type'=>'text' ],
            [ 'key'=>'field_home_hero_chat_text', 'label'=>'Text', 'name'=>'text', 'type'=>'textarea' ],
            [ 'key'=>'field_home_hero_chat_time', 'label'=>'Time', 'name'=>'time', 'type'=>'text' ],
        ] ],

        // ── Statement ─────────────────────────────────────────────────────
        [ 'key'=>'field_home_statement_tab', 'label'=>'Statement', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_statement_line1', 'label'=>'Line 1 (indictment)', 'name'=>'statement_line1', 'type'=>'textarea', 'rows'=>3 ],
        [ 'key'=>'field_home_statement_line2', 'label'=>'Line 2 (answer)', 'name'=>'statement_line2', 'type'=>'textarea', 'rows'=>3 ],
        [ 'key'=>'field_home_statement_cta_label', 'label'=>'CTA label', 'name'=>'statement_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_home_statement_cta_url', 'label'=>'CTA URL', 'name'=>'statement_cta_url', 'type'=>'text' ],
        [ 'key'=>'field_home_statement_bg_full', 'label'=>'Background (full saturation)', 'name'=>'statement_bg_full', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_home_statement_bg_low', 'label'=>'Background (low saturation)', 'name'=>'statement_bg_low', 'type'=>'image', 'return_format'=>'url' ],

        // ── MI Explainer ──────────────────────────────────────────────────
        [ 'key'=>'field_home_mi_tab', 'label'=>'MI Explainer', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_mi_heading', 'label'=>'Heading', 'name'=>'mi_heading', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_summary', 'label'=>'Summary', 'name'=>'mi_summary', 'type'=>'textarea' ],
        [ 'key'=>'field_home_mi_cta_label', 'label'=>'CTA Label', 'name'=>'mi_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_cta_url', 'label'=>'CTA URL', 'name'=>'mi_cta_url', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_anatomy_badge', 'label'=>'Anatomy Badge', 'name'=>'mi_anatomy_badge', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_avoids_label', 'label'=>'Avoids Label', 'name'=>'mi_avoids_label', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_avoids', 'label'=>'Avoids Items', 'name'=>'mi_avoids', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_home_mi_avoids_text', 'label'=>'Text', 'name'=>'text', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_home_mi_does_label', 'label'=>'Does Label', 'name'=>'mi_does_label', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_moves', 'label'=>'MI Moves', 'name'=>'mi_moves', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_home_mi_moves_verb', 'label'=>'Verb', 'name'=>'verb', 'type'=>'text' ],
            [ 'key'=>'field_home_mi_moves_desc', 'label'=>'Description', 'name'=>'desc', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_home_mi_comparison_badge', 'label'=>'Comparison Badge', 'name'=>'mi_comparison_badge', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_coach_message', 'label'=>'Coach Message', 'name'=>'mi_coach_message', 'type'=>'textarea' ],
        [ 'key'=>'field_home_mi_member_message', 'label'=>'Member Message', 'name'=>'mi_member_message', 'type'=>'textarea' ],
        [ 'key'=>'field_home_mi_generic_label', 'label'=>'Generic Reply Label', 'name'=>'mi_generic_label', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_generic_reply', 'label'=>'Generic Reply', 'name'=>'mi_generic_reply', 'type'=>'textarea' ],
        [ 'key'=>'field_home_mi_chrono_label', 'label'=>'Chronilogix Label', 'name'=>'mi_chrono_label', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_chrono_tag', 'label'=>'Chronilogix Tag', 'name'=>'mi_chrono_tag', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_chrono_reply', 'label'=>'Chronilogix Reply', 'name'=>'mi_chrono_reply', 'type'=>'textarea' ],
        [ 'key'=>'field_home_mi_science_eyebrow', 'label'=>'Science Eyebrow', 'name'=>'mi_science_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_science_heading', 'label'=>'Science Heading', 'name'=>'mi_science_heading', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_science_heading_muted', 'label'=>'Science Heading (Muted)', 'name'=>'mi_science_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_science_body', 'label'=>'Science Body', 'name'=>'mi_science_body', 'type'=>'textarea' ],
        [ 'key'=>'field_home_mi_science_cta_label', 'label'=>'Science CTA Label', 'name'=>'mi_science_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_science_cta_url', 'label'=>'Science CTA URL', 'name'=>'mi_science_cta_url', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_video_poster', 'label'=>'Video Poster', 'name'=>'mi_video_poster', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_home_mi_video_src', 'label'=>'Video Source URL', 'name'=>'mi_video_src', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_video_role', 'label'=>'Video Role', 'name'=>'mi_video_role', 'type'=>'text' ],
        [ 'key'=>'field_home_mi_video_name', 'label'=>'Video Name', 'name'=>'mi_video_name', 'type'=>'text' ],

        // ── Solution ──────────────────────────────────────────────────────
        [ 'key'=>'field_home_solution_tab', 'label'=>'Solution', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_solution_eyebrow', 'label'=>'Eyebrow', 'name'=>'solution_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_solution_heading_line1', 'label'=>'Heading Line 1', 'name'=>'solution_heading_line1', 'type'=>'text' ],
        [ 'key'=>'field_home_solution_heading_line2', 'label'=>'Heading Line 2', 'name'=>'solution_heading_line2', 'type'=>'text' ],
        [ 'key'=>'field_home_solution_heading_muted', 'label'=>'Heading Muted Line', 'name'=>'solution_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_home_solution_primary_cta_label', 'label'=>'Primary CTA Label', 'name'=>'solution_primary_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_home_solution_secondary_cta_label', 'label'=>'Secondary CTA Label', 'name'=>'solution_secondary_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_home_solution_secondary_cta_url', 'label'=>'Secondary CTA URL', 'name'=>'solution_secondary_cta_url', 'type'=>'text' ],
        [ 'key'=>'field_home_solution_agents', 'label'=>'Agents', 'name'=>'solution_agents', 'type'=>'repeater', 'button_label'=>'Add Agent', 'sub_fields'=>[
            [ 'key'=>'field_home_solution_agents_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_home_solution_agents_condition', 'label'=>'Condition', 'name'=>'condition', 'type'=>'text' ],
            [ 'key'=>'field_home_solution_agents_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
            [ 'key'=>'field_home_solution_agents_topics', 'label'=>'Topics', 'name'=>'topics', 'type'=>'repeater', 'button_label'=>'Add Topic', 'sub_fields'=>[
                [ 'key'=>'field_home_solution_agents_topics_topic', 'label'=>'Topic', 'name'=>'topic', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_home_solution_agents_featured_q', 'label'=>'Featured Q', 'name'=>'featured_q', 'type'=>'textarea' ],
            [ 'key'=>'field_home_solution_agents_featured_a', 'label'=>'Featured A', 'name'=>'featured_a', 'type'=>'textarea' ],
            [ 'key'=>'field_home_solution_agents_featured_context', 'label'=>'Featured Context', 'name'=>'featured_context', 'type'=>'text' ],
            [ 'key'=>'field_home_solution_agents_pattern', 'label'=>'Pattern Image', 'name'=>'pattern', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_home_solution_agents_image', 'label'=>'Avatar Image', 'name'=>'image', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_home_solution_agents_halo_color', 'label'=>'Halo Color', 'name'=>'halo_color', 'type'=>'text' ],
        ] ],

        // ── Problem ───────────────────────────────────────────────────────
        [ 'key'=>'field_home_problem_tab', 'label'=>'Problem', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_problem_image', 'label'=>'Portrait image', 'name'=>'problem_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_home_problem_image_alt', 'label'=>'Portrait alt text', 'name'=>'problem_image_alt', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_heading_lead', 'label'=>'Heading (lead)', 'name'=>'problem_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_heading_rest', 'label'=>'Heading (muted rest)', 'name'=>'problem_heading_rest', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_para1', 'label'=>'Paragraph 1', 'name'=>'problem_para1', 'type'=>'textarea' ],
        [ 'key'=>'field_home_problem_shortage_eyebrow', 'label'=>'Shortage eyebrow', 'name'=>'problem_shortage_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_para2', 'label'=>'Paragraph 2 (real shortage)', 'name'=>'problem_para2', 'type'=>'textarea' ],
        [ 'key'=>'field_home_problem_resolution', 'label'=>'Resolution line', 'name'=>'problem_resolution', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_button_eyebrow', 'label'=>'Button eyebrow', 'name'=>'problem_button_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_button_title', 'label'=>'Button title', 'name'=>'problem_button_title', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_popup_eyebrow', 'label'=>'Popup eyebrow', 'name'=>'problem_popup_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_popup_heading', 'label'=>'Popup heading', 'name'=>'problem_popup_heading', 'type'=>'text' ],
        [ 'key'=>'field_home_problem_observations', 'label'=>'Observations', 'name'=>'problem_observations', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_home_problem_observations_text', 'label'=>'Text', 'name'=>'text', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_home_problem_facts', 'label'=>'Facts', 'name'=>'problem_facts', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_home_problem_facts_lead', 'label'=>'Lead numeral', 'name'=>'lead', 'type'=>'text' ],
            [ 'key'=>'field_home_problem_facts_unit', 'label'=>'Unit (optional)', 'name'=>'unit', 'type'=>'text' ],
            [ 'key'=>'field_home_problem_facts_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
            [ 'key'=>'field_home_problem_facts_source', 'label'=>'Source', 'name'=>'source', 'type'=>'text' ],
            [ 'key'=>'field_home_problem_facts_waterfall', 'label'=>'Waterfall steps (one per line)', 'name'=>'waterfall', 'type'=>'textarea' ],
        ] ],

        // ── Outcome ───────────────────────────────────────────────────────
        [ 'key'=>'field_home_outcome_tab', 'label'=>'Outcome', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_outcome_eyebrow', 'label'=>'Eyebrow', 'name'=>'outcome_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_heading_line1', 'label'=>'Heading Line 1', 'name'=>'outcome_heading_line1', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_heading_line2', 'label'=>'Heading Line 2 (muted)', 'name'=>'outcome_heading_line2', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_body', 'label'=>'Body', 'name'=>'outcome_body', 'type'=>'textarea' ],
        [ 'key'=>'field_home_outcome_stat_value', 'label'=>'Stat Value', 'name'=>'outcome_stat_value', 'type'=>'number' ],
        [ 'key'=>'field_home_outcome_stat_suffix', 'label'=>'Stat Suffix', 'name'=>'outcome_stat_suffix', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_quote_text', 'label'=>'Quote Text', 'name'=>'outcome_quote_text', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_quote_muted', 'label'=>'Quote Text (muted)', 'name'=>'outcome_quote_muted', 'type'=>'textarea' ],
        [ 'key'=>'field_home_outcome_source_line', 'label'=>'Source Line', 'name'=>'outcome_source_line', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_bridge', 'label'=>'Closing Bridge', 'name'=>'outcome_bridge', 'type'=>'textarea' ],
        [ 'key'=>'field_home_outcome_gallery_heading', 'label'=>'Gallery Heading', 'name'=>'outcome_gallery_heading', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_gallery_subhead', 'label'=>'Gallery Subhead', 'name'=>'outcome_gallery_subhead', 'type'=>'text' ],
        [ 'key'=>'field_home_outcome_cards', 'label'=>'Cards', 'name'=>'outcome_cards', 'type'=>'repeater', 'layout'=>'block', 'sub_fields'=>[
            [ 'key'=>'field_home_outcome_cards_src', 'label'=>'Image', 'name'=>'src', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_home_outcome_cards_alt', 'label'=>'Alt Text', 'name'=>'alt', 'type'=>'text' ],
            [ 'key'=>'field_home_outcome_cards_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_home_outcome_cards_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Who We Serve ──────────────────────────────────────────────────
        [ 'key'=>'field_home_serve_tab', 'label'=>'Who We Serve', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_serve_sr_heading', 'label'=>'Screen-reader Heading', 'name'=>'serve_sr_heading', 'type'=>'text' ],
        [ 'key'=>'field_home_serve_eyebrow', 'label'=>'Eyebrow', 'name'=>'serve_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_serve_heading_lead', 'label'=>'Heading (lead)', 'name'=>'serve_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_home_serve_heading_muted', 'label'=>'Heading (muted)', 'name'=>'serve_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_home_serve_body', 'label'=>'Body', 'name'=>'serve_body', 'type'=>'textarea' ],
        [ 'key'=>'field_home_serve_cta_label', 'label'=>'CTA Label', 'name'=>'serve_cta_label', 'type'=>'text' ],
        [ 'key'=>'field_home_serve_cta_url', 'label'=>'CTA URL', 'name'=>'serve_cta_url', 'type'=>'text' ],
        [ 'key'=>'field_home_serve_portrait_image', 'label'=>'Portrait Image', 'name'=>'serve_portrait_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_home_serve_portrait_alt', 'label'=>'Portrait Alt Text', 'name'=>'serve_portrait_alt', 'type'=>'text' ],
        [ 'key'=>'field_home_serve_personas', 'label'=>'Personas', 'name'=>'serve_personas', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_home_serve_personas_kind', 'label'=>'Kind', 'name'=>'kind', 'type'=>'select', 'choices'=>[ 'link'=>'link', 'popup'=>'popup' ] ],
            [ 'key'=>'field_home_serve_personas_key', 'label'=>'Key', 'name'=>'key', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_intro', 'label'=>'Intro', 'name'=>'intro', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_hook', 'label'=>'Hook', 'name'=>'hook', 'type'=>'textarea' ],
            [ 'key'=>'field_home_serve_personas_glyph', 'label'=>'Glyph', 'name'=>'glyph', 'type'=>'select', 'choices'=>[ 'briefcase'=>'briefcase', 'box'=>'box', 'building'=>'building', 'shield'=>'shield', 'device'=>'device', 'heart'=>'heart' ] ],
            [ 'key'=>'field_home_serve_personas_icon_variant', 'label'=>'Icon Variant', 'name'=>'icon_variant', 'type'=>'select', 'choices'=>[ 'peach'=>'peach', 'coral'=>'coral', 'ember'=>'ember' ] ],
            [ 'key'=>'field_home_serve_personas_href', 'label'=>'Href (link only)', 'name'=>'href', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_link_label', 'label'=>'Link Label (link only)', 'name'=>'link_label', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_audio_src', 'label'=>'Audio Src (link only)', 'name'=>'audio_src', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_audio_title', 'label'=>'Audio Title (link only)', 'name'=>'audio_title', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_audio_duration', 'label'=>'Audio Duration (sec, link only)', 'name'=>'audio_duration', 'type'=>'number' ],
            [ 'key'=>'field_home_serve_personas_headline_lead', 'label'=>'Headline (lead, popup only)', 'name'=>'headline_lead', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_headline_muted', 'label'=>'Headline (muted, popup only)', 'name'=>'headline_muted', 'type'=>'text' ],
            [ 'key'=>'field_home_serve_personas_description', 'label'=>'Description (popup only)', 'name'=>'description', 'type'=>'textarea' ],
            [ 'key'=>'field_home_serve_personas_metrics', 'label'=>'Metrics (popup only)', 'name'=>'metrics', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_home_serve_personas_metrics_lead', 'label'=>'Lead', 'name'=>'lead', 'type'=>'text' ],
                [ 'key'=>'field_home_serve_personas_metrics_caption', 'label'=>'Caption', 'name'=>'caption', 'type'=>'text' ],
                [ 'key'=>'field_home_serve_personas_metrics_comparison', 'label'=>'Comparison', 'name'=>'comparison', 'type'=>'text' ],
            ] ],
            [ 'key'=>'field_home_serve_personas_signals', 'label'=>'Signals (popup only)', 'name'=>'signals', 'type'=>'repeater', 'sub_fields'=>[
                [ 'key'=>'field_home_serve_personas_signals_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
                [ 'key'=>'field_home_serve_personas_signals_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
            ] ],
        ] ],

        // ── Customer Stories (Field Proof) ────────────────────────────────
        [ 'key'=>'field_home_stories_tab', 'label'=>'Customer Stories', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_stories_eyebrow', 'label'=>'Eyebrow', 'name'=>'stories_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_home_stories_heading_lead', 'label'=>'Heading (lead)', 'name'=>'stories_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_home_stories_heading_muted', 'label'=>'Heading (muted)', 'name'=>'stories_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_home_stories_intro', 'label'=>'Intro (HTML allowed)', 'name'=>'stories_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_home_stories_proofs', 'label'=>'Proofs', 'name'=>'stories_proofs', 'type'=>'repeater', 'layout'=>'block', 'button_label'=>'Add proof', 'sub_fields'=>[
            [ 'key'=>'field_home_stories_proofs_logo', 'label'=>'Source logo', 'name'=>'logo', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_home_stories_proofs_logo_alt', 'label'=>'Logo alt', 'name'=>'logo_alt', 'type'=>'text' ],
            [ 'key'=>'field_home_stories_proofs_stat', 'label'=>'Stat', 'name'=>'stat', 'type'=>'text' ],
            [ 'key'=>'field_home_stories_proofs_stat_class', 'label'=>'Stat size class (optional)', 'name'=>'stat_class', 'type'=>'text' ],
            [ 'key'=>'field_home_stories_proofs_measure', 'label'=>'Measure', 'name'=>'measure', 'type'=>'text' ],
            [ 'key'=>'field_home_stories_proofs_clause', 'label'=>'Clause', 'name'=>'clause', 'type'=>'textarea' ],
            [ 'key'=>'field_home_stories_proofs_source', 'label'=>'Source line', 'name'=>'source', 'type'=>'text' ],
            [ 'key'=>'field_home_stories_proofs_case_study_href', 'label'=>'Case study URL (optional)', 'name'=>'case_study_href', 'type'=>'text' ],
            [ 'key'=>'field_home_stories_proofs_case_study_label', 'label'=>'Case study link label (optional)', 'name'=>'case_study_label', 'type'=>'text' ],
        ] ],

        // ── Testimonials ──────────────────────────────────────────────────
        [ 'key'=>'field_home_testimonials_tab', 'label'=>'Testimonials', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_home_testimonials_heading', 'label'=>'Heading', 'name'=>'testimonials_heading', 'type'=>'text' ],
        [ 'key'=>'field_home_testimonials_items', 'label'=>'Testimonials', 'name'=>'testimonials_items', 'type'=>'repeater', 'layout'=>'block', 'button_label'=>'Add testimonial', 'sub_fields'=>[
            [ 'key'=>'field_home_testimonials_items_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_home_testimonials_items_quote', 'label'=>'Quote', 'name'=>'quote', 'type'=>'textarea' ],
            [ 'key'=>'field_home_testimonials_items_avatar', 'label'=>'Avatar', 'name'=>'avatar', 'type'=>'image', 'return_format'=>'url' ],
        ] ],
    ],
]);
