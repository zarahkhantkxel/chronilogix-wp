<?php
/**
 * Seeder — Solutions / App Partners page (slug: solutions-app-partners).
 *
 * Note: three fields are intentionally left UNSEEDED so their on-brand
 * styled defaults render exactly as before: hero_intro (inline emphasis
 * spans a plain textarea cannot carry), and proof_quote / proof_attribution
 * (which fall back to the shared Aetna quote constant). The fields still
 * exist in ACF for editing.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-solutions-app-partners.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('solutions-app-partners', 'Solutions — App Partners');

// ── Hero (hero_intro intentionally not seeded) ───────────────────────────────
chr_fields($pid, [
    'hero_eyebrow'         => 'For product & partnership leads',
    'hero_heading_bright'  => 'The engagement layer',
    'hero_heading_muted'   => 'your platform is missing.',
    'hero_primary_label'   => 'Explore the partnership',
    'hero_primary_url'     => '#book-a-demo',
    'hero_secondary_label' => 'Download the whitepaper',
    'hero_secondary_url'   => '/chronilogix-mi-whitepaper.pdf',
]);

// ── Problem ──────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'problem_eyebrow'                     => 'Where wellness apps hit the wall',
    'problem_heading_lead'                => 'Engagement got you here.',
    'problem_heading_muted'               => 'Coaching won’t get you further.',
    'problem_lead'                        => 'You have a wellness app with real engagement. Users are showing up. But the coaching experience — the part that should drive lasting behavior change — is still shallow, and your most sophisticated users are starting to notice.',
    'problem_closing'                     => 'Building a genuinely clinical AI coaching engine takes years of behavioral science expertise and millions in development. Your product roadmap cannot wait for that. And your competitors are not standing still.',
    'problem_roadmap_you_heading'         => 'You',
    'problem_roadmap_competitor_heading'  => 'Your competitors',
]);
update_field('problem_you_tickets', [
    [ 'title' => 'Onboarding v2', 'priority' => 'P0', 'variant' => '' ],
    [ 'title' => 'New widget', 'priority' => 'P1', 'variant' => '' ],
    [ 'title' => 'Referrals', 'priority' => 'P2', 'variant' => '' ],
    [ 'title' => 'Notifications', 'priority' => 'P2', 'variant' => '' ],
    [ 'title' => 'AI coaching', 'priority' => 'still pending', 'variant' => 'pending' ],
], $pid);
update_field('problem_competitor_tickets', [
    [ 'title' => 'AI coaching', 'priority' => 'shipped', 'variant' => 'shipped' ],
    [ 'title' => 'Onboarding v2', 'priority' => 'P0', 'variant' => '' ],
    [ 'title' => 'New widget', 'priority' => 'P1', 'variant' => '' ],
    [ 'title' => 'Referrals', 'priority' => 'P2', 'variant' => '' ],
    [ 'title' => 'Notifications', 'priority' => 'P2', 'variant' => '' ],
], $pid);

// ── Pillars ──────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'pillars_eyebrow' => 'What Chronilogix brings inside',
    'pillars_heading' => 'A clinical engine, not a chatbot skin.',
]);
update_field('pillars_items', [
    [ 'title' => 'Thirty years of methodology, delivered as an API', 'body' => 'Motivational Interviewing built by Dr. Ken Resnicow, wrapped in a modern coaching runtime. No behavioral-science team to hire. No decade of trials to run. Plug in and ship.' ],
    [ 'title' => 'White-labeled from the surface down', 'body' => 'Your brand, your voice, your UI. Chronilogix is the intelligence underneath — invisible to your user, indispensable to your product.' ],
    [ 'title' => 'Every health-plan sale ships with it', 'body' => 'Sign a plan, Chronilogix is included. Every new deal expands your coaching reach without expanding your roadmap or headcount.' ],
], $pid);

// ── Diagram ──────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'diagram_eyebrow'      => 'How it fits inside your product',
    'diagram_heading'      => 'One integration. Every coaching moment.',
    'diagram_engine_title' => 'Chronilogix coaching engine',
]);
update_field('diagram_engine_cards', [
    [ 'title' => 'MI methodology', 'body' => 'Thirty years of Dr. Resnicow\'s research, encoded as coaching moves.' ],
    [ 'title' => 'Roni AI runtime', 'body' => 'The reasoning layer that composes each reply in real time.' ],
    [ 'title' => 'Clinical guardrails', 'body' => 'Safety, escalation, and consent handled before your app ever sees a reply.' ],
], $pid);
update_field('diagram_captions', [
    [ 'label' => 'You send', 'body' => 'User message + context, over a single REST call.' ],
    [ 'label' => 'Chronilogix returns', 'body' => 'A clinically grounded reply, ready to render in your UI.' ],
    [ 'label' => 'You keep', 'body' => 'Data, brand, and the relationship with your user.' ],
], $pid);

// ── Numbers ──────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'numbers_eyebrow'     => 'By the numbers',
    'numbers_heading'     => 'What partners get without lifting a finger.',
    'numbers_range_label' => 'I to III',
    'numbers_footnote'    => 'Chronilogix business model — Roni AI embedded as the coaching engine inside partner apps.',
]);
update_field('numbers_metrics', [
    [ 'lead' => '0', 'caption' => 'Behavioral-science hires needed', 'comparison' => 'Team of PhDs → API call' ],
    [ 'lead' => '30 yrs', 'caption' => 'Of methodology, embedded', 'comparison' => 'Build from zero → Dr. Resnicow\'s life\'s work' ],
    [ 'lead' => 'Auto', 'caption' => 'Every plan sale ships with it', 'comparison' => 'Extra deal → wider distribution' ],
], $pid);

// ── Distribution ─────────────────────────────────────────────────────────────
chr_fields($pid, [
    'distribution_eyebrow' => 'The distribution kicker',
    'distribution_heading' => 'Every plan you close makes your product better.',
    'distribution_body1'   => 'When you sell a new health plan into your platform, Chronilogix comes with it. Automatically. Your coaching depth grows every time BD wins — no roadmap cost, no re-integration.',
    'distribution_body2'   => 'It’s the rare distribution model where each new partnership expands the underlying product, instead of stretching your team thinner.',
]);
update_field('distribution_deals', [
    [ 'label' => 'Regional plan', 'caption' => 'Small footprint' ],
    [ 'label' => 'Multi-state plan', 'caption' => 'Mid-market' ],
    [ 'label' => 'National plan', 'caption' => 'Enterprise reach' ],
], $pid);

// ── Proof (quote + attribution intentionally not seeded) ─────────────────────
chr_fields($pid, [
    'proof_label'  => 'Proof from the underlying platform',
    'proof_footer' => 'The same Chronilogix engine your app would embed.',
]);

// ── Trust ────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'trust_eyebrow'          => 'Trust & security',
    'trust_heading'          => 'A partner your security team will actually approve.',
    'trust_compliance_label' => 'Compliance posture',
    'trust_compliance_body'  => 'The certifications your security review will ask about before an integration approval, ready in one link.',
]);
update_field('trust_lines', [
    [ 'line' => 'Member data is never used to train our models.' ],
    [ 'line' => 'SOC 2 Type II and GDPR Ready — verified, not aspirational.' ],
    [ 'line' => 'HIPAA-compliant infrastructure with clinical-grade guardrails.' ],
], $pid);

// ── FAQ ──────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'faq_eyebrow' => 'Partner FAQ',
    'faq_heading' => 'What partners ask us first.',
    'faq_intro'   => 'The five questions that come up in the first technical conversation — answered before you have to ask.',
]);
update_field('faq_questions', [
    [ 'q' => 'How does the integration work — REST, SDK, both?', 'a' => 'REST is the default surface — a single call in, a clinically grounded reply back. SDKs for common runtimes are in scope depending on partner needs. Contact us for the technical brief.' ],
    [ 'q' => 'Do we control the branding and the surface?', 'a' => 'Yes. Chronilogix is white-labeled from the surface down. Your brand, your voice, your UI. The engine is invisible to your user, indispensable to your product.' ],
    [ 'q' => 'How is member data handled between our platform and Chronilogix?', 'a' => 'Member data stays with you. Chronilogix processes context to compose each reply, but does not use member data to train our models. Full data-handling posture is in the technical brief.' ],
    [ 'q' => 'What does \'automatically included with plan sales\' mean commercially?', 'a' => 'When you sell a health plan into your platform, Chronilogix is bundled with that deal automatically — no separate procurement cycle. We align on the commercial structure per partnership.' ],
    [ 'q' => 'How fast can we ship a working integration?', 'a' => 'First integrations typically land in weeks, not quarters. The exact timeline depends on your stack and product surface — contact us to align on scope.' ],
], $pid);

// ── Closing CTA ──────────────────────────────────────────────────────────────
chr_fields($pid, [
    'cta_eyebrow'         => 'One integration, thirty years of science.',
    'cta_heading_lead'    => 'Ship the coaching',
    'cta_heading_brand'   => 'your users deserve.',
    'cta_body'            => 'Chronilogix is the clinical intelligence layer built to live inside other products. Bring Dr. Resnicow’s methodology to your users — without waiting a decade to build it yourself.',
    'cta_primary_label'   => 'Explore the partnership',
    'cta_primary_url'     => '#book-a-demo',
    'cta_secondary_label' => 'Download the whitepaper',
    'cta_secondary_url'   => '/chronilogix-mi-whitepaper.pdf',
    'cta_footer'          => 'Grounded in 30 years of Motivational Interviewing research. Built for embedding. Available 24/7 to your users.',
]);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded Solutions — App Partners page (ID {$pid}).");
}
