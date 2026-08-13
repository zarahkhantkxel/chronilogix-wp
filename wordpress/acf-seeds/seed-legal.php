<?php
/**
 * Seeder — the two legal pages (slugs: privacy, terms).
 *
 * Seeds ONLY the hero/meta fields. The clause bodies deliberately stay in the
 * frontend at components/legal/legal-content.ts (counsel-reviewed copy whose
 * typed block structure has no faithful ACF representation) — see the header of
 * wp-content/mu-plugins/chronilogix-acf/legal.php.
 *
 * Values here mirror PRIVACY_DOC / TERMS_DOC in legal-content.ts, so seeding
 * changes nothing visually. It exists so the fields are populated (rather than
 * empty) and an editor can see and adjust the real copy in wp-admin.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-legal.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

// Mirrors LAST_UPDATED in components/legal/legal-content.ts.
$last_updated  = 'April 20, 2026';
// Mirrors LEGAL_CONTACT in components/legal/legal-content.ts.
$legal_contact = 'support@chronilogix.com';

$docs = [
    'privacy' => [
        'title_wp'         => 'Privacy Policy',
        'legal_eyebrow'    => 'Legal',
        'legal_title'      => 'Privacy',
        'legal_title_tail' => 'Policy',
        'legal_intro'      => 'How Chronilogix collects, uses, stores, processes, and protects your information — and, given the sensitivity of the data involved, what we do and do not do with it.',
    ],
    'terms' => [
        'title_wp'         => 'Terms & Conditions',
        'legal_eyebrow'    => 'Legal',
        'legal_title'      => 'Terms and',
        'legal_title_tail' => 'Conditions',
        'legal_intro'      => 'The agreement between you and Chronilogix, Inc. governing your access to and use of the Chronilogix behavioral health and chronic care support application and related services.',
    ],
];

foreach ($docs as $slug => $doc) {
    $pid = chr_page($slug, $doc['title_wp']);
    if (!$pid) {
        continue;
    }

    chr_fields($pid, [
        'legal_eyebrow'       => $doc['legal_eyebrow'],
        'legal_title'         => $doc['legal_title'],
        'legal_title_tail'    => $doc['legal_title_tail'],
        'legal_intro'         => $doc['legal_intro'],
        'legal_updated'       => $last_updated,
        'legal_contact_email' => $legal_contact,
    ]);

    if (class_exists('WP_CLI')) {
        WP_CLI::log("seeded {$slug} (page {$pid})");
    }
}

if (class_exists('WP_CLI')) {
    WP_CLI::success('Legal pages seeded.');
}
