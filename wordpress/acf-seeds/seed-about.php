<?php
/**
 * Seeder — About page (slug: about).
 *
 * Note: three fields are intentionally left UNSEEDED so their on-brand styled
 * defaults (bold emphasis / inline links, which a plain textarea cannot carry)
 * render exactly as before: science_prose, science_aetna_quote, and
 * timeline_milestones. The fields still exist in ACF for editing.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-about.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('about', 'About');

// ── Team ─────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'team_heading_lead'   => 'The people who’ve seen what broken looks like.',
    'team_heading_muted'  => 'And know what better can be.',
    'team_intro'          => 'Chronilogix was founded and led by a team that brings together clinical science, healthcare strategy, technology, and the conviction that the people most in need of behavioral support are the least served by the systems designed to help them.',
    'team_advisors_label' => 'Advisory board',
]);
// `role` is the short title, `bio` the sentence(s) of standing under it —
// AboutTeam renders them as two separate blocks. The advisors' role used to
// carry "title. standing." as one blob, which rendered a paragraph in the
// role slot; it is now split like the leaders'.
update_field('team_leaders', [
    [ 'name' => 'Steven Amiel', 'role' => 'CEO and Cofounder', 'bio' => 'Visionary leader with a track record of scaling disruptive healthcare solutions.', 'photo' => chr_media('team/steven.png') ],
    [ 'name' => 'Dr. Kenneth Resnicow', 'role' => 'Chief Science Officer', 'bio' => 'Globally recognized expert in Motivational Interviewing, with 30+ years of evidence-based research behind our behavioral and chronic care coaching.', 'photo' => chr_media('team/ken.png'), 'more_href' => '#science', 'more_label' => 'Read the science' ],
    [ 'name' => 'Lou Ramery', 'role' => 'Chief Marketing Officer', 'bio' => 'Built and ran the CRM and loyalty programs for Sears and Kmart under Eddie Lampert. Global SVP at Digitas.', 'photo' => chr_media('team/lou.png') ],
    [ 'name' => 'Michael Lazor', 'role' => 'Fractional CTO', 'bio' => 'Manages the development team building the platform.', 'photo' => chr_media('team/michael.png') ],
], $pid);
// Each advisor now has their own portrait — these pointed at the leaders'
// files (steven/lou/michael) as stand-ins, so the board row showed the
// founders' faces under the advisors' names.
update_field('team_advisors', [
    [ 'name' => 'Nelson Griswold', 'role' => 'CEO, NextGen Benefits', 'bio' => 'One of the benefits industry’s most recognized strategic voices.', 'photo' => chr_media('team/nelson.png') ],
    [ 'name' => 'Geoffrey C. Williams, M.D., Ph.D.', 'role' => 'Clinical advisor', 'bio' => 'Global expert in the treatment of behavioral and chronic conditions.', 'photo' => chr_media('team/geoffrey.png') ],
    [ 'name' => 'Julian Lago', 'role' => 'Advisor', 'bio' => 'Entrepreneur with deep connections across healthcare and technology. Two healthcare tech exits in the last 24 months.', 'photo' => chr_media('team/julian.png') ],
], $pid);

// ── Science (prose + aetna_quote intentionally not seeded) ───────────────────
chr_fields($pid, [
    'science_eyebrow'               => 'Our foundation',
    'science_heading_line1'         => 'Thirty years of research.',
    'science_heading_line2'         => 'One breakthrough platform.',
    'science_portrait_name'         => 'Dr. Kenneth Resnicow',
    'science_portrait_role'         => 'Chief Science Officer',
    'science_portrait_institution1' => 'Professor,',
    'science_portrait_institution2' => 'University of Minnesota',
    'science_blog_label'            => 'Recent writing',
    'science_blog_all_label'        => 'All posts',
    'science_blog_all_href'         => '/resources/blog',
    'science_portrait_image'        => chr_media('ken-thumbnail.png'),
]);
update_field('science_metrics', [
    [ 'value' => '400+', 'label' => 'Peer reviewed publications', 'sub' => 'On Motivational Interviewing' ],
    [ 'value' => '70+', 'label' => 'Global clinical studies', 'sub' => 'Across diverse populations' ],
    [ 'value' => '10,000+', 'label' => 'Clinicians trained', 'sub' => 'Worldwide, across health systems' ],
], $pid);
update_field('science_deployments', [
    [ 'name' => 'Aetna' ], [ 'name' => 'Kaiser Permanente' ], [ 'name' => 'University of Minnesota' ],
    [ 'name' => 'AmeriHealth' ], [ 'name' => 'Caritas' ], [ 'name' => 'Active Health' ],
], $pid);
update_field('science_blog_cards', [
    [ 'title' => 'Motivational Interviewing, engineered for every member', 'byline' => 'Dr. Ken Resnicow', 'href' => '#TODO-blog-mi-engineered' ],
    [ 'title' => 'Inside Roni AI: clinical-grade coaching at scale', 'byline' => 'Chronilogix Research', 'href' => '#TODO-blog-roni-inside' ],
    [ 'title' => 'The MI fidelity rubric, in practice', 'byline' => 'Dr. Ken Resnicow', 'href' => '#TODO-blog-fidelity-rubric' ],
    [ 'title' => 'What a complex reflection actually does', 'byline' => 'Chronilogix Research', 'href' => '#TODO-blog-complex-reflection' ],
    [ 'title' => 'From 200+ RCTs to a coaching platform', 'byline' => 'Dr. Ken Resnicow', 'href' => '#TODO-blog-rcts-to-platform' ],
], $pid);

// ── Mission ──────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'mission_eyebrow'      => 'Our values',
    'mission_heading_lead' => 'Three things Chronilogix',
    'mission_heading_emph' => 'won’t compromise on.',
    'mission_intro'        => 'By partnering with healthcare leaders, employers, and clinicians, Chronilogix is rebuilding behavioral and chronic care from the ground up. Pushing the boundaries of applied AI while holding the line on what makes care worth having in the first place.',
]);
update_field('mission_values', [
    [ 'label' => 'Clinical integrity', 'body' => 'Every conversation Chronilogix has is grounded in clinical behavioral science, not wellness marketing. Our methodology is peer reviewed, our claims are evidence backed, and our coaching architecture is built on Motivational Interviewing: the most rigorously validated behavior change framework in the world.' ],
    [ 'label' => 'Human dignity', 'body' => 'Our platform is designed to feel like a conversation, not a transaction. People are met where they are, with the language they use, on the schedule they keep. Not managed toward where someone else wants them to be. No scripts. No nudges. No surveillance.' ],
    [ 'label' => 'Radical accessibility', 'body' => 'If we’re not reaching the people who fall through the cracks of traditional care, we’re not doing our job. That means meeting the night shift nurse at 3 AM, the underinsured worker who hasn’t seen a clinician in two years, and the person whose community makes therapy feel impossible.' ],
], $pid);

// ── Timeline (milestones intentionally not seeded — one entry has a link) ────
chr_fields($pid, [
    'timeline_eyebrow'      => 'Our timeline',
    'timeline_heading_lead' => 'Thirty years in the making.',
    'timeline_heading_muted'=> 'Built for right now.',
    'timeline_intro'        => 'Chronilogix didn’t start with a pitch deck. It started with research. The intellectual foundation of our platform, Motivational Interviewing as a scalable intervention for chronic and behavioral health, has been in development for over three decades. What’s changed is the technology available to deliver it.',
]);

// ── Purpose ──────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'purpose_eyebrow'      => 'Our purpose',
    'purpose_heading_lead' => 'The people nobody',
    'purpose_heading_emph' => 'was building for.',
    'purpose_intro1'       => 'We want to be honest about who Chronilogix is really for.',
    'purpose_intro2'       => 'Not the already engaged wellness consumer who tracks their sleep and orders supplements online. Not the fully insured employee at a large company with a robust benefits package.',
    'purpose_intro3'       => 'We are building for the people the healthcare system consistently fails to reach.',
    'purpose_reason'       => 'They are the reason Chronilogix exists.',
    'purpose_italic_line'  => 'We are here to help everyone.',
    'purpose_closing1'     => 'Filling the gaps includes everyone across all economic spectrum. No matter their coverage, whether insured through a plan, self-insured, or without a job, this is built to serve them all.',
    'purpose_closing2'     => 'Where affordability creates barriers, we bridge them, extending care from between visits through to ongoing aftercare support.',
    'purpose_quote'        => 'Chronilogix creates an emotionally accessible entry point for populations that might otherwise avoid support altogether.',
]);
update_field('purpose_personas', [
    [ 'lead' => 'The night shift nurse', 'rest' => 'who needs support at 3 AM.' ],
    [ 'lead' => 'The diabetic patient', 'rest' => 'who wants to stop taking their medication because they’re exhausted and nobody is checking in.' ],
    [ 'lead' => 'The underinsured worker', 'rest' => 'who has avoided care for two years because the deductible makes it inaccessible.' ],
    [ 'lead' => 'The person', 'rest' => 'who has never spoken honestly to a therapist because the stigma in their community makes it feel impossible.' ],
], $pid);

// ── Closing CTA ──────────────────────────────────────────────────────────────
chr_fields($pid, [
    'cta_heading_lead'      => 'Let’s create a future where',
    'cta_heading_emph'      => 'care listens first.',
    'cta_body'              => 'Whether you’re an employer, a health plan, a benefits broker, or someone looking for a better kind of support, we’d like to talk.',
    'cta_primary_label'     => 'Get in Touch',
    'cta_primary_url'       => 'mailto:steven@chronilogix.com',
    'cta_secondary_label'   => 'See How It Works',
    'cta_secondary_url'     => '/product',
    'cta_contact_intro'     => 'Or reach Steven directly',
    'cta_contact_name'      => 'Steven Amiel',
    'cta_contact_role'      => 'CEO',
    'cta_contact_email'     => 'steven@chronilogix.com',
    'cta_contact_phone'     => '(646) 522 1447',
    'cta_contact_phone_href'=> 'tel:+16465221447',
]);
// Two documents only, matching the global Footer strip. HIPAA and Security
// were placeholder anchors with no page behind them; /terms and /privacy are
// now real routes.
update_field('cta_legal_links', [
    [ 'label' => 'Terms', 'href' => '/terms' ],
    [ 'label' => 'Privacy', 'href' => '/privacy' ],
], $pid);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded About page (ID {$pid}).");
}
