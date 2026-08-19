<?php
/**
 * Seeder — Home page (slug: home). Populates ACF fields with the exact content
 * currently rendered by the Next.js homepage components.
 *
 * Run: wpx eval-file wordpress/acf-seeds/seed-home.php
 */

if (!defined('ABSPATH')) {
    exit;
}
require_once __DIR__ . '/_helpers.php';

$home = chr_page('home', 'Home');

// ── Hero ─────────────────────────────────────────────────────────────────────
chr_fields($home, [
    'hero_heading_lead'       => 'Filling the gaps in',
    'hero_heading_highlight1' => 'mental health',
    'hero_heading_highlight2' => 'chronic care',
    'hero_heading_italic'     => 'through AI coaching agents.',
    'hero_heading_tail'       => '24/7',
    'hero_subtext_lead'       => 'Built on the life’s work of world renowned',
    'hero_subtext_name'       => 'Dr. Ken Resnicow',
    'hero_subtext_emphasis'   => 'Motivational Interviewing',
    'hero_cta_label'          => 'Book A Demo',
    'hero_cta_url'            => '#book-a-demo',
    'hero_bg_image'           => chr_media('bg-low-saturation.webp'),
    'hero_phone_image'        => chr_media('new-mobile.svg'),
    'hero_avatar_image'       => chr_media('millie.png'),
]);
update_field('hero_stats', [
    [ 'value' => '30+',  'label' => 'years of MI research' ],
    [ 'value' => '70+',  'label' => 'clinical studies' ],
    [ 'value' => '400+', 'label' => 'peer reviewed publications' ],
], $home);
update_field('hero_chat', [
    [ 'who' => 'member', 'text' => "can't sleep. thoughts keep looping.", 'time' => '02:04' ],
    [ 'who' => 'millie', 'text' => "That sounds exhausting. What's the loudest thought right now?", 'time' => '02:04' ],
    [ 'who' => 'member', 'text' => "that i'm falling behind.", 'time' => '02:05' ],
    [ 'who' => 'millie', 'text' => "You've been carrying a heavy weight, and feeling left behind is keeping your mind from settling. When thoughts cycle like this at night, what's helped you get traction before?", 'time' => '02:05' ],
], $home);

// ── Statement ──────────────────────────────────────────────────────────────
chr_fields($home, [
    'statement_line1'     => 'Most healthcare chatbots ask, answer, sell or dispense. People don’t change like this.',
    'statement_line2'     => 'Motivational Interviewing is designed to change people’s behaviours.',
    'statement_cta_label' => 'Read the full white paper',
    'statement_cta_url'   => '#motivational-interviewing',
    'statement_bg_full'   => chr_media('statement-bg.webp'),
    'statement_bg_low'    => chr_media('statement-bg-low.webp'),
]);

