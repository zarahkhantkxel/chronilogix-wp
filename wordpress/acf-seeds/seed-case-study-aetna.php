<?php
/**
 * Seeder — Aetna case study (slug: case-study-aetna).
 * Run: wpx eval-file wordpress/acf-seeds/seed-case-study-aetna.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('case-study-aetna', 'Aetna Case Study');

// ── Hero ─────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'hero_eyebrow'         => 'Case study',
    'hero_logo_alt'        => 'Aetna',
    'hero_heading_lead'    => 'How Aetna transformed member engagement',
    'hero_heading_emph'    => 'with Motivational Interviewing',
    'hero_body'            => 'A breakthrough partnership with MI pioneer Dr. Kenneth Resnicow reshaped how Aetna communicates with members — shifting from scripted calls to meaningful, human-centered conversations.',
    'hero_primary_label'   => 'Book a Demo',
    'hero_primary_url'     => '#book-a-demo',
    'hero_secondary_label' => 'See the platform',
    'hero_secondary_url'   => '/product',
    'hero_logo'            => chr_media('Aetna_Logo.svg'),
]);
update_field('hero_meta', [
    [ 'label' => 'Sector', 'value' => 'Health plan' ],
    [ 'label' => 'Method', 'value' => 'Motivational Interviewing' ],
    [ 'label' => 'Partner', 'value' => 'Dr. Kenneth Resnicow' ],
], $pid);

// ── Outcomes (figures are HTML) ──────────────────────────────────────────────
chr_fields($pid, [
    'outcomes_label'  => 'What changed, in numbers',
    'outcomes_source' => 'Source: Aetna Care Management & Disease Management programs, post-MI integration.',
]);
update_field('outcomes_items', [
    [ 'figure' => '53.1% <span class="text-brand-500">→</span> 76%', 'label' => 'Member engagement', 'note' => 'Enrollment climbed after care teams retrained in MI' ],
    [ 'figure' => '+43%', 'label' => 'Relative lift in engagement', 'note' => 'The largest engagement gain in the program\'s history' ],
    [ 'figure' => '−55%', 'label' => 'Program dropouts', 'note' => 'Drop-offs cut by more than half' ],
], $pid);

// ── Challenge ────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'challenge_eyebrow' => 'The challenge',
    'challenge_heading' => 'Members were being talked at, not talked with.',
    'challenge_body1'   => 'Traditional disease-management programs across the industry were failing to truly engage members. Scripted, compliance-first coaching left people feeling unheard — and drove high dropout rates.',
    'challenge_body2'   => 'The care was well-intentioned. The delivery wasn’t landing. Aetna needed a way to make coaching feel like a real relationship, at the scale of an entire member population.',
]);

// ── Solution ─────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'solution_eyebrow'     => 'Aetna’s solution',
    'solution_heading'     => 'A partnership with the pioneer of Motivational Interviewing.',
    'solution_body'        => 'Aetna partnered with Dr. Kenneth Resnicow, a global leader in Motivational Interviewing, to train its care teams in a new approach built on empathy, autonomy, and real dialogue.',
    'solution_quote'       => 'A highly personalized member experience with real conversations, not scripted interactions.',
    'solution_quote_attr'  => 'Aetna Leadership',
    'conv_member'          => 'Honestly, I stopped taking my meds a few weeks ago.',
    'conv_scripted_label'  => 'Scripted',
    'conv_scripted_text'   => 'On a scale of 1 to 5, how would you rate your medication adherence this week?',
    'conv_mi_label'        => 'With MI',
    'conv_mi_text'         => 'That took honesty — thank you. What’s made taking them feel hard lately?',
    'conv_bg'              => chr_media('card-1-bg.webp'),
    'bio_image'            => chr_media('ken-thumbnail.webp'),
    'bio_role'             => 'Chief Science Officer, Chronilogix',
    'bio_name'             => 'Dr. Kenneth Resnicow',
    'bio_body'             => 'One of the world’s leading experts in Motivational Interviewing, whose work spans healthcare, behavior change, chronic illness, and health equity. His partnership with Aetna helped operationalize MI at scale — and set a national precedent for member-centered coaching.',
]);

// ── What Changed ─────────────────────────────────────────────────────────────
chr_fields($pid, [
    'changed_eyebrow' => 'What changed',
    'changed_heading' => 'MI rewired Aetna’s coaching model.',
    'changed_body'    => 'The same care teams, having the same calls — but with conversations built to do three things differently.',
]);
update_field('changed_shifts', [
    [ 'title' => 'Strengthen intrinsic motivation', 'body' => 'Conversations surface the member\'s own reasons for change instead of prescribing them.' ],
    [ 'title' => 'Increase readiness for change', 'body' => 'Coaching meets people where they are, moving them forward at a pace they own.' ],
    [ 'title' => 'Build trust through collaboration', 'body' => 'Guidance replaces persuasion, so members stay in the driver\'s seat of their care.' ],
], $pid);
update_field('changed_downstream', [
    [ 'text' => 'Better adherence to care plans' ],
    [ 'text' => 'Improved productivity for plan sponsors' ],
    [ 'text' => 'Fewer disability claims' ],
], $pid);

// ── Why It Works ─────────────────────────────────────────────────────────────
chr_fields($pid, [
    'why_eyebrow'      => 'Why MI works',
    'why_heading_lead' => 'From telling people what to do',
    'why_heading_emph' => 'to helping them discover why they want to.',
    'why_body'         => 'Motivational Interviewing shifts the focus of every conversation. That shift is what produced Aetna’s numbers — and it’s what makes behavior change last.',
]);
update_field('why_creates', [
    [ 'text' => 'Higher participation' ],
    [ 'text' => 'More consistent behavior change' ],
    [ 'text' => 'Stronger long-term health outcomes' ],
], $pid);

// ── Bridge ───────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'bridge_eyebrow'        => 'The method, productized',
    'bridge_heading_lead'   => 'The method Aetna proved is the method',
    'bridge_heading_emph'   => 'inside Chronilogix.',
    'bridge_body'           => 'We’ve translated Dr. Resnicow’s thirty years of Motivational Interviewing research into the AI that powers every Chronilogix conversation — so every member gets the same evidence-based coaching, 24/7, at a fraction of the cost of live care.',
    'bridge_primary_label'  => 'Book a Demo',
    'bridge_primary_url'    => '#book-a-demo',
    'bridge_secondary_label'=> 'See How Chronilogix Works',
    'bridge_secondary_url'  => '/product',
]);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded Aetna case study (ID {$pid}).");
}
