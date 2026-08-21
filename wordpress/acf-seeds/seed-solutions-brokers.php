<?php
/**
 * Seeder — Solutions — Brokers page (slug: solutions-brokers).
 *
 * Seeds the exact current hardcoded content. Every editable field has a
 * matching on-brand default in the frontend components, so leaving a field
 * blank in WordPress falls back to that default rather than blanking the UI.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-solutions-brokers.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('solutions-brokers', 'Solutions — Brokers');

// ── Hero ─────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'hero_eyebrow'       => 'For benefits brokers',
    'hero_headline_lead' => 'The cost leak isn’t plan design.',
    'hero_headline_hero' => 'It’s member behavior.',
    'hero_intro'         => 'The real drivers are chronic conditions, behavioral health, and delayed care. Chronilogix reaches them with AI coaching that changes member behavior before expensive claims happen.',
    'hero_cta_label'     => 'Book a Demo',
    'hero_cta_url'        => '#book-a-demo',
]);

// ── The Reality ────────────────────────────────────────────────────────────
chr_fields($pid, [
    'reality_eyebrow'      => 'The reality brokers face',
    'reality_heading_lead' => 'The four cost drivers',
    'reality_heading_emph' => 'that build up between doctor visits.',
    'reality_intro'        => 'When employees postpone care, conditions quietly worsen — and by the time they surface, the claims are already expensive. Brokers are left explaining the renewal increase after the fact, instead of preventing it.',
    'reality_closing_lead' => 'None of it is caused by catastrophic events. It’s unmanaged behavior between doctor visits,',
    'reality_closing_emph' => 'the space traditional plans never reach.',
]);
update_field('reality_pressures', [
    [ 'title' => 'Diabetes', 'detail' => 'One of the most predictable, highest-cost drivers on every renewal.', 'image' => chr_media('diabetes-glucose.jpg'), 'alt' => 'A person checking their blood glucose level with a meter.' ],
    [ 'title' => 'Obesity', 'detail' => 'Compounds risk across nearly every other chronic condition on the plan.', 'image' => chr_media('obesity-reflective.webp'), 'alt' => 'A woman sitting alone on the edge of a bed in low evening light.' ],
    [ 'title' => 'Behavioral health', 'detail' => 'Utilization climbs quietly, alongside the productivity loss beside it.', 'image' => chr_media('behavioral-health-sunlit.jpg'), 'alt' => 'Two young women resting close together in warm sunlight through leaves.' ],
    [ 'title' => 'Delayed care', 'detail' => 'Employees postpone treatment until small issues become expensive claims.', 'image' => chr_media('delayed-care-caregiver.webp'), 'alt' => 'A caregiver helping an older man with his shoes beside a wheelchair.' ],
], $pid);

// ── Strategy ─────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'strategy_eyebrow'         => 'Introducing Chronilogix',
    'strategy_heading_lead'    => 'AI coaches in front of every member,',
    'strategy_heading_emph'    => 'before claims start.',
    'strategy_intro'           => 'A front-door claims-mitigation strategy for self-funded plans, working across chronic and behavioral health to reach members long before a quiet risk becomes an expensive claim.',
    'strategy_image'           => chr_media('for-employees.webp'),
    'strategy_image_alt'       => 'Four members outdoors in warm sunlight, smiling together.',
    'strategy_footer_title'    => 'Grounded in Motivational Interviewing',
    'strategy_footer_subtitle' => 'Dr. Ken Resnicow’s clinically validated framework',
]);
update_field('strategy_stats', [
    [ 'value' => '24/7', 'caption' => 'Coaching available every hour, no waiting for a clinician\'s calendar.' ],
    [ 'value' => '30+ yrs', 'caption' => 'Of NIH-funded research behind every conversation.' ],
], $pid);

// ── Member Experience ──────────────────────────────────────────────────────
chr_fields($pid, [
    'member_heading'    => 'Two specialized AI coaches: one for mental health, one for diabetes.',
    'member_body'       => 'Millie coaches members through mental and behavioral health, while Roni guides those managing diabetes and chronic conditions. Both run Motivational Interviewing, grounded in 30 years of behavioral science research, personalized to each member and available without waiting on a clinician’s calendar.',
    'member_pivot_lead' => 'Not reminders. Not wellness noise.',
    'member_pivot_emph' => 'Real behavior change, at scale.',
]);
update_field('member_tags', [
    [ 'label' => 'Onboarding' ],
    [ 'label' => 'Daily check-ins' ],
    [ 'label' => 'Goal tracking' ],
    [ 'label' => 'Progress reporting' ],
], $pid);

// ── Why It Works ─────────────────────────────────────────────────────────────
chr_fields($pid, [
    'why_eyebrow'      => 'The business impact',
    'why_heading_lead' => 'Fewer claims, better adherence, earlier care,',
    'why_heading_emph' => 'at a fraction of the cost.',
    'why_aside'        => 'A cost curve you can actually bend.',
]);
update_field('why_cards', [
    [ 'title' => 'Reduce Avoidable Claims', 'body' => 'Support healthier behaviors before conditions worsen into high-cost interventions.' ],
    [ 'title' => 'Improve Medication Adherence', 'body' => 'Help members stay on track with the treatment plan the plan already covers.' ],
    [ 'title' => 'Encourage Early Care', 'body' => 'Reduce the delays that turn manageable issues into expensive ones.' ],
    [ 'title' => 'Scale Coaching Efficiently', 'body' => 'Replace up to 80% of traditional human coaching sessions, at roughly $5 per session.' ],
], $pid);

// ── Advantage ────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'advantage_eyebrow'      => 'What it means for you',
    'advantage_heading_lead' => 'For your clients, fewer claims.',
    'advantage_heading_emph' => 'For you, an advantage you can defend.',
    'advantage_intro'        => 'The same coaching that lowers your clients’ spend changes how you show up: sharper positioning, an earlier seat at the cost conversation, and a number you can stand behind.',
]);
update_field('advantage_payoffs', [
    [ 'title' => 'Differentiate beyond point solutions', 'body' => 'Everyone else is selling another point solution. You bring a front-door strategy that changes member behavior, not one more app that goes unused.' ],
    [ 'title' => 'Move upstream in the cost curve', 'body' => 'Engage members before claims escalate. You shape the cost story early, instead of explaining the increase after renewal.' ],
    [ 'title' => 'A defensible ROI story', 'body' => 'Earlier engagement, better adherence, fewer high-cost claims. Measurable value you can stand behind in every renewal conversation.' ],
], $pid);

// ── Closing CTA ──────────────────────────────────────────────────────────────
chr_fields($pid, [
    'cta_heading_line1'   => 'Help your clients control costs',
    'cta_heading_line2'   => 'before they become claims.',
    'cta_body'            => 'Book a 30 minute demo. We’ll walk through a live coaching session, the clinical method behind it, and how it reduces avoidable spending for your self-funded clients.',
    'cta_primary_label'   => 'Book a Demo',
    'cta_primary_url'     => '#book-a-demo',
    'cta_secondary_label' => 'See How Chronilogix Works',
    'cta_secondary_url'   => '#how-it-works',
    'cta_signoff'         => 'Chronilogix. Chronic care coaching that actually clicks.',
]);
update_field('cta_carousel', [
    [ 'image' => chr_media('card-1-bg.webp') ],
    [ 'image' => chr_media('generated-images/chronilogix-soft-flower-senior-portrait.webp') ],
    [ 'image' => chr_media('card-3-bg.jpg') ],
    [ 'image' => chr_media('generated-images/chronilogix-soft-flower-family-portrait.webp') ],
], $pid);

// ── Audio ────────────────────────────────────────────────────────────────────
chr_fields($pid, [
    'audio_src'            => chr_media('audio/chronilogix-broker-track.mp3'),
    'audio_track_title'    => 'The broker brief',
    'audio_track_subtitle' => 'Listen · 2:01',
]);
update_field('audio_transcript', [
    [ 't' => 0, 'text' => 'If you\'re a broker working with self-funded employers, here\'s the uncomfortable truth: plan design isn\'t where the money\'s leaking anymore.' ],
    [ 't' => 11, 'text' => 'Your clients are paying for chronic conditions like diabetes and obesity, rising behavioral health claims, and delayed care driven by high deductibles.' ],
    [ 't' => 22, 'text' => 'Employees wait, conditions worsen, and claims spike — and you\'re expected to explain it at renewal.' ],
    [ 't' => 31, 'text' => 'That\'s the real problem. Most healthcare spend isn\'t caused by catastrophic events.' ],
    [ 't' => 38, 'text' => 'It\'s caused by unmanaged behavior between doctor visits — and traditional plans don\'t touch that. Chronilogix does.' ],
    [ 't' => 46, 'text' => 'Chronilogix is a front-door claims-mitigation strategy for self-funded plans.' ],
    [ 't' => 52, 'text' => 'It delivers 24/7, AI-driven chronic and behavioral health coaching that engages members before claims escalate.' ],
    [ 't' => 60, 'text' => 'At the center is Roni, Chronilogix\'s AI coach — trained in motivational interviewing and grounded in more than 30 years of research.' ],
    [ 't' => 69, 'text' => 'This isn\'t reminders or wellness noise. It\'s real behavior change delivered at scale, without relying on scarce clinicians.' ],
    [ 't' => 78, 'text' => 'Chronilogix targets the top drivers of avoidable spend, improves adherence and self-management, and replaces up to 80% of human coaching sessions for roughly $5 per session.' ],
    [ 't' => 91, 'text' => 'For employers, that means earlier engagement and fewer high-cost claims. For brokers, it means something more valuable.' ],
    [ 't' => 100, 'text' => 'Chronilogix helps differentiate you in a market where everyone else is selling just another point solution.' ],
    [ 't' => 107, 'text' => 'You move upstream in the cost curve, and it gives you a defensible ROI story.' ],
    [ 't' => 113, 'text' => 'To learn how it helps you deliver measurable value and stand apart, visit chronilogix.com. Chronilogix — chronic care coaching that actually clicks.' ],
], $pid);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded Solutions — Brokers page (ID {$pid}).");
}