// ── MI Explainer ─────────────────────────────────────────────────────────────
chr_fields($home, [
    'mi_heading'                => 'Motivational Interviewing explained',
    'mi_summary'                => 'Motivational Interviewing (MI) is a collaborative way of speaking that moves through four processes, engage, focus, evoke, plan, and four micro skills called OARS: open questions, affirmations, reflective listening, summaries. Reflective listening is the workhorse.',
    'mi_cta_label'              => 'Read the full white paper',
    'mi_cta_url'                => '/chronilogix-mi-whitepaper.pdf',
    'mi_anatomy_badge'          => 'How the reply works',
    'mi_avoids_label'           => 'What it avoids',
    'mi_does_label'             => 'What it does instead',
    'mi_comparison_badge'       => 'MI in action',
    'mi_coach_message'          => 'Hi James — it’s been about ten days since we last talked. Welcome back. What’s been on your mind about the eating plan?',
    'mi_member_message'         => 'I fell off it for two weeks. Work blew up and I just gave up.',
    'mi_generic_label'          => 'A typical chatbot would say',
    'mi_generic_reply'          => 'No worries! Let’s get you back on track. Try logging three meals today.',
    'mi_chrono_label'           => 'Chronilogix says',
    'mi_chrono_tag'             => 'MI-backed',
    'mi_chrono_reply'           => 'Two stressful weeks where the plan got pushed aside — that’s pretty common when work goes sideways. You came back to this conversation, which suggests it still matters to you. When you think about why you started this back in February, what comes up?',
    'mi_science_eyebrow'        => '30 years of research',
    'mi_science_heading'        => 'The human intelligence',
    'mi_science_heading_muted'  => 'behind our AI.',
    'mi_science_body'           => 'At the heart of our platform is not just technology. It is 30 years of global experience and research from Dr. Ken Resnicow, one of the world’s foremost experts in Motivational Interviewing and Cultural Tailoring. He has spent decades guiding patients across diverse backgrounds, conditions, and cultures toward real, lasting change.',
    'mi_science_cta_label'      => 'About Dr. Resnicow',
    // Deep-links to his section, not the top of /about — the team grid sits
    // above it, so the visitor would have to hunt for him. AboutScience owns
    // the #science anchor and its scroll-mt; HashLanding re-aligns once the
    // image-heavy grid above has settled. Matches the upstream design.
    'mi_science_cta_url'        => '/about#science',
    'mi_video_src'              => '/video/ken-resnicow-60s.mp4',
    'mi_video_role'             => 'Chief Science Officer',
    'mi_video_name'             => 'Dr. Ken Resnicow',
]);
update_field('mi_video_poster', chr_media('ken-thumbnail.webp'), $home);
update_field('mi_avoids', [
    [ 'text' => 'Making the setback seem small' ],
    [ 'text' => 'Adding blame or pressure' ],
    [ 'text' => 'Rushing straight to a plan' ],
], $home);
update_field('mi_moves', [
    [ 'verb' => 'Reflects', 'desc' => 'Mirrors back what he said, without judging.' ],
    [ 'verb' => 'Affirms',  'desc' => 'Recognises that he came back, an early sign of change.' ],
    [ 'verb' => 'Evokes',   'desc' => 'Asks what first motivated him.' ],
    [ 'verb' => 'Plans',    'desc' => 'Comes next, and it’s earned, not forced.' ],
], $home);

// ── Solution ─────────────────────────────────────────────────────────────────
chr_fields($home, [
    'solution_eyebrow'             => 'The agents',
    'solution_heading_line1'       => 'Two contextually engineered',
    'solution_heading_line2'       => 'AI coaches.',
    'solution_heading_muted'       => 'Not just conversational AIs.',
    'solution_primary_cta_label'   => 'Talk to Coach',
    'solution_secondary_cta_label' => 'Learn more about the product',
    'solution_secondary_cta_url'   => '/product',
]);
update_field('solution_agents', [
    [
        'name' => 'Roni AI', 'condition' => 'Diabetes',
        'body' => 'Adaptive coaching for the food, activity, and medication choices that happen between clinic visits. Built around the member, not a template.',
        'topics' => [ [ 'topic' => 'Open questions' ], [ 'topic' => 'Autonomy support' ], [ 'topic' => 'Change talk' ], [ 'topic' => 'Complex reflections' ], [ 'topic' => 'MI-adherent' ] ],
        'featured_q' => 'I keep skipping my evening dose.',
        'featured_a' => 'Sounds like the evening dose isn\'t fitting your life right now. Tell me what gets in the way: the timing, the way it sits with you, or something else? We can move it before we fight it.',
        'featured_context' => 'Roni AI · Reflective adherence coaching · MI fidelity',
        'pattern' => chr_media('roni-pattern.webp'), 'image' => chr_media('roni.png'), 'halo_color' => '#F9904D',
    ],
    [
        'name' => 'Millie AI', 'condition' => 'Mental Health',
        'body' => 'Reflective coaching for the 2 AM spiral and the long stretch between therapy sessions. Therapeutically informed, never prescriptive.',
        'topics' => [ [ 'topic' => 'Complex reflections' ], [ 'topic' => 'Empathy' ], [ 'topic' => 'Evocation' ], [ 'topic' => 'Open questions' ], [ 'topic' => 'Change talk' ] ],
        'featured_q' => 'I can\'t get my mind to slow down.',
        'featured_a' => 'Racing thoughts aren\'t yours to solve at midnight. Try this with me. Name three things you can see, three you can hear, three you can feel. Your body lands first, the mind follows.',
        'featured_context' => 'Millie AI · Grounding + reflective listening · MI fidelity',
        'pattern' => chr_media('millie-pattern.webp'), 'image' => chr_media('millie.png'), 'halo_color' => '#B8617C',
    ],
], $home);

