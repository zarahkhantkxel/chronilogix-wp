<?php
/**
 * Seeder — Partner Solutions page (slug: partner-solutions).
 *
 * The partner_logos repeater feeds two surfaces: the hero proof row on this
 * page and the Partner Solutions promo card in the Solutions nav menu, which
 * components/Nav.tsx reads from this same page slug.
 *
 * Note: the ZENN bundle's video_src points at /video/zenn-demo.mp4, which is
 * not yet in public/video/ (only the poster is). This matches the source repo
 * and the existing SectionGuide widget — drop the mp4 in and it starts working
 * with no code or content change.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-partner-solutions.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('partner-solutions', 'Partner Solutions');

$balance  = chr_media('partners/balance-for-life-logo.png');
$medimart = chr_media('partners/medimart-logo.png');
$hibiscus = chr_media('partners/hibiscus-health-logo.png');
$poster   = chr_media('video/zenn-demo-poster.jpg');

// ── Hero ─────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'hero_eyebrow'       => 'Partner Solutions',
    'hero_heading_lead'  => 'Extend Your Solution.',
    'hero_heading_brand' => 'Increase Your Value.',
    'hero_intro'         => 'Chronilogix doesn’t replace your product — we make it smarter, more engaging, and more effective through continuous AI coaching.',
    'hero_subintro'      => 'Three examples of how we bundle with industry leaders.',
    'hero_cta_label'     => 'Book a Demo',
    'hero_cta_url'       => '#book-a-demo',
]);

// ── Partner logos (hero proof row + Solutions nav card) ──────────────────────
chr_fields($pid, [
    'partner_logos' => [
        [ 'logo' => $balance,  'alt' => 'Balance for Life' ],
        [ 'logo' => $medimart, 'alt' => 'Medimart' ],
        [ 'logo' => $hibiscus, 'alt' => 'Hibiscus Health' ],
    ],
]);

// ── Nav card ─────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'nav_card_title' => 'Partner Solutions',
    'nav_card_hook'  => 'See how Chronilogix makes existing healthcare products more valuable.',
]);

// ── Bundles ──────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'bundles' => [
        [
            'key'      => 'zenn',
            'title'    => 'ZENN + Balance for Life',
            'category' => 'AI-Powered Behavioral Wellness',
            'lead'     => [
                [ 'text' => 'Balance for Life provides an excellent wellness platform. ZENN, powered by Chronilogix, provides the continuous behavioral coaching between moments that keeps members engaged.' ],
                [ 'text' => 'Instead of opening the app only occasionally, members have a trusted AI coach available 24/7 that remembers their goals, conversations, and progress.' ],
            ],
            'pointers_heading' => 'Together they deliver',
            'pointers' => [
                [ 'text' => 'Continuous behavioral coaching' ],
                [ 'text' => 'Higher member engagement' ],
                [ 'text' => 'Increased retention' ],
                [ 'text' => 'Better emotional wellbeing' ],
                [ 'text' => 'A more valuable wellness platform' ],
            ],
            'lead_after' => '',
            'tagline'    => 'A wellness platform with a coach that never sleeps.',
            'graphic'    => 'video',
            'logo'       => $balance,
            'logo_alt'   => 'Balance for Life',
            'video_poster'  => $poster,
            'video_src'     => '/video/zenn-demo.mp4',
            'video_runtime' => '4:06',
            'video_eyebrow' => 'Live demo',
            'video_title'   => 'See Chronilogix, white-labeled as Zenn',
            'video_blurb'   => 'Our platform in action, running inside a partner’s own app.',
            'video_credit'  => 'ZENN powered by Chronilogix',
        ],
        [
            'key'      => 'medimart',
            'title'    => 'Medimart + Chronilogix',
            'category' => 'Affordable Medications + Better Outcomes',
            'lead'     => [
                [ 'text' => 'Getting affordable medications is only half the battle. Patients still need help:' ],
            ],
            'pointers_heading' => '',
            'pointers' => [
                [ 'text' => 'Remembering medications' ],
                [ 'text' => 'Staying motivated' ],
                [ 'text' => 'Changing behaviors' ],
                [ 'text' => 'Improving nutrition' ],
                [ 'text' => 'Managing diabetes' ],
                [ 'text' => 'Coping with anxiety and depression' ],
            ],
            'lead_after' => 'Together, Medimart and Chronilogix combine affordable medications with free AI coaching for diabetes and mental health, helping patients bridge the gap between receiving a prescription and achieving better health outcomes.',
            'tagline'    => 'Lower prescription costs. Better health outcomes.',
            'graphic'    => 'list',
            'graphic_heading' => 'With Medimart + Chronilogix',
            'graphic_list' => [
                [ 'text' => 'Lower medication costs' ],
                [ 'text' => 'Better medication adherence' ],
                [ 'text' => 'Diabetes coaching' ],
                [ 'text' => 'Mental health support' ],
                [ 'text' => 'Improved long-term outcomes' ],
            ],
            'graphic_footnote' => 'Prescriptions that reach the outcome',
            'logo'     => $medimart,
            'logo_alt' => 'Medimart',
        ],
        [
            'key'      => 'hibiscus',
            'title'    => 'Hibiscus Health + Chronilogix',
            'category' => 'Screening Meets Sustained Behavior Change',
            'lead'     => [
                [ 'text' => 'Hibiscus Health helps identify health risks through advanced scanning technology. Chronilogix transforms those insights into personalized action by delivering ongoing AI coaching based on each individual’s results, goals, behaviors, and progress.' ],
                [ 'text' => 'Instead of receiving a report and being left on their own, members receive continuous support to help them make meaningful lifestyle changes.' ],
            ],
            'pointers_heading' => 'Together they deliver',
            'pointers' => [
                [ 'text' => 'Early risk identification' ],
                [ 'text' => 'Personalized coaching informed by scan results' ],
                [ 'text' => 'Chronic disease prevention' ],
                [ 'text' => 'Continuous engagement between healthcare visits' ],
                [ 'text' => 'Better long-term health outcomes' ],
            ],
            'lead_after' => '',
            'tagline'    => 'Scan. Understand. Improve.',
            'graphic'    => 'steps',
            'graphic_steps' => [
                [
                    'heading' => 'Scan',
                    'body'    => 'Advanced scanning technology flags health risks early — before they surface as claims.',
                    'meta'    => 'Biomarkers · vitals · risk factors',
                ],
                [
                    'heading' => 'Understand',
                    'body'    => 'Chronilogix turns each result into a personalized plan built around the member’s goals and behaviors.',
                    'meta'    => 'Results · goals · progress',
                ],
                [
                    'heading' => 'Improve',
                    'body'    => 'Ongoing AI coaching between visits drives meaningful, lasting lifestyle change.',
                    'meta'    => '24/7 support · continuous care',
                ],
            ],
            'logo'     => $hibiscus,
            'logo_alt' => 'Hibiscus Health',
        ],
    ],
]);

// ── Closing panel ────────────────────────────────────────────────────────────
chr_fields($pid, [
    'closing_heading_brand' => 'Your Solution',
    'closing_heading_rest'  => '+ Chronilogix',
    'closing_sub_lead'      => 'Imagine what AI coaching could do for',
    'closing_sub_brand'     => 'your organization.',
    'closing_body'          => 'Whether you provide wellness programs, digital health platforms, pharmacies, medical devices, health screenings, employer benefits, disease management, remote monitoring, nutrition, or telehealth —',
    'closing_body_brand'    => 'there’s a coaching layer to add.',
    'cta_heading_lead'      => 'Already have a healthcare solution?',
    'cta_heading_muted'     => 'Let’s build something better together.',
    'cta_body'              => 'Chronilogix can add a clinically grounded, Motivational Interviewing-based AI coaching layer that increases engagement, improves outcomes, and creates new value for your members.',
    'cta_label'             => 'Book a Demo',
    'cta_url'               => '#book-a-demo',
]);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded Partner Solutions page (ID {$pid}).");
}
