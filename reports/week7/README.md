# KOYASH — Week 7 Report (Sprint 5) · Final Assignment 6 submission index

**KOYASH** is a skincare recommendation service: you answer a short questionnaire (budget,
ingredient constraints, skin type, concerns) and get a "cosmetic bag" of real products in a
routine, with a reason for every pick. This is the **Week 7 public report** for **Sprint 5** —
the final follow-up increment, the `MVP v3` release, and the customer transition. It is also
the **final Assignment 6 submission index**; the full Week 6 evidence is linked below rather
than duplicated.

> **Week 6 report (full Sprint 4 evidence):** [reports/week6/README.md](../week6/README.md)

## Sprint 5 at a glance

- **Product Backlog board:** <https://github.com/orgs/Koyash-team/projects/1>
- **Sprint 5 Backlog view (board filtered to the milestone):**
  <https://github.com/orgs/Koyash-team/projects/1> · **milestone:**
  <https://github.com/Koyash-team/koyash/milestone/5>
- **Sprint 5 milestone:** <https://github.com/Koyash-team/koyash/milestone/5>
- **Dates:** 2026-07-13 – 2026-07-19 (Week 7)
- **Total size:** **18 Story Points** (PBI-503 · 5, PBI-506 · 3, PBI-505/507/508/509/510 · 2 each)

**Sprint 5 Goal.** Respond to the Week 6 trial feedback and complete the transition: ship the
deterministic irritant warning for sensitive-skin users (US-11), self-service password reset
via the customer's mail domain (US-27), and the remaining frontend UX fixes; then deliver the
final `MVP v3` release, confirm the transition with the customer, and produce the Week 7
evidence.

**Scope summary.** Irritant warning (US-11 / PBI-505), password reset (US-27 / PBI-503),
frontend UX fixes (PBI-506), the final `MVP v3` release (PBI-507), the public demo video
(PBI-508), final transition confirmation (PBI-509), Week 7 UAT (PBI-510), and the Week 7
report set (PBI-511). Tracker email reminders (PBI-504) were **dropped** after the Week 6
review (the customer runs reminders from her own Telegram bot).

## Week 7 follow-up and final MVP v3 changes

- **Password reset (US-27).** «Забыли пароль?» emails a single-use, 30-minute reset link; the
  password can then be changed. Delivered over the Resend HTTPS API (Railway blocks SMTP).
- **Irritant warning (US-11).** Deterministic heads-up for sensitive-skin users when a
  recommended product still carries a common irritant (fragrance, drying alcohol, a retinoid,
  or a strong acid); the product is not removed, and the LLM stays justification-only.
- **Frontend UX fixes (PBI-506).** Design brought in line with Figma and the missing
  navigation/actions added.