// ── Problem ──────────────────────────────────────────────────────────────────
chr_fields($home, [
    'problem_image_alt'      => 'A man sits cross-legged on a bed in afternoon light, alone, mid-thought.',
    'problem_heading_lead'    => 'The most expensive moments',
    'problem_heading_rest'    => 'happen between appointments and where there is no care.',
    'problem_para1'           => 'America doesn’t have a therapy shortage — it has a continuity-of-care shortage. There simply aren’t enough clinicians, coaches, care managers, or diabetes educators to provide daily support between appointments. AI coaching fills those gaps by extending the reach of the existing workforce — and replacing it where AI coaching can provide care efficaciously.',
    'problem_shortage_eyebrow'=> 'The real shortage',
    'problem_para2'           => 'It’s not therapists that run short — it’s the hours between them. A therapist may see a patient once every two to four weeks, for 45 to 60 minutes, while a person with diabetes, anxiety, depression, obesity, hypertension, or heart disease makes hundreds of health decisions in between. No workforce can be there for all of them.',
    'problem_resolution'      => 'Care has to live in the hours between.',
    'problem_button_eyebrow' => 'The problem, in detail',
    'problem_button_title'   => 'Where care breaks down between visits.',
    'problem_popup_eyebrow'  => 'The problem, in detail',
    'problem_popup_heading'  => 'Where care breaks down between visits.',
]);
update_field('problem_image', chr_media('problem-portrait.webp'), $home);
update_field('problem_observations', [
    [ 'text' => 'The costliest claims almost always begin as small, unaddressed risks between visits.' ],
    [ 'text' => 'The moments that matter most arrive off hours: shift workers and first responders need support at 2 AM, not 2 PM.' ],
    [ 'text' => 'Coaching and behavioral support rarely get reimbursed, so people wait until things worsen and the bill arrives as an ER visit, not an appointment.' ],
    [ 'text' => 'Diabetes hits Hispanic men 64% harder than average, yet they make up just 2% of the people the CDC\'s national prevention program reaches.' ],
    [ 'text' => 'Human care fluctuates with burnout, caseloads, and turnover.' ],
], $home);
update_field('problem_facts', [
    [ 'lead' => '40%', 'unit' => '', 'body' => 'of Americans live in a Mental Health Professional Shortage Area, and more than 6,000 additional practitioners are needed just to close today’s federally designated gaps. HRSA projects shortfalls of roughly 99,780 counselors, 99,840 psychologists, 43,810 psychiatrists, 77,050 addiction counselors, and 33,840 marriage and family therapists over the next decade — and those figures reflect today’s utilization, not the full unmet need.', 'source' => 'HRSA · Health Workforce projections', 'waterfall' => '' ],
    [ 'lead' => '15M+', 'unit' => '', 'body' => 'global shortage of behavioral health and chronic care coaches. The world cannot hire its way out of the gap.', 'source' => 'WHO Mental Health Atlas', 'waterfall' => '' ],
    [ 'lead' => '129M', 'unit' => '', 'body' => 'Americans live with at least one chronic condition. 60% of adults have one and 40% have two or more, and chronic disease drives roughly 90% of U.S. healthcare spending — demand that already outstrips the supply of nurses, diabetes educators, care managers, and health coaches. To keep up, health systems increasingly lean on care coordinators, community health workers, AI-assisted coaching, and remote monitoring.', 'source' => 'CDC', 'waterfall' => '' ],
    [ 'lead' => '40M', 'unit' => '', 'body' => 'Americans live with diabetes, including 11M undiagnosed. Another 115M have prediabetes, at risk of progressing without intervention.', 'source' => 'CDC', 'waterfall' => '' ],
    [ 'lead' => '61M+', 'unit' => '', 'body' => 'American adults live with mental illness, 1 in 5, every year. Nearly half will meet diagnostic criteria in their lifetime.', 'source' => 'SAMHSA · National Survey on Drug Use and Health', 'waterfall' => '' ],
    [ 'lead' => '70%', 'unit' => '', 'body' => 'of patients discharged from the ER after a suicide attempt never begin outpatient mental health treatment. Suicide risk runs 300× higher in the first week and 200× higher across the first month for those left without follow-up.', 'source' => 'JAMA Psychiatry · post-discharge cohort studies', 'waterfall' => '' ],
    [ 'lead' => '$300B', 'unit' => '', 'body' => 'in U.S. prescriptions go unfilled every year, most because of ambivalence, not forgetting. The intervention that resolves ambivalence is conversation, not reminders.', 'source' => 'Annals of Internal Medicine · WHO', 'waterfall' => "Prescription unfilled. Ambivalence wins quietly\nFollow up appointment skipped or rescheduled out\nSymptoms drift, the gap widens between visits\nHelp arrives only after escalation, often in the ER" ],
    [ 'lead' => '2 to 6', 'unit' => 'wks', 'body' => 'is the average wait for in person mental health care. Meanwhile, human coaches stay scarce and expensive.', 'source' => 'WHO', 'waterfall' => '' ],
], $home);

