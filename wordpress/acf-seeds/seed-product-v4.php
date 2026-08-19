<?php
/**
 * Seeder — Product V4 page (slug: product-v4). Populates ACF fields with the
 * exact content currently rendered by the Next.js /product/v4 components.
 *
 * The V4 page mirrors /product; the shared sections (hero, reply, capabilities,
 * audience, integration, platform) carry identical copy. Only the Coaches
 * section differs — it is the HiwAgentsV4 "one engine, two voices" framing.
 *
 * Note: three HiwAgentsV4 fields are intentionally left UNSEEDED so their
 * on-brand styled defaults (inline <span> emphasis, which a plain textarea
 * cannot carry) render exactly as before: agentsv4_intro, agentsv4_engine_body,
 * agentsv4_handoff. The fields still exist in ACF for editing.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-product-v4.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('product-v4', 'Product V4');

// ── Hero (HiwHero) ─────────────────────────────────────────────────────────
chr_fields($pid, [
    'v4hero_subheadline' => 'For the moments between appointments, when habits slip, motivation fades, and no one else is around.',
]);
update_field('v4hero_headline_lines', [
    [ 'text' => 'Two coaches.', 'tone' => 'bright' ],
    [ 'text' => 'Thirty years of science.', 'tone' => 'bright' ],
    [ 'text' => 'One conversation at a time.', 'tone' => 'muted' ],
], $pid);
update_field('v4hero_agents', [
    [ 'name' => 'Roni', 'role' => 'Chronic care coach', 'avatar' => chr_media('roni.png'), 'cta_href' => '#roni' ],
    [ 'name' => 'Millie', 'role' => 'Mental health coach', 'avatar' => chr_media('millie.png'), 'cta_href' => '#millie' ],
], $pid);

// ── Reply (HiwReply) ─────────────────────────────────────────────────────────
chr_fields($pid, [
    'v4reply_heading_lead'         => 'Each reply weighs',
    'v4reply_heading_emph'         => 'everything Chronilogix knows.',
    'v4reply_dissection_eyebrow'   => 'Inside one reply',
    'v4reply_member_view_eyebrow'  => 'The app members open between sessions',
    'v4reply_member_name'          => 'Maria',
    'v4reply_member_message'       => 'I skipped lunch again. I know I shouldn\'t.',
    'v4reply_coach_name'           => 'Roni',
    'v4reply_coach_avatar'         => chr_media('roni.png'),
    'v4reply_coach_reply'          => 'You’re noticing it. That’s not nothing. What got in the way today?',
    'v4reply_thinking_label'       => 'Thinking',
    'v4reply_mockup_image'         => chr_media('hand-tilted-mockup.webp'),
    'v4reply_mockup_alt'           => 'Chronilogix on a member\'s phone showing daily greeting, upcoming Roni session, goals in flight',
]);
update_field('v4reply_reasoning_rows', [
    [ 'label' => 'Remembers', 'value' => 'Last session, stress eating after work calls' ],
    [ 'label' => 'Pattern this week', 'value' => 'Third lunch skipped in five days' ],
    [ 'label' => 'Goal in motion', 'value' => 'Eat lunch before the 1pm call' ],
    [ 'label' => 'Emotional read', 'value' => 'Self critical, bracing for a lecture' ],
    [ 'label' => 'MI technique', 'value' => 'Reflect what she noticed, then ask' ],
    [ 'label' => 'Holds back', 'value' => 'Direct advice, a checklist, a fix' ],
], $pid);

// ── Coaches (HiwAgentsV4 — intro / engine_body / handoff left unseeded) ──────
chr_fields($pid, [
    'agentsv4_eyebrow'            => 'The coaching layer',
    'agentsv4_heading_lead'       => 'One engine.',
    'agentsv4_heading_muted'      => 'Two clinical voices.',
    'agentsv4_engine_label'       => 'The engine',
    'agentsv4_engine_name'        => 'Roni',
    'agentsv4_engine_name_suffix' => 'AI',
    'agentsv4_persona_intro'      => 'Chronic disease and mental health rarely travel alone. Roni delivers two coaches, each purpose-built for one clinical domain — same underlying methodology, different vocabulary, different pacing, different range.',
]);
update_field('agentsv4_engine_stats', [
    [ 'lead' => '30+', 'label' => 'years of MI research' ],
    [ 'lead' => '400+', 'label' => 'peer-reviewed studies' ],
    [ 'lead' => '70+', 'label' => 'global clinical trials' ],
], $pid);
update_field('agentsv4_personas', [
    [
        'name' => 'Roni',
        'role' => 'Chronic care coach',
        'scope' => 'Diabetes. Obesity. Hypertension.',
        'avatar' => chr_media('roni.png'),
        'member_line' => 'I keep forgetting to check my sugar before meals.',
        'coach_reply' => 'Forgetting isn\'t failure. Pair the check with your coffee. We\'re stacking, not adding willpower.',
        'capabilities' => [
            [ 'value' => 'A1C and blood-sugar trends' ],
            [ 'value' => 'Meal and carb awareness' ],
            [ 'value' => 'Medication adherence' ],
            [ 'value' => 'Movement and daily habits' ],
        ],
    ],
    [
        'name' => 'Millie',
        'role' => 'Mental health coach',
        'scope' => 'Depression. Anxiety. Stress. The heavy days.',
        'avatar' => chr_media('millie.png'),
        'member_line' => 'I can\'t get my mind to slow down.',
        'coach_reply' => 'Racing thoughts aren\'t yours to solve at midnight. Let\'s bring your body back into the room first — I\'ll walk you through it.',
        'capabilities' => [
            [ 'value' => 'Grounding techniques (3-3-3)' ],
            [ 'value' => 'Sleep and rest patterns' ],
            [ 'value' => 'Mood over weeks' ],
            [ 'value' => 'Boundaries and coping skills' ],
        ],
    ],
], $pid);

// ── Capabilities (CoreCapabilities) ──────────────────────────────────────────
chr_fields($pid, [
    'v4caps_heading_lead'          => 'Real coaching does a lot at once.',
    'v4caps_heading_emph'          => 'Every Chronilogix reply carries it all.',
    'v4caps_intro'                 => 'Clinical methodology, cultural and emotional reach, consistent delivery, and crisis safe handoffs. Engineered into every Chronilogix conversation, not added as features on top.',
    'v4caps_privacy_eyebrow'       => 'Privacy by design',
    'v4caps_privacy_heading_lead'  => 'Member data is never used to train our models.',
    'v4caps_privacy_heading_emph'  => 'Not now. Not ever.',
]);
update_field('v4caps_blocks', [
    [ 'eyebrow' => '01. MI Engine', 'heading' => 'A coach, not a chatbot.' ],
    [ 'eyebrow' => '02. Access', 'heading' => 'The first honest conversation.' ],
    [ 'eyebrow' => '03. Oversight', 'heading' => 'AI at scale. Clinicians in the loop.' ],
    [ 'eyebrow' => '04. Multilingual', 'heading' => 'Native, not translated.' ],
    [ 'eyebrow' => '05. Emotion aware', 'heading' => 'Reads the mood, not just the message.' ],
    [ 'eyebrow' => '06. Crisis safe', 'heading' => '988, built into the conversation.' ],
], $pid);
update_field('v4caps_trust_pillars', [
    [ 'title' => 'Built for Healthcare', 'body' => 'Designed for healthcare from the ground up. Encryption in transit and at rest. HIPAA compliant access controls baked in, not bolted on.' ],
    [ 'title' => 'Data Stays Yours', 'body' => 'Conversations are never shared, sold, or used to improve our models. What members tell Chronilogix belongs to them and to you.' ],
    [ 'title' => 'Enterprise Controls', 'body' => 'Single tenant deployment available. Role based access. Clinical grade audit logging. The controls your IT and legal teams already require.' ],
], $pid);

// ── Audience (HiwAudience) ───────────────────────────────────────────────────
chr_fields($pid, [
    'v4audience_sr_heading' => 'Who Chronilogix reaches',
]);
update_field('v4audience_profiles', [
    [
        'label' => 'Can\'t afford care',
        'intro' => 'Cost barrier members',
        'headline1' => 'Clinical quality coaching.',
        'headline2' => 'Without the copay.',
        'description' => 'High deductibles and out of pocket costs turn behavioral health into a luxury. Coaching, accountability support, and the behavioral reinforcement that actually sustains long term change is rarely covered by insurance. Chronilogix delivers clinical quality coaching at a fraction of the cost of live care, with no copay and no scheduling barrier.',
    ],
    [
        'label' => 'Off hours workers',
        'intro' => 'Night shift, first responders, hospitality',
        'headline1' => 'Care at 3 AM.',
        'headline2' => 'Not just 3 PM.',
        'description' => 'Night shift nurses. First responders. Transportation and manufacturing workers. Hospitality staff. These are people who need support at 3 AM, not 3 PM. The traditional system was not built for their schedule. Chronilogix was.',
        'pull_lead' => 'Anytime',
        'pull_caption' => 'Available when shift work is',
    ],
    [
        'label' => 'Won\'t talk to a clinician',
        'intro' => 'Members who avoid live providers',
        'headline1' => 'Honest where',
        'headline2' => 'live care can\'t reach.',
        'description' => 'Fear of judgment. Cultural stigma. The feeling that a stranger across a desk cannot be trusted with the most honest version of your struggle. These are real barriers that turn millions of people away from care entirely. In a non judgmental AI environment, many people are more honest than they have ever been with a live provider. That honesty is where change begins.',
    ],
    [
        'label' => 'Fallen through the cracks',
        'intro' => 'Post discharge and post therapy members',
        'headline1' => 'Present long after',
        'headline2' => 'the clinic goes silent.',
        'description' => 'After discharge. After the therapy course ends. After the motivation from the diagnosis scare fades. These are the moments when traditional care goes silent. Chronilogix stays present. Not as a crisis line, but as the consistent coaching voice that remains long after the clinical intervention has closed.',
    ],
    [
        'label' => 'Underserved communities',
        'intro' => 'Members standard programs don\'t reach',
        'headline1' => 'Standard programs miss.',
        'headline2' => 'Chronilogix adapts.',
        'description' => 'Hispanic men face a 64% higher rate of diabetes, yet represent just 2% of participants in the CDC\'s National Diabetes Prevention Program. Standard coaching fails these members linguistically, culturally, and financially. Chronilogix\'s MI based approach is built to adapt to cultural context, dietary norms, literacy levels, and behavioral readiness, not just translate the same program into another language.',
        'extended_label' => 'Solida Health',
        'extended' => 'That is why Chronilogix created Solida Health, a Hispanic and Latin division that runs as its own operation with the same commitment to the underlying clinical IP. Dr. Renata B, its president and a practicing physician, health coach, and cultural voice, has spent years delivering culturally attuned coaching on weight, body image, food, and movement to thousands of Hispanic men and women.',
        'pull_lead' => '64%',
        'pull_caption' => 'Higher diabetes rate for Hispanic men',
    ],
], $pid);

// ── Integration (HiwIntegration) ─────────────────────────────────────────────
chr_fields($pid, [
    'v4integration_heading_lead'  => 'Plugs into how',
    'v4integration_heading_muted' => 'you already deliver care.',
    'v4integration_intro'         => 'Four ways Chronilogix lands inside an existing care delivery model, on infrastructure that meets you where compliance demands it.',
    'v4integration_infra_label'   => 'Infrastructure',
    'v4integration_infra_text'    => 'Stripe powered consumer direct billing. HIPAA compliant by default.',
]);
update_field('v4integration_paths', [
    [ 'index' => '01', 'label' => 'Subscription access', 'heading' => 'Direct PEPM contracts with health plans.', 'body' => 'Member month pricing inside an existing plan footprint, without the plan having to build clinical IP from scratch.' ],
    [ 'index' => '02', 'label' => 'Employer benefit bundles', 'heading' => 'Inside existing employer wellness benefits.', 'body' => 'Drops into a benefits portfolio alongside EAP, telehealth, and wellness vendors, reachable by every covered employee without a separate enrollment flow.' ],
    [ 'index' => '03', 'label' => 'Affiliate software', 'heading' => 'Embedded in partner wellness or fitness apps.', 'body' => 'Lives as a coaching layer inside a partner’s existing app experience, same surface the member already opens, with Chronilogix doing the clinical work underneath.' ],
    [ 'index' => '04', 'label' => 'Vendors of Chronic Care Supplies', 'heading' => 'Co-deployed with supplies and devices.', 'body' => 'Pairs with diabetes supply programs, glucose monitors, and other chronic care vendors so the behavioral layer ships in the same box as the clinical hardware.' ],
], $pid);

// ── Platform (HiwPlatform) ───────────────────────────────────────────────────
chr_fields($pid, [
    'v4platform_heading_lead'  => 'Built to fit.',
    'v4platform_heading_muted' => 'Built to grow.',
    'v4platform_intro'         => 'Deployed under your brand today. Built to expand with you.',
]);
update_field('v4platform_rows', [
    [ 'eyebrow' => '01. White label', 'heading' => 'Same coach. Any brand.' ],
    [ 'eyebrow' => '02. Coverage', 'heading' => 'Two coaches today. Four chronic modules in development.' ],
], $pid);
update_field('v4platform_modules', [
    [ 'name' => 'Roni', 'domain' => 'Diabetes & chronic care' ],
    [ 'name' => 'Millie', 'domain' => 'Mental health & mood' ],
    [ 'name' => 'GLP-1 Weight', 'domain' => 'GLP-1 & weight management' ],
    [ 'name' => 'Addiction', 'domain' => 'Substance use & recovery' ],
    [ 'name' => 'Hypertension', 'domain' => 'Blood pressure & cardiovascular' ],
    [ 'name' => 'Cancer', 'domain' => 'Screening, treatment, and survivorship' ],
], $pid);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded Product V4 page (ID {$pid}).");
}
