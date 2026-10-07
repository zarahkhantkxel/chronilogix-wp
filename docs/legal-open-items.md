# Legal pages — open items

Tracks what still needs a decision on `/privacy` and `/terms`. The pages
ship and read as finished; the items below are things only the business
or counsel can resolve.

The supplied copy was adapted from another company's policy set, and the
adaptation was done with find-and-replace. That left artifacts which are
listed under **Fixed in transcription** — worth knowing about, because
where a mechanical replacement went wrong once it may have gone wrong
somewhere a reader can't detect.

---

## 1. The training-data claim contradicts the site

**This is the one to resolve first.**

Privacy §III.B and Terms §4.3 / §5.2 grant Chronilogix the right to use
User Content — aggregated and de-identified — to train and improve the AI
models.

Every page on the site, including these two, carries this line in the
footer directly beneath the policy text:

> Member data is never used to train our models.

The same claim is a stated non-negotiable in `CLAUDE.md` and appears in
`FaqList`. A buyer reading the footer and then §III.B will see a
contradiction, and "de-identified" does not resolve it in the plain
reading — the data still originates in member conversations.

One of the two has to change. Options, roughly:

- Narrow the policy to match the marketing claim (no training on member
  content at all, evaluation on synthetic/licensed data only).
- Change the footer and FAQ line to match the policy (e.g. "Member
  conversations are never sold, and are only ever used in de-identified,
  aggregated form").

Do not leave both as they are.

## 2. The copy describes a B2C consumer app

The supplied content assumes a direct-to-consumer product: App Store and
Google Play subscriptions, free trials that auto-convert, weekly and
annual plans, phone-number OTP signup, nicknames, and "AI emotional
wellness coach" framing.

`CLAUDE.md` describes Chronilogix as sold B2B only — PMPM, university
subscriptions, employer benefits, wellness-app integrations — where "the
patient/student/employee is the end user but never the buyer."

Consequences if the B2B model is the real one:

- Terms §6 (subscriptions, free trials, auto-renewal, price changes)
  describes a billing relationship most end users will never have.
- Privacy §I positions Chronilogix as **data controller** for everything.
  In a B2B healthcare deployment the licensing organisation is normally
  the controller / covered entity and Chronilogix is the processor /
  business associate. That distinction drives BAAs, breach notification
  duties, and who answers a data-subject request.
- Neither document mentions the licensing organisation at all.

`HiwIntegration.tsx` does reference "Stripe powered consumer direct
billing," so some consumer-direct path may genuinely exist. Confirm which
model these documents are meant to cover — or whether two sets are needed.

## 3. Entity type: Inc. or LLC

The source used "Chronilogix Inc.", "CHRONILOGIX LLC.", and "CHRONILOGIX
LLC" interchangeably, sometimes in adjacent clauses. Standardised to
**Chronilogix, Inc.** throughout, matching the site footer ("© 2026
Chronilogix, Inc."). If the operating entity is actually an LLC, this
needs a pass across both documents — it appears in the governing-law,
liability, indemnification, and app-store clauses.

## 4. Arbitration administrator — assumption made

Terms §10.3 in the source read:

> The arbitration shall be administered by the United States in
> accordance with its then-current rules.

"The United States" does not administer arbitrations; this is a
find-and-replace casualty (the original almost certainly named a specific
institution). Left as-is the clause is unenforceable as written.

**Assumption applied:** the **American Arbitration Association**, the
default for US consumer arbitration. This is a substantive legal choice
made to avoid shipping a broken clause — counsel must confirm or replace
it, and should also specify which AAA rule set applies.

## 5. Server location

Privacy §VI said data "is stored on our secure servers located in
Delaware." Delaware is the state of incorporation; the business address
is in Fairfield, CT. Changed to "on our secure servers in the United
States", which is consistent with §VIII and safe if hosting is US-based.
**Confirm the actual hosting region** — if any data sits outside the US,
§VIII's transfer language needs to reflect it.

## 6. Supervisory authority

Privacy §VII named "the Personal Data Protection Commission (PDPC) in
Delaware." The PDPC is Singapore's authority — another artifact of the
source document. Changed to the **Delaware Department of Justice** under
the **Delaware Personal Data Privacy Act** (the source's "Delaware PDPA"
was also expanded to its correct name). Worth a check that Delaware is
the right forum for the user base.

## 7. HIPAA posture is softer than the site's

Privacy §VI says "We follow HIPAA standards **where applicable**."
`ComplianceBadges` asserts "HIPAA Compliant" flatly, `Pricing` says "All
plans include full HIPAA compliance," and `CoreCapabilities` shows a live
HIPAA chip plus "BAA available on request." The policy hedges where the
marketing asserts. Align them.

Related: the badge component still marks **SOC 2 Type II** and **GDPR
Ready** as `status: "confirm"` — unconfirmed. Neither legal document
claims them, which is the safe side, but the badges do.

## 8. Analytics and ad pixels on a health product

Privacy §III.E and §X describe Google Analytics, Facebook/Google
retargeting, and cross-device ad measurement. For a product handling
health information this is the exact pattern behind the OCR's tracking-
technologies guidance and the resulting wave of enforcement. Confirm that
no identifiable health data reaches these pixels, and that they are gated
on consent — or drop them.

## 9. Crisis handling: the documents and the product disagree

Terms §2.3 says Chronilogix AI "cannot engage in or respond to" a Crisis
Situation and surfaces hotlines only "as a redirect." The site sells the
opposite as a feature: `CoreCapabilities` has a "988, built into the
conversation" panel describing graduated risk assessment and escalation,
and `Testimonials` carries a member account of the AI insisting they call
988.

Both can be true (the disclaimer limits liability; the feature describes
behaviour), but the gap is wide enough that a careful buyer will ask. Have
counsel confirm the disclaimer still holds given what the product
actually does.

**Addition made:** §2.3 listed 911 and 112 but not 988. Added the 988
Suicide & Crisis Lifeline as plain text — no `tel:` link, per the
project's standing rule.

## 10. Brand hierarchy: "Chronilogix AI"

`CLAUDE.md` sets a strict hierarchy: **Chronilogix** is the platform,
**Roni** is the engine inside it, and the two must not blur. The supplied
copy defines the whole service as "**Chronilogix AI**" — a third name,
used as the subject of nearly every clause.

Kept as supplied, because a defined term in a contract is not a copy
tweak. But it is a brand-hierarchy violation on two pages of the site,
and it should be a deliberate decision rather than an inherited one.

## 11. Product descriptor differs between the two documents

Privacy calls it an "emotional wellness coach." Terms calls it a
"behavioral health and chronic care support application." Terms §3.3 says
"self-help emotional wellness and chronic care tool." Pick one descriptor
and use it in both.

## 12. Liability cap — greater-of or lesser-of

Terms §8.2 in the source read:

> … shall in no event exceed the total amount paid by you to CHRONILOGIX
> for the use of Chronilogix AI in the twelve (12) months immediately
> preceding the event giving rise to the liability, **or $100.00**.

"Shall not exceed A, or B" does not say which of the two governs, and the
answer is money. Read as *greater of*, the $100 is a floor protecting a
user who paid nothing. Read as *lesser of*, it is a hard ceiling of $100
for everyone.

**Assumption applied:** *the greater of* — the more common construction,
and the one a court is more likely to uphold against an unconscionability
challenge. If the intent was a flat $100 ceiling, this clause needs
rewriting, not just reordering. Counsel decides.

## 13. Contact address

Both documents route everything — privacy questions, rights requests,
DMCA, feedback, cancellation — to `support@chronilogix.com`, at 35
Burrwood Common, Fairfield, CT. Dedicated `privacy@` / `legal@` aliases
would be conventional, and a DMCA agent is normally named separately.

---

## Fixed in transcription

Mechanical corrections, no change in meaning:

| Source | Corrected |
|---|---|
| `sophia@heyChronilogix.ai` → `mailto:sophia@heynoah.ai` | `support@chronilogix.com` |
| `heynoah.ai/privacy-policy`, `heynoah.ai/terms-conditions` | `/privacy`, `/terms` |
| "corruLLCd files" | "corrupted files" |
| "insure to the benefit of the parties" | "inure to the benefit" |
| "disputes with CHRONILOGIXARE resolved" | "disputes with Chronilogix are resolved" |
| "contributors of content.. DEFINITIONS" | paragraph closed; §1 heading separated |
| Privacy "OVERVIEW" unnumbered, next section "II." | numbered I–XII |
| "laws of Delaware, and the United States" (comma splice) | "the State of Delaware and of the United States" |
| Missing terminal periods after "CHRONILOGIX" (5 places) | closed |
| "You may also create a nickname, responses to standardized questionnaires for personalization within the app." | grammatical rewrite |
| Mixed British/American spelling | American throughout |

`ALL CAPS` emphasis was converted to bold within a set-off notice block
for the clauses where conspicuousness matters legally (arbitration,
warranty disclaimer, liability cap, the medical/crisis disclaimers).
Bold-and-set-off satisfies the conspicuousness expectation and is
readable; a wall of capitals defeats the purpose. If counsel wants
literal capitals restored, that is a change in `LegalDocument.tsx`, not
in the content.