// ── Outcome ──────────────────────────────────────────────────────────────────
chr_fields($home, [
    'outcome_eyebrow'         => 'With Chronilogix',
    'outcome_heading_line1'   => 'There in the moment.',
    'outcome_heading_line2'   => '24/7. No waitlist. Judgment free. Consistent.',
    'outcome_body'            => 'Engagement rises, adherence improves, and avoidable utilization drops.',
    'outcome_stat_value'      => 58,
    'outcome_stat_suffix'     => '%',
    'outcome_quote_text'      => 'reduction in new Type 2 diabetes cases,',
    'outcome_quote_muted'     => 'demonstrated by the US Diabetes Prevention Program when lifestyle change is supported between appointments.',
    'outcome_source_line'     => 'Source · US Diabetes Prevention Program · CDC and NIH',
    'outcome_bridge'          => 'The kind of continuous, between visit support Chronilogix scales.',
    'outcome_gallery_heading' => 'Care that doesn’t go quiet.',
    'outcome_gallery_subhead' => '(Between visits. After discharge. At 11 PM.)',
]);
update_field('outcome_cards', [
    [ 'src' => chr_media('for-employees.webp'), 'alt' => 'A quiet, open frame, the kind of moment between scheduled care.', 'label' => "The moments care can't schedule for", 'body' => "11 PM stress eating. Anxiety at midnight. The skipped evening dose. Chronilogix is there when the appointment isn't." ],
    [ 'src' => chr_media('for-universities.webp'), 'alt' => 'A still frame from the long stretch after an appointment ends.', 'label' => 'The space after the appointment', 'body' => 'After discharge, after the session, after motivation slips. Continuous reinforcement that keeps people from quietly falling through.' ],
], $home);

