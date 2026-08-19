<?php
/**
 * Seeder — Solutions — Vendors page (slug: solutions-vendors).
 *
 * Note: one field is intentionally left UNSEEDED so its on-brand styled
 * default (an inline <em> emphasis a plain textarea cannot carry) renders
 * exactly as before: upgrade_body. The field still exists in ACF for editing.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-solutions-vendors.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('solutions-vendors', 'Solutions — Vendors');

// ── Hero ─────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'hero_eyebrow'       => 'For chronic care product vendors',
    'hero_headline_lead' => 'Success isn’t what you deliver.',
    'hero_headline_hero' => 'It’s what patients keep using.',
    'hero_intro'         => 'Chronilogix helps chronic care vendors improve adherence, increase retention, and deliver measurable health outcomes through 24/7 AI-powered coaching that works alongside your existing products.',
    'hero_cta_label'     => 'Book a Demo',
    'hero_cta_url'       => '#book-a-demo',
]);

// ── After Delivery ─────────────────────────────────────────────────────────
chr_fields($pid, [
    'after_eyebrow'      => 'The reality vendors face',
    'after_heading_lead' => 'After delivery, adherence',
    'after_heading_emph' => 'quietly slips.',
    'after_body'         => 'Products get prescribed, shipped, and then quietly underused — adherence drops after the first 30 to 90 days. Competing on features, price, or distribution won’t fix it. And payers, employers, and partners are no longer impressed by logistics alone. They want outcomes.',
    'after_reframe_lead' => 'The product isn’t the problem.',
    'after_reframe_emph' => 'What happens after delivery is.',
    'after_left_label'   => 'What patients do',
    'after_left_sub'     => 'After the product ships',
    'after_right_label'  => 'What it costs you',
    'after_right_sub'    => 'Within the first few months',
]);
update_field('after_behaviors', [
    [ 'label' => 'Patients lose motivation' ],
    [ 'label' => 'Treatment routines become difficult' ],
    [ 'label' => 'Life gets in the way' ],
    [ 'label' => 'Engagement slowly disappears' ],
], $pid);
update_field('after_results', [
    [ 'label' => 'Adherence declines' ],
    [ 'label' => 'Retention drops' ],
    [ 'label' => 'Value gets harder to prove' ],
], $pid);

// ── Upgrade (upgrade_body intentionally not seeded — styled <em> default) ────
chr_fields($pid, [
    'upgrade_eyebrow'      => 'The upgrade',
    'upgrade_heading_pre'  => 'Chronilogix is the',
    'upgrade_heading_emph' => 'outcomes upgrade',
    'upgrade_heading_post' => 'your products have been missing.',
]);
update_field('upgrade_properties', [
    [ 'title' => 'Sustained utilization', 'body' => 'Patients keep using what you ship, long past the first 90 days.' ],
    [ 'title' => 'Higher adherence', 'body' => 'The care plan sticks, because someone keeps showing up for it.' ],
    [ 'title' => 'Measurable results', 'body' => 'Real-world outcomes your buyers can defend at renewal.' ],
], $pid);

// ── Program Gap ──────────────────────────────────────────────────────────────
chr_fields($pid, [
    'program_heading_lead' => 'Specialized 24/7 AI coaches that keep patients',
    'program_heading_emph' => 'engaged.',
    'program_body1'        => 'Chronilogix gives every patient a dedicated AI coach for their condition, a mental health coach or a diabetes coach, available 24/7 to guide, motivate, and support them throughout their care.',
    'program_body2'        => 'Each coach is trained in Motivational Interviewing and backed by Dr. Ken Resnicow’s 30+ years of evidence-based behavioral change research, helping patients overcome the everyday barriers that derail treatment and engaging them continuously, not episodically:',
]);
update_field('program_pills', [
    [ 'label' => 'Mental health coach' ],
    [ 'label' => 'Diabetes coach' ],
    [ 'label' => 'Available 24/7' ],
    [ 'label' => 'Motivational Interviewing' ],
    [ 'label' => '30+ years of research' ],
], $pid);

// ── Behavior Gap ─────────────────────────────────────────────────────────────
chr_fields($pid, [
    'behavior_eyebrow'      => 'The behavior gap',
    'behavior_heading_lead' => 'The real barriers to adherence aren’t medical.',
    'behavior_heading_emph' => 'They’re human.',
    'behavior_body'         => 'Chronilogix addresses the emotional, behavioral, and socio-economic barriers that cause drop-off, without relying on expensive, hard-to-scale clinical teams.',
    'behavior_image'        => chr_media('behavior-gap-supplements.webp'),
    'behavior_image_alt'    => 'A person taking daily supplement capsules alongside breakfast.',
    'behavior_caption_lead' => 'We close the gap between',
    'behavior_caption_emph' => 'prescription and progress.',
]);
update_field('behavior_barriers', [
    [ 'title' => 'Fear & anxiety', 'body' => 'Patients often feel overwhelmed after diagnosis.' ],
    [ 'title' => 'Fatigue & burnout', 'body' => 'Motivation naturally decreases over time.' ],
    [ 'title' => 'Cost stress', 'body' => 'Cost concerns affect treatment consistency.' ],
    [ 'title' => 'Low health literacy', 'body' => 'Patients may not fully understand their care plan.' ],
], $pid);

// ── Impact ───────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'impact_eyebrow'      => 'The business impact',
    'impact_heading_lead' => 'Up to 40% higher retention.',
    'impact_heading_emph' => 'At a fraction of the cost.',
    'impact_body'         => 'When patients keep using what you ship, the outcomes show up where your buyers look — retention, results, and proof.',
]);
update_field('impact_stats', [
    [ 'lead' => 'Up to 40%', 'title' => 'Higher retention', 'body' => 'Keep patients engaged for longer.' ],
    [ 'lead' => 'Up to 80%', 'title' => 'Of human coaching replaced', 'body' => 'Members get support the moment they need it — without adding staff.' ],
    [ 'lead' => '~$5', 'title' => 'Per coaching session', 'body' => 'Deliver meaningful patient engagement cost-effectively.' ],
    [ 'lead' => '$0', 'title' => 'Cost to vendors', 'body' => 'Upgrade your offering without replacing your product.' ],
], $pid);

// ── Reposition ───────────────────────────────────────────────────────────────
chr_fields($pid, [
    'reposition_eyebrow'      => 'A better story for buyers',
    'reposition_heading_lead' => 'From commodity supplier to',
    'reposition_heading_emph' => 'outcomes partner.',
    'reposition_body'         => 'Healthcare buyers aren’t simply evaluating products anymore. They’re choosing partners who can prove measurable impact. Same product, told as a different story.',
    'reposition_left_header'  => 'How buyers see most vendors',
    'reposition_right_header' => 'How buyers see you on Chronilogix',
    'reposition_closing_lead' => 'Your product stays the same.',
    'reposition_closing_emph' => 'Its value grows.',
]);
update_field('reposition_reframes', [
    [ 'before' => 'Judged on a feature list', 'after_pre' => 'Measured on', 'after_emph' => 'real impact', 'after_post' => '' ],
    [ 'before' => 'Competing on price', 'after_pre' => 'Competing on', 'after_emph' => 'results', 'after_post' => '' ],
    [ 'before' => 'Delivery ends the story', 'after_pre' => '', 'after_emph' => 'Engagement', 'after_post' => 'sustains it' ],
    [ 'before' => 'No proof after the sale', 'after_pre' => '', 'after_emph' => 'Outcome reporting', 'after_post' => 'on demand' ],
    [ 'before' => 'One of many options', 'after_pre' => 'The', 'after_emph' => 'obvious choice', 'after_post' => '' ],
], $pid);

// ── Closing CTA ──────────────────────────────────────────────────────────────
chr_fields($pid, [
    'cta_eyebrow'         => 'Chronic coaching care that clicks',
    'cta_heading_lead'    => 'Upgrade outcomes.',
    'cta_heading_emph'    => 'Without changing your product.',
    'cta_body'            => 'Book a 30 minute demo. We’ll walk through a live coaching session, the clinical method behind it, and how it works alongside the product you already ship.',
    'cta_primary_label'   => 'Book a Demo',
    'cta_primary_url'     => '#book-a-demo',
    'cta_secondary_label' => 'Download the Whitepaper',
    'cta_secondary_url'   => '/chronilogix-mi-whitepaper.pdf',
]);
update_field('cta_carousel', [
    [ 'image' => chr_media('card-1-bg.jpg') ],
    [ 'image' => chr_media('generated-images/chronilogix-soft-flower-senior-portrait.webp') ],
    [ 'image' => chr_media('card-3-bg.jpg') ],
    [ 'image' => chr_media('generated-images/chronilogix-soft-flower-family-portrait.webp') ],
], $pid);

// ── Audio ────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'audio_src'            => chr_media('audio/chronilogix-vendor-track.mp3'),
    'audio_track_title'    => 'The vendor brief',
    'audio_track_subtitle' => 'Listen · 2:19',
]);
update_field('audio_transcript', [
    [ 't' => 0, 'text' => 'If you sell chronic care products and you\'re still competing on features, price, or distribution, you\'re already losing.' ],
    [ 't' => 9, 'text' => 'Because in today\'s market, the product isn\'t the problem. What happens after delivery is.' ],
    [ 't' => 16, 'text' => 'Chronic care vendors are under pressure from every direction. Products are prescribed, shipped, and then quietly underused.' ],
    [ 't' => 25, 'text' => 'Adherence drops after the first 30 to 90 days. Retention suffers.' ],
    [ 't' => 30, 'text' => 'And payers, employers, and partners are no longer impressed by logistics alone. They want outcomes.' ],
    [ 't' => 38, 'text' => 'Chronilogix is the outcomes upgrade your products have been missing.' ],
    [ 't' => 43, 'text' => 'Chronilogix delivers 24/7, AI-powered chronic care and behavioral health coaching that sits on top of your existing solutions — driving sustained utilization, adherence, and measurable results in the real world.' ],
    [ 't' => 58, 'text' => 'Powered by Roni, an AI coach trained in motivational interviewing and backed by more than 30 years of research and evidence-based behavior-change science, Chronilogix engages patients continuously, not episodically.' ],
    [ 't' => 72, 'text' => 'It addresses the emotional, behavioral, and socioeconomic barriers that cause that drop-off — fear, fatigue, cost stress, and low health literacy.' ],
    [ 't' => 82, 'text' => 'Chronilogix closes that behavior gap between prescription and real-world use, without relying on expensive, hard-to-scale clinical teams.' ],
    [ 't' => 91, 'text' => 'The impact is immediate and measurable. Chronilogix replaces up to 80% of human coaching sessions at roughly $5 per session.' ],
    [ 't' => 101, 'text' => 'Vendors who offer Chronilogix alongside their products see up to 40% higher retention rates — and there\'s no cost to the vendor.' ],
    [ 't' => 112, 'text' => 'You don\'t replace your product. You upgrade it.' ],
    [ 't' => 116, 'text' => 'In a crowded, noisy market, Chronilogix helps you move from commodity supplier to outcomes-enabled partner — with data, differentiation, and a stronger value story buyers can\'t ignore.' ],
    [ 't' => 130, 'text' => 'If you\'re ready to upgrade outcomes, retention, and relevance, visit chronilogix.com. Chronilogix — chronic care coaching that clicks.' ],
], $pid);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded Solutions — Vendors page (ID {$pid}).");
}
