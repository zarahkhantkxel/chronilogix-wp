<?php
/**
 * ACF field groups for the two legal pages (slugs: privacy, terms).
 *
 * Unlike the other files in this directory this one covers TWO pages, because
 * both documents render through the same components (LegalHero / LegalDocument
 * / LegalCrossLink) and therefore expose an identical field shape. Registering
 * them from one loop keeps the two groups from drifting apart.
 *
 * SCOPE — deliberately hero/meta only. The clause bodies live in the frontend
 * at components/legal/legal-content.ts and are NOT editable here. That copy is
 * counsel-reviewed and its typed block structure (conspicuous warn/affirm
 * notices, definition lists, lettered subsections with stable anchors that
 * legal cites point at) has no faithful ACF representation — a WYSIWYG would
 * flatten the semantics and let a liability clause be reworded without review.
 * See docs/legal-open-items.md in the frontend repo.
 */

if (!defined('ABSPATH')) {
    exit;
}

$chronilogix_legal_pages = [
    'privacy' => 'Privacy Policy',
    'terms'   => 'Terms & Conditions',
];

foreach ($chronilogix_legal_pages as $chronilogix_legal_slug => $chronilogix_legal_title) {
    acf_add_local_field_group([
        'key'          => 'group_legal_' . $chronilogix_legal_slug,
        'title'        => $chronilogix_legal_title . ' Page',
        'location'     => chronilogix_acf_page_location($chronilogix_legal_slug),
        'show_in_rest' => 1,
        'menu_order'   => 0,
        'fields'       => [

            // ── Hero ──────────────────────────────────────────────────────
            [
                'key'   => 'field_legal_' . $chronilogix_legal_slug . '_hero_tab',
                'label' => 'Hero',
                'name'  => '',
                'type'  => 'tab',
            ],
            [
                'key'   => 'field_legal_' . $chronilogix_legal_slug . '_eyebrow',
                'label' => 'Eyebrow',
                'name'  => 'legal_eyebrow',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_legal_' . $chronilogix_legal_slug . '_title',
                'label' => 'Title',
                'name'  => 'legal_title',
                'type'  => 'text',
            ],
            [
                'key'         => 'field_legal_' . $chronilogix_legal_slug . '_title_tail',
                'label'       => 'Title (tail)',
                'instructions' => 'Second half of the headline — rendered in the muted/italic treatment.',
                'name'        => 'legal_title_tail',
                'type'        => 'text',
            ],
            [
                'key'   => 'field_legal_' . $chronilogix_legal_slug . '_intro',
                'label' => 'Intro',
                'name'  => 'legal_intro',
                'type'  => 'textarea',
                'rows'  => 4,
            ],
            [
                'key'          => 'field_legal_' . $chronilogix_legal_slug . '_updated',
                'label'        => 'Last updated',
                'instructions' => 'Shown verbatim, e.g. "January 12, 2026". Bump this whenever counsel revises the document body.',
                'name'         => 'legal_updated',
                'type'         => 'text',
            ],

            // ── Contact ───────────────────────────────────────────────────
            [
                'key'   => 'field_legal_' . $chronilogix_legal_slug . '_contact_tab',
                'label' => 'Contact',
                'name'  => '',
                'type'  => 'tab',
            ],
            [
                'key'          => 'field_legal_' . $chronilogix_legal_slug . '_contact_email',
                'label'        => 'Contact email',
                'instructions' => 'Used by the document footer and the cross-link card. Leave empty to keep the built-in default.',
                'name'         => 'legal_contact_email',
                'type'         => 'email',
            ],
        ],
    ]);
}

unset($chronilogix_legal_pages, $chronilogix_legal_slug, $chronilogix_legal_title);