// ── Who We Serve ─────────────────────────────────────────────────────────────
chr_fields($home, [
    'serve_sr_heading'    => 'The Markets We Serve',
    'serve_eyebrow'       => 'The Markets We Serve',
    'serve_heading_lead'  => 'One platform.',
    'serve_heading_muted' => 'Every side of the system.',
    'serve_body'          => 'Employers, brokers, health plans, product vendors, and wellness platforms each get a different return from the same engine — and the people who’d otherwise go unreached get a way in.',
    'serve_cta_label'     => 'Talk to our team',
    'serve_cta_url'       => '#book-a-demo',
    'serve_portrait_alt'  => 'Two people in unhurried conversation in a warm, light-filled space.',
    'serve_portrait_image'=> chr_media('who-we-serve.webp'),
]);
update_field('serve_personas', [
    [
        'kind'=>'popup','key'=>'employers','label'=>'Employers','intro'=>'For HR leaders & benefits owners',
        'hook'=>'Reach an additional 25% of employees who never raise their hand — before they surface in claims.',
        'glyph'=>'building','icon_variant'=>'coral',
        'headline_lead'=>'Reach every employee.','headline_muted'=>'Not just the few who ask.',
        'description'=>'Chronilogix engages an additional 25% of your employees who were not previously receiving care — the benchmark Aetna reported from the Aetna case study. At $60–70 per member per month, live coaching is too expensive to offer at real scale. Chronilogix delivers the same evidence-based coaching to your whole population, 24/7, at a fraction of the cost.',
        'metrics'=>[
            [ 'lead'=>'+25%', 'caption'=>'Additional employees engaged', 'comparison'=>'Not previously receiving care → reached, per Aetna' ],
            [ 'lead'=>'50%',  'caption'=>'Of live coaching, replaceable', 'comparison'=>'Live coaching calls → up to half replaced, no measurable decline' ],
            [ 'lead'=>'24/7', 'caption'=>'Available the moment it\'s needed', 'comparison'=>'Business hours → every hour' ],
        ],
        'signals'=>[],
    ],
    [
        'kind'=>'link','key'=>'brokers','label'=>'Benefits Brokers','intro'=>'For benefits consultants & brokers',
        'hook'=>'A defensible, CFO-ready ROI story — not another point solution.',
        'glyph'=>'briefcase','icon_variant'=>'ember',
        'href'=>'/solutions/brokers','link_label'=>'Read the full Brokers story',
        'audio_src'=>'/audio/chronilogix-broker-track.mp3','audio_title'=>'A message to benefits brokers','audio_duration'=>122,
    ],
    [
        'kind'=>'popup','key'=>'health-plans','label'=>'Health Plans & ACOs','intro'=>'For health plans & accountable care organizations',
        'hook'=>'First-line claims mitigation — engage members before the claim.',
        'glyph'=>'shield','icon_variant'=>'peach',
        'headline_lead'=>'Claims mitigation,','headline_muted'=>'before the claim.',
        'description'=>'A first line claims mitigation strategy. Chronilogix engages members before issues escalate, replacing up to 70% of routine human coaching at roughly one twentieth the cost, while improving access and member experience.',
        'metrics'=>[
            [ 'lead'=>'70%', 'caption'=>'Of routine coaching, replaceable', 'comparison'=>'Human coach required → Chronilogix covers' ],
            [ 'lead'=>'1/20','caption'=>'Of live coaching cost',           'comparison'=>'Baseline → ~5% of baseline' ],
            [ 'lead'=>'Pre', 'caption'=>'Engagement, before escalation',   'comparison'=>'Reactive triage → proactive outreach' ],
        ],
        'signals'=>[],
    ],
    [
        'kind'=>'link','key'=>'vendors','label'=>'Product Vendors','intro'=>'For chronic care product & device vendors',
        'hook'=>'Your product isn\'t the problem. What happens after delivery is.',
        'glyph'=>'box','icon_variant'=>'peach',
        'href'=>'/solutions/vendors','link_label'=>'Read the full Vendors story',
        'audio_src'=>'/audio/chronilogix-vendor-track.mp3','audio_title'=>'A message to chronic care product vendors','audio_duration'=>139,
    ],
    [
        'kind'=>'popup','key'=>'wellness-platforms','label'=>'Wellness Platforms','intro'=>'For consumer & enterprise wellness apps',
        'hook'=>'The engagement layer your platform is missing.',
        'glyph'=>'device','icon_variant'=>'coral',
        'headline_lead'=>'The engagement layer','headline_muted'=>'your platform is missing.',
        'description'=>'Embed Chronilogix as a white labeled coach to drive longer sessions, deeper retention, and more upgrade moments, without expanding staff or building clinical IP in house.',
        'metrics'=>[],
        'signals'=>[
            [ 'label'=>'Longer sessions, deeper retention', 'body'=>'An engagement layer designed for return visits: more upgrade moments without reacquiring users.' ],
            [ 'label'=>'White labeled by design',           'body'=>'Your brand stays the surface; Chronilogix runs the coaching loop quietly underneath.' ],
            [ 'label'=>'No new staff, no clinical IP to build','body'=>'Skip the years of methodology work and the headcount that comes with it. Plug in, ship.' ],
        ],
    ],
    [
        'kind'=>'popup','key'=>'underserved','label'=>'Underserved & Uninsured','intro'=>'For public health & community care programs',
        'hook'=>'Judgment-free behavioral support, reachable at population scale.',
        'glyph'=>'heart','icon_variant'=>'ember',
        'headline_lead'=>'Care without the gate.','headline_muted'=>'Reachable at population scale.',
        'description'=>'For people who often have no support alternative at all (the uninsured, underserved communities, and those who cannot afford repeated sessions), Chronilogix is an accessible, judgment free entry point to behavioral support at population scale.',
        'metrics'=>[],
        'signals'=>[
            [ 'label'=>'An entry point where there isn\'t one', 'body'=>'For the uninsured and underserved, often the only behavioral support available at all.' ],
            [ 'label'=>'Judgment free, no scheduling, no cost barrier','body'=>'Help that arrives in the moment, on a phone, without the friction that turns people away.' ],
            [ 'label'=>'Population scale reach','body'=>'Picks up where staffed community programs cap out. Every member, every hour, every language.' ],
        ],
    ],
], $home);

