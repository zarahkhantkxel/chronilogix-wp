<?php
/**
 * ACF field group for the About page (slug: about). Tab per section.
 * Image fields return a URL string. Repeaters model repeating collections.
 */

if (!defined('ABSPATH')) {
    exit;
}

acf_add_local_field_group([
    'key'          => 'group_about',
    'title'        => 'About Page',
    'location'     => chronilogix_acf_page_location('about'),
    'show_in_rest' => 1,
    'menu_order'   => 0,
    'fields'       => [

        // ── Team ──────────────────────────────────────────────────────────
        [ 'key'=>'field_about_team_tab', 'label'=>'Team', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_about_team_heading_lead', 'label'=>'Heading (lead)', 'name'=>'team_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_about_team_heading_muted', 'label'=>'Heading (muted)', 'name'=>'team_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_about_team_intro', 'label'=>'Intro', 'name'=>'team_intro', 'type'=>'textarea' ],
        // Role is the SHORT title (one scannable line: what they do here).
        // Bio is the sentence(s) of standing beneath it. AboutTeam renders
        // them as two separate blocks — brand-coloured role, then muted bio —
        // so do not put both in one field or the type hierarchy collapses.
        [ 'key'=>'field_about_team_leaders', 'label'=>'Leaders', 'name'=>'team_leaders', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_team_leaders_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            [ 'key'=>'field_about_team_leaders_role', 'label'=>'Role (short title)', 'name'=>'role', 'type'=>'text' ],
            [ 'key'=>'field_about_team_leaders_bio', 'label'=>'Bio (one or two sentences)', 'name'=>'bio', 'type'=>'textarea', 'rows'=>3 ],
            [ 'key'=>'field_about_team_leaders_photo', 'label'=>'Photo', 'name'=>'photo', 'type'=>'image', 'return_format'=>'url' ],
            [ 'key'=>'field_about_team_leaders_more_href', 'label'=>'More link href (optional)', 'name'=>'more_href', 'type'=>'text' ],
            [ 'key'=>'field_about_team_leaders_more_label', 'label'=>'More link label (optional)', 'name'=>'more_label', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_about_team_advisors_label', 'label'=>'Advisors Label', 'name'=>'team_advisors_label', 'type'=>'text' ],
        [ 'key'=>'field_about_team_advisors', 'label'=>'Advisors', 'name'=>'team_advisors', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_team_advisors_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
            // Was a textarea holding "title. standing." as one blob, which is
            // why the board rows used to render a paragraph in the role slot.
            [ 'key'=>'field_about_team_advisors_role', 'label'=>'Role (short title)', 'name'=>'role', 'type'=>'text' ],
            [ 'key'=>'field_about_team_advisors_bio', 'label'=>'Bio (one or two sentences)', 'name'=>'bio', 'type'=>'textarea', 'rows'=>3 ],
            [ 'key'=>'field_about_team_advisors_photo', 'label'=>'Photo', 'name'=>'photo', 'type'=>'image', 'return_format'=>'url' ],
        ] ],

        // ── Science ─────────────────────────────────────────────────────────
        [ 'key'=>'field_about_science_tab', 'label'=>'Science', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_about_science_eyebrow', 'label'=>'Eyebrow', 'name'=>'science_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_about_science_heading_line1', 'label'=>'Heading Line 1', 'name'=>'science_heading_line1', 'type'=>'text' ],
        [ 'key'=>'field_about_science_heading_line2', 'label'=>'Heading Line 2 (muted)', 'name'=>'science_heading_line2', 'type'=>'text' ],
        [ 'key'=>'field_about_science_prose', 'label'=>'Prose (leave empty to keep the styled default)', 'name'=>'science_prose', 'type'=>'textarea' ],
        [ 'key'=>'field_about_science_aetna_quote', 'label'=>'Aetna quote (leave empty to keep the styled default)', 'name'=>'science_aetna_quote', 'type'=>'textarea' ],
        [ 'key'=>'field_about_science_metrics', 'label'=>'Metrics', 'name'=>'science_metrics', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_science_metrics_value', 'label'=>'Value', 'name'=>'value', 'type'=>'text' ],
            [ 'key'=>'field_about_science_metrics_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_about_science_metrics_sub', 'label'=>'Sub', 'name'=>'sub', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_about_science_deployments', 'label'=>'Deployments', 'name'=>'science_deployments', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_science_deployments_name', 'label'=>'Name', 'name'=>'name', 'type'=>'text' ],
        ] ],
        [ 'key'=>'field_about_science_portrait_image', 'label'=>'Portrait Image', 'name'=>'science_portrait_image', 'type'=>'image', 'return_format'=>'url' ],
        [ 'key'=>'field_about_science_portrait_name', 'label'=>'Portrait Name', 'name'=>'science_portrait_name', 'type'=>'text' ],
        [ 'key'=>'field_about_science_portrait_role', 'label'=>'Portrait Role', 'name'=>'science_portrait_role', 'type'=>'text' ],
        [ 'key'=>'field_about_science_portrait_institution1', 'label'=>'Portrait Institution line 1', 'name'=>'science_portrait_institution1', 'type'=>'text' ],
        [ 'key'=>'field_about_science_portrait_institution2', 'label'=>'Portrait Institution line 2', 'name'=>'science_portrait_institution2', 'type'=>'text' ],
        [ 'key'=>'field_about_science_blog_label', 'label'=>'Blog rail label', 'name'=>'science_blog_label', 'type'=>'text' ],
        [ 'key'=>'field_about_science_blog_all_label', 'label'=>'All-posts label', 'name'=>'science_blog_all_label', 'type'=>'text' ],
        [ 'key'=>'field_about_science_blog_all_href', 'label'=>'All-posts href', 'name'=>'science_blog_all_href', 'type'=>'text' ],
        [ 'key'=>'field_about_science_blog_cards', 'label'=>'Blog Cards', 'name'=>'science_blog_cards', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_science_blog_cards_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_about_science_blog_cards_byline', 'label'=>'Byline', 'name'=>'byline', 'type'=>'text' ],
            [ 'key'=>'field_about_science_blog_cards_href', 'label'=>'Href', 'name'=>'href', 'type'=>'text' ],
        ] ],

        // ── Mission ─────────────────────────────────────────────────────────
        [ 'key'=>'field_about_mission_tab', 'label'=>'Mission', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_about_mission_eyebrow', 'label'=>'Eyebrow', 'name'=>'mission_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_about_mission_heading_lead', 'label'=>'Heading (lead)', 'name'=>'mission_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_about_mission_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'mission_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_about_mission_intro', 'label'=>'Intro', 'name'=>'mission_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_about_mission_values', 'label'=>'Values', 'name'=>'mission_values', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_mission_values_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_about_mission_values_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Timeline ────────────────────────────────────────────────────────
        [ 'key'=>'field_about_timeline_tab', 'label'=>'Timeline', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_about_timeline_eyebrow', 'label'=>'Eyebrow', 'name'=>'timeline_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_about_timeline_heading_lead', 'label'=>'Heading (lead)', 'name'=>'timeline_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_about_timeline_heading_muted', 'label'=>'Heading (muted)', 'name'=>'timeline_heading_muted', 'type'=>'text' ],
        [ 'key'=>'field_about_timeline_intro', 'label'=>'Intro', 'name'=>'timeline_intro', 'type'=>'textarea' ],
        [ 'key'=>'field_about_timeline_milestones', 'label'=>'Milestones', 'name'=>'timeline_milestones', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_timeline_milestones_era', 'label'=>'Era', 'name'=>'era', 'type'=>'text' ],
            [ 'key'=>'field_about_timeline_milestones_title', 'label'=>'Title', 'name'=>'title', 'type'=>'text' ],
            [ 'key'=>'field_about_timeline_milestones_body', 'label'=>'Body', 'name'=>'body', 'type'=>'textarea' ],
        ] ],

        // ── Purpose ─────────────────────────────────────────────────────────
        [ 'key'=>'field_about_purpose_tab', 'label'=>'Purpose', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_about_purpose_eyebrow', 'label'=>'Eyebrow', 'name'=>'purpose_eyebrow', 'type'=>'text' ],
        [ 'key'=>'field_about_purpose_heading_lead', 'label'=>'Heading (lead)', 'name'=>'purpose_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_about_purpose_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'purpose_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_about_purpose_intro1', 'label'=>'Intro 1', 'name'=>'purpose_intro1', 'type'=>'textarea' ],
        [ 'key'=>'field_about_purpose_intro2', 'label'=>'Intro 2', 'name'=>'purpose_intro2', 'type'=>'textarea' ],
        [ 'key'=>'field_about_purpose_intro3', 'label'=>'Intro 3', 'name'=>'purpose_intro3', 'type'=>'textarea' ],
        [ 'key'=>'field_about_purpose_personas', 'label'=>'Personas', 'name'=>'purpose_personas', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_purpose_personas_lead', 'label'=>'Lead', 'name'=>'lead', 'type'=>'text' ],
            [ 'key'=>'field_about_purpose_personas_rest', 'label'=>'Rest', 'name'=>'rest', 'type'=>'textarea' ],
        ] ],
        [ 'key'=>'field_about_purpose_reason', 'label'=>'Reason line', 'name'=>'purpose_reason', 'type'=>'text' ],
        [ 'key'=>'field_about_purpose_italic_line', 'label'=>'Italic line', 'name'=>'purpose_italic_line', 'type'=>'text' ],
        [ 'key'=>'field_about_purpose_closing1', 'label'=>'Closing 1', 'name'=>'purpose_closing1', 'type'=>'textarea' ],
        [ 'key'=>'field_about_purpose_closing2', 'label'=>'Closing 2', 'name'=>'purpose_closing2', 'type'=>'textarea' ],
        [ 'key'=>'field_about_purpose_quote', 'label'=>'Quote', 'name'=>'purpose_quote', 'type'=>'textarea' ],

        // ── Closing CTA ─────────────────────────────────────────────────────
        [ 'key'=>'field_about_cta_tab', 'label'=>'Closing CTA', 'name'=>'', 'type'=>'tab' ],
        [ 'key'=>'field_about_cta_heading_lead', 'label'=>'Heading (lead)', 'name'=>'cta_heading_lead', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_heading_emph', 'label'=>'Heading (emphasis)', 'name'=>'cta_heading_emph', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_body', 'label'=>'Body', 'name'=>'cta_body', 'type'=>'textarea' ],
        [ 'key'=>'field_about_cta_primary_label', 'label'=>'Primary CTA label', 'name'=>'cta_primary_label', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_primary_url', 'label'=>'Primary CTA url', 'name'=>'cta_primary_url', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_secondary_label', 'label'=>'Secondary CTA label', 'name'=>'cta_secondary_label', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_secondary_url', 'label'=>'Secondary CTA url', 'name'=>'cta_secondary_url', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_contact_intro', 'label'=>'Contact intro', 'name'=>'cta_contact_intro', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_contact_name', 'label'=>'Contact name', 'name'=>'cta_contact_name', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_contact_role', 'label'=>'Contact role', 'name'=>'cta_contact_role', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_contact_email', 'label'=>'Contact email', 'name'=>'cta_contact_email', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_contact_phone', 'label'=>'Contact phone (display)', 'name'=>'cta_contact_phone', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_contact_phone_href', 'label'=>'Contact phone href', 'name'=>'cta_contact_phone_href', 'type'=>'text' ],
        [ 'key'=>'field_about_cta_legal_links', 'label'=>'Legal Links', 'name'=>'cta_legal_links', 'type'=>'repeater', 'sub_fields'=>[
            [ 'key'=>'field_about_cta_legal_links_label', 'label'=>'Label', 'name'=>'label', 'type'=>'text' ],
            [ 'key'=>'field_about_cta_legal_links_href', 'label'=>'Href', 'name'=>'href', 'type'=>'text' ],
        ] ],
    ],
]);
