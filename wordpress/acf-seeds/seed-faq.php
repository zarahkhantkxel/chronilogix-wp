<?php
/**
 * Seeder — FAQ page (slug: faq).
 * Answers seeded as HTML (inline emphasis + links) — rendered via
 * dangerouslySetInnerHTML on the frontend. hero_body is intentionally left
 * unseeded so its styled default (with an inline link) renders.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-faq.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$pid = chr_page('faq', 'FAQ');

// ── Hero (hero_body left unseeded — styled default keeps its link) ───────────
chr_fields($pid, [
    'hero_eyebrow'      => 'Questions, answered',
    'hero_heading_lead' => 'The plain-language answers',
    'hero_heading_emph' => 'to the questions we hear most.',
]);

// ── FAQ list ─────────────────────────────────────────────────────────────────
update_field('list_groups', [
    [
        'key' => 'about', 'eyebrow' => '01', 'heading' => 'About Chronilogix',
        'items' => [
            [ 'q' => 'What is Chronilogix?', 'a' => 'Chronilogix is an AI-native behavioral health and chronic care coaching platform. It provides 24/7 evidence-based coaching between clinical visits — the moments traditional care can’t reach — built on <span class="text-ink">three decades of Dr. Ken Resnicow’s Motivational Interviewing research</span>.' ],
            [ 'q' => 'How is Chronilogix different from a chatbot?', 'a' => 'A chatbot improvises a reply each turn from a generic prompt. Chronilogix <span class="text-ink">reasons</span> — every response is interpreted against the member’s prior sessions, cultural context, and an MI fidelity rubric before being sent. A second validation layer monitors every conversation in real time and replaces any word or sentence it deems wrong or misinterpreted before the member sees it.' ],
            [ 'q' => 'Does Chronilogix replace my therapist or health coach?', 'a' => 'No. Chronilogix isn’t here to replace clinicians — it’s here to extend their reach. Members can choose an AI-only path, or a <span class="text-ink">Hybrid Care Model</span> that pairs a live therapist or health coach with 24/7 AI coaching between visits. Every AI interaction can be summarized and shared with the clinician before the next appointment, so sessions begin with insight instead of catch-up.' ],
            [ 'q' => 'What is Motivational Interviewing?', 'a' => 'MI is an evidence-based counseling style developed by William R. Miller and Stephen Rollnick in the early 1980s. It moves through four processes — <span class="text-ink">Engage, Focus, Evoke, Plan</span> — and four microskills called <span class="text-ink">OARS</span> (Open questions, Affirmations, Reflective listening, Summaries). Across <span class="text-ink">more than 200 randomized controlled trials</span>, MI has outperformed direct persuasion in domains as varied as smoking cessation, diabetes self-management, and treatment adherence.' ],
        ],
    ],
    [
        'key' => 'coverage', 'eyebrow' => '02', 'heading' => 'Coverage & availability',
        'items' => [
            [ 'q' => 'What conditions does Chronilogix cover today?', 'a' => 'Two coaches are live today: <span class="text-ink">Roni</span> for diabetes and chronic care, and <span class="text-ink">Millie</span> for mental health and mood. Four additional chronic modules are in development — GLP-1 & weight management, addiction, hypertension, and cancer — and ship into the same coaching surface members already use.' ],
            [ 'q' => 'How do members access Chronilogix?', 'a' => 'Chronilogix is available on <span class="text-ink">desktop</span>, <span class="text-ink">mobile</span>, and can be embedded inside partner health and wellness apps. Members can engage by <span class="text-ink">text, voice, or video</span> — whichever surface fits the moment.' ],
            [ 'q' => 'When is Chronilogix available?', 'a' => '24/7. There is no waitlist and no business-hours limit. The moments that matter most — 2 a.m. anxiety, a forgotten medication dose, motivation gone quiet, loneliness on a long night — are exactly the moments Chronilogix is designed to be present for.' ],
            [ 'q' => 'Is Chronilogix a good fit for seniors and Medicare beneficiaries?', 'a' => 'Yes. For many Medicare beneficiaries and older adults, appointments may be separated by weeks while loneliness and uncertainty continue every day. Chronilogix provides compassionate support between visits, helps people stay on track with their care plan, and gives clinicians greater visibility into their patient’s journey.' ],
        ],
    ],
    [
        'key' => 'safety', 'eyebrow' => '03', 'heading' => 'Safety & clinical oversight',
        'items' => [
            [ 'q' => 'Is Chronilogix HIPAA compliant?', 'a' => 'Yes. Chronilogix was designed for healthcare from the ground up — encryption in transit and at rest, HIPAA compliant access controls, and clinical-grade audit logging baked in, not bolted on.' ],
            [ 'q' => 'Is member data used to train the AI?', 'a' => 'No. Member conversations are <span class="text-ink">never shared, sold, or used to improve our models</span>. What members tell Chronilogix belongs to them and to the deploying organization.' ],
            [ 'q' => 'What happens in a crisis?', 'a' => 'Millie is designed to recognize crisis-level distress signals that exceed coaching scope, shift into a structured risk assessment, and escalate to the <span class="text-ink">988 Suicide & Crisis Lifeline</span> when the risk level warrants it. Safety is part of the conversation architecture, not a fallback.' ],
            [ 'q' => 'How do humans stay in the loop?', 'a' => 'Chronilogix is designed to handle <span class="text-ink">up to 70% of routine coaching</span>; the remaining ~30% escalates to human clinicians when the moment calls for it. The reach and economics of AI, paired with clinical oversight.' ],
        ],
    ],
    [
        'key' => 'buyers', 'eyebrow' => '04', 'heading' => 'For buyers & partners',
        'items' => [
            [ 'q' => 'How is Chronilogix priced?', 'a' => 'Custom pricing for every deployment. Health plans typically contract on <span class="text-ink">PEPM</span> inside an existing plan footprint. Employers bundle Chronilogix into benefits alongside EAP and telehealth. Wellness platforms embed it as an affiliate coaching layer.' ],
            [ 'q' => 'How does deployment work?', 'a' => 'Four commercial paths: direct PEPM contracts with health plans; inclusion inside existing employer wellness benefits; affiliate embed inside partner wellness or fitness apps; co-deployment with chronic care supply vendors. Infrastructure is Stripe-powered for consumer direct billing and HIPAA compliant by default.' ],
            [ 'q' => 'Can we white-label Chronilogix?', 'a' => 'Yes. Chronilogix ships as a branded experience inside a partner’s app, employer benefit, or wellness platform. Your chrome on top; the same MI-trained coach underneath. We can customize by Universities, Unions, Missions, and industry-specific needs — globally, regionally, and locally.' ],
        ],
    ],
    [
        'key' => 'science', 'eyebrow' => '05', 'heading' => 'Dr. Resnicow & the science',
        'items' => [
            [ 'q' => 'Who is Dr. Kenneth Resnicow?', 'a' => 'Dr. Ken Resnicow is Chronilogix’s Co-Founder and Chief Science Officer, and Professor at the University of Minnesota. He is among the most cited researchers in Motivational Interviewing, with <span class="text-ink">400+ peer-reviewed publications</span>, MI training delivered to <span class="text-ink">10,000+ clinicians</span> worldwide, and research funding spanning three decades.' ],
            [ 'q' => 'What is Chronilogix\'s evidence base?', 'a' => 'The platform is built on three decades of peer-reviewed clinical science in Motivational Interviewing — the most rigorously validated behavioral change methodology in the world. When <a href="/case-studies/aetna" class="underline decoration-brand-500/40 decoration-1 underline-offset-[3px] transition-colors hover:text-brand-700 hover:decoration-brand-600">Aetna</a> integrated Dr. Resnicow’s MI framework into their disease management programs, <span class="text-ink">member engagement rose by 40%</span> and dropout rates fell by more than half.' ],
        ],
    ],
], $pid);

// ── Closing CTA ──────────────────────────────────────────────────────────────
chr_fields($pid, [
    'cta_eyebrow'        => 'Still have questions',
    'cta_heading_lead'   => 'Let’s answer them together.',
    'cta_heading_emph'   => 'Book a demo and we’ll walk through it live.',
    'cta_body'           => 'Fifteen minutes, no slides. See a real Chronilogix session, hear how the fidelity rubric works, and get every question answered.',
    'cta_primary_label'  => 'Book a demo',
    'cta_primary_url'    => '#book-a-demo',
    'cta_secondary_label'=> 'Read the whitepaper',
    'cta_secondary_url'  => '/chronilogix-mi-whitepaper.pdf',
]);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded FAQ page (ID {$pid}).");
}