// ── Customer Stories (AetnaProof — field proof) ──────────────────────────────
chr_fields($home, [
    'stories_eyebrow'       => 'Proof in the field',
    'stories_heading_lead'  => 'The premise is proven.',
    'stories_heading_muted' => 'So is the method.',
    'stories_intro'         => 'Support between visits changes outcomes — and Dr. Resnicow’s Motivational Interviewing, the method inside Chronilogix, is <span class="text-ink">what keeps people engaged in it</span>.',
]);
update_field('stories_proofs', [
    [
        'logo' => chr_media('Aetna_Logo.svg'), 'logo_alt' => 'Aetna',
        'stat' => '53.1% → 76%', 'stat_class' => 'text-[1.3em]',
        'measure' => 'member engagement',
        'clause' => 'after Aetna’s care teams retrained in Dr. Resnicow’s method — dropouts cut by more than half.',
        'source' => 'Source · Aetna Care Management · post-MI integration',
    ],
    [
        'logo' => chr_media('us-dpp-logo.png'), 'logo_alt' => 'Centers for Disease Control and Prevention',
        'stat' => '58%', 'stat_class' => 'text-[1.55em]',
        'measure' => 'fewer new Type 2 diabetes cases',
        'clause' => 'when lifestyle support continues between appointments — the gap Chronilogix covers.',
        'source' => 'Source · US Diabetes Prevention Program · CDC and NIH',
    ],
], $home);

// ── Testimonials ─────────────────────────────────────────────────────────────
chr_fields($home, [
    'testimonials_heading' => 'What members are saying about Chronilogix AI Coaching',
]);
update_field('testimonials_items', [
    [ 'name' => 'Adrian C.', 'quote' => 'You don’t need to fix everything at once. Just pick one small action you’ll actually do tomorrow. That really clicked because I’ve been overwhelmed trying to change too much at once. It was simple, but exactly what I needed to hear.' ],
    [ 'name' => 'David B.', 'quote' => 'Working with the AI Coach felt supportive, practical, and motivating. The conversations felt personalized, helped me create realistic SMART goals, and gave me encouragement without sounding judgmental. I left each session feeling clearer, more confident, and motivated to keep improving step by step.' ],
    [ 'name' => 'Carl D.', 'quote' => 'Using Chronilogix has helped me turn a vague intention to “sleep better” into a clear, structured routine with measurable steps. The coaching felt increasingly tailored over time, especially in how it adapted suggestions to my actual schedule, which made it easier to stay consistent.' ],
    [ 'name' => 'Henry Clay', 'quote' => 'The AI Coach told me about the 4-7-8 and box breathing techniques, walking me through how it’s done. That was the most helpful thing she did for me.' ],
    [ 'name' => 'Serena Cooper', 'quote' => 'The most helpful thing the AI Coach said was to focus on steady, realistic progress instead of trying to accomplish everything at once. That perspective made the goal feel more manageable and helped reduce pressure while still keeping me motivated.' ],
    [ 'name' => 'Waleed Smith', 'quote' => 'The AI Coach helped me set clear, realistic goals and made it easier to stay consistent by breaking things into simple steps. The guidance was structured and easy to follow.' ],
    [ 'name' => 'Muhammad F.', 'quote' => 'The most helpful thing the AI Coach said was breaking the larger goal into smaller, manageable steps and emphasizing consistency over perfection.' ],
    [ 'name' => 'J.S.', 'quote' => 'I just told the AI casually about thoughts of dying that come to my mind, and it did well. It insisted I call 988, or get to an emergency room, or go stay with someone before we proceed. I truly appreciated that sense of empathy.' ],
], $home);

if (class_exists('WP_CLI')) {
    WP_CLI::success("Seeded Home page (ID {$home}).");
}