- **Final SemVer release (`MVP v3`):** [v1.4.0](https://github.com/Koyash-team/koyash/releases/tag/v1.4.0)
- **CHANGELOG:** [CHANGELOG.md](../../CHANGELOG.md)

### Access the final product

- **Web app (final product access artifact):** <https://koyash-production-25e0.up.railway.app>
- **API + Swagger:** <https://koyash-production.up.railway.app/docs>
- **Run / access instructions:** [README → Run it locally](../../README.md#run-it-locally)

No account is required to get a recommendation — signing in only adds the personal features.

## Customer-facing documentation set

- [README.md](../../README.md) — public entry point
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [AGENTS.md](../../AGENTS.md)
- [docs/customer-handover.md](../../docs/customer-handover.md)
- **Hosted documentation site:** <https://koyash-team.github.io/koyash/>

## Final transition outcome (Part 8)

- **Handover level reached:** `Ready for independent use`.
- **Customer-confirmation status:** `Accepted` — at the Week 7 transition-confirmation meeting
  (2026-07-18) the customer trialed `MVP v3`, confirmed she had tried it herself and approved
  it, and **accepted the handover documentation in writing** as sufficient for the reached
  level. See [docs/customer-handover.md](../../docs/customer-handover.md).

**What was transferred / made available.** The team hands over the running service, the source
repository, and the maintained documentation set. Operational ownership (Railway, MongoDB
Atlas, Resend, optional LLM key) stays team-owned during the course; the customer does not need
a customer-side deployment now, and a possible operational transfer — with the concrete list of
accounts and environment values — is documented in
[docs/customer-handover.md → Transferring operational ownership](../../docs/customer-handover.md#transferring-operational-ownership-if-the-customer-self-hosts)
and deferred to a post-course discussion at her request.

**Remaining blockers / limitations / follow-up.** No transition blockers on the team side. A
minor UX observation (one screen felt "a bit raw") remains an optional follow-up. Post-course
operational continuity depends on the team-owned accounts staying active (see the handover
document's known limitations).

**Customer-independent use / customer-side deployment evidence.** The customer independently
tried `MVP v3` during the recorded session and approved it; she does not deploy or operate it
on her side (deferred post-course). Sanitized evidence is in the Sprint Review summary and
transcript; the private recording link and written acceptance are in the Week 7 Moodle
submission.

## Customer feedback and resulting work (Sprint 5)

| Feedback point | Resulting PBI / issue / outcome |
|---|---|
| "Finish the frontend to match the design" (Week 6) | Frontend UX fixes — [PBI-506 (#185)](https://github.com/Koyash-team/koyash/issues/185) |
| Password reset via the customer's mail domain (Week 6) | [US-27 (#159)](https://github.com/Koyash-team/koyash/issues/159) · [PBI-503 (#166)](https://github.com/Koyash-team/koyash/issues/166) — delivered |
| Irritant warning (Week 6) | [US-11 (#15)](https://github.com/Koyash-team/koyash/issues/15) · [PBI-505 (#184)](https://github.com/Koyash-team/koyash/issues/184) — delivered (deterministic) |
| Minor UX: one screen "a bit raw / not intuitive" (Week 7) | Optional post-course polish — noted, no change requested |
| Guest bag not saved after registration (found during demo prep) | [#202](https://github.com/Koyash-team/koyash/issues/202) — fixed in [PR #203](https://github.com/Koyash-team/koyash/pull/203) |

## Week 7 UAT / customer-trial results

The Sprint 5 changes were demonstrated live and exercised by the customer with no failures.
Per-scenario status is maintained in
[docs/user-acceptance-tests.md](../../docs/user-acceptance-tests.md) — password reset (US-27),
the irritant warning (US-11), and the reworked account/tracker frontend were the focus this
session. Week 7 execution is recorded on **UAT-010, UAT-011, UAT-012** and in the two new
scenarios **UAT-013** (password reset) and **UAT-014** (irritant warning); no scenario failed.

## Release, changelog, and demo video

- **Final `MVP v3` release:** [v1.4.0](https://github.com/Koyash-team/koyash/releases/tag/v1.4.0)
  — links the Sprint 5 milestone, `docs/customer-handover.md`, this report, and the demo video.
- **CHANGELOG:** [CHANGELOG.md](../../CHANGELOG.md) — the `[1.4.0]` section is dated for this release.
- **Public sanitized demo video (MVP v3):** <https://youtu.be/12R0pu7QiqE>

## Demo Day preparation

The Week 7 lab rehearsal preparation is complete: the slide deck follows the required Demo Day
structure, a speaker script assigns at least one slide to every member, and the talk is timed to
the limit with a pre-recorded demo under two minutes. The rehearsed presentation video and the
slide deck are submitted privately via Moodle (not committed to the public repository).

## Sprint Review artifacts

- [sprint-review-summary.md](sprint-review-summary.md)
- [sprint-review-transcript.md](sprint-review-transcript.md) — sanitized public transcript
  (brief off-record logistics/business matters excluded at the customer's request)
- [reflection.md](reflection.md)
- [retrospective.md](retrospective.md)
- [llm-report.md](llm-report.md)

## Final product status

`MVP v3` is the final course version: the guest questionnaire → justified cosmetic bag together
with the personal account (profile, one saved bag, «worked / didn't work» feedback, product
replacement, a 12-week result tracker, account management), password reset, and the
deterministic irritant warning — deployed, documented, and accepted by the customer at
`Ready for independent use`.

## Contribution traceability (Sprint 5)

| Member | GitHub | Role | Sprint 5 contribution | Evidence |
|---|---|---|---|---|
| Daria | `Dasha365` | Team lead · backend & data | Irritant warning (US-11) backend, password reset (US-27), the guest-bag carry-over fix, docs/handover + UAT, Week 7 reports, transition confirmation, the `v1.4.0` release; reviews | [#198](https://github.com/Koyash-team/koyash/pull/198), [#203](https://github.com/Koyash-team/koyash/pull/203), [#201](https://github.com/Koyash-team/koyash/pull/201), [#200](https://github.com/Koyash-team/koyash/pull/200); PBI-503/505/507/509/510/511 |
| Arthur | `Arthur20042007` | Backend & frontend · deployment | Frontend UX rework and the mail-delivery transport; deployment | frontend [#199](https://github.com/Koyash-team/koyash/pull/199), mail [#196](https://github.com/Koyash-team/koyash/pull/196); PBI-506 |
| Milana | `millfsw` | UX/UI design | Design of the reworked frontend screens | PBI-506 (design) |
| Anna | `fedyann` | UX/UI design | Design of the reworked frontend screens | PBI-506 (design) |
| Khasana | `khas-ab` | UX/UI design | Design of the reworked frontend screens | PBI-506 (design) |

## Evidence

The repository is **public**, so every artifact linked above — the
[Sprint 5 milestone](https://github.com/Koyash-team/koyash/milestone/5), the
[`v1.4.0` release](https://github.com/Koyash-team/koyash/releases/tag/v1.4.0), the reviewed
issue-linked PRs (e.g. the frontend rework [#199](https://github.com/Koyash-team/koyash/pull/199)
and the guest-bag fix [#203](https://github.com/Koyash-team/koyash/pull/203)), and the deployed
app — is directly inspectable without screenshots. Per the Artifact Requirements, embedded
screenshots are only needed for evidence that public links cannot reliably show, which does not
apply here.
