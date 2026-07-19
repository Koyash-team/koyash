# Week 7 Sprint Review — Summary

**Date:** 2026-07-18
**Duration:** ~11 minutes (one recorded meeting)
**Participants (roles):** KOYASH team — team lead / backend & data, backend & frontend, and UX/UI design; and the Customer (brand founder).
**Format:** One meeting covering the Sprint 5 Sprint Review, the Week 7 `MVP v3` walkthrough, the customer-executed trial (UAT), the customer-facing documentation acceptance, and the final transition confirmation (Assignment 6 Part 8 / 9.4 / 10.8).

**Recording and publication:** The meeting was recorded (the customer recorded it and shared the link for private submission). The customer permitted a sanitized public transcript; brief off-record logistics/business matters were excluded at her request. Full record: [sprint-review-transcript.md](sprint-review-transcript.md).

## Sprint 5 Goal reviewed

Respond to the Week 6 trial feedback and complete the transition: ship the deterministic irritant warning for sensitive-skin users (US-11), self-service password reset via the customer's mail domain (US-27), and the remaining frontend UX fixes; then deliver the final `MVP v3` release, confirm the transition with the customer, and produce the Week 7 evidence.

## What was demonstrated (MVP v3)

- **Password reset** — following the emailed link to set a new password.
- **Irritant warning (US-11)** — for a sensitive-skin user, a recommended product that still carries fragrance, alcohol, or an acid shows a patch-test heads-up on the card; the product stays in the bag.
- **Reworked frontend** — the design brought in line with Figma, plus the previously missing buttons.
- The customer explored the app herself via a shared link — the routine, the tracker, and marking a routine — and reacted positively throughout.

## Resolved Week 6 follow-up items

| Week 6 feedback | Sprint 5 outcome |
|---|---|
| "Finish the frontend to match the design" | Done — frontend reworked to Figma + missing buttons (PBI-506) |
| Password reset via the customer's mail domain | Done — US-27 / PBI-503, delivered and working (HTTPS mail API) |
| Tracker reminders | Dropped as agreed — the customer runs them from her own Telegram bot (PBI-504) |
| Irritant warning (US-11) | Done — deterministic, sensitive-skin-only version (PBI-505); LLM stays justification-only |

## Customer feedback and approvals

- **Overall:** "I'm happy with everything — it's all good, great work."
- **Documentation:** the updated `docs/customer-handover.md` was sent and **accepted in writing** as sufficient.
- **Minor UX observation:** one screen felt "not very intuitive / a bit raw" (top-right area) — an observation, not a requested change; captured as an optional follow-up.

## Final transition status and usefulness (Part 8)

- **Handover level reached:** `Ready for independent use`.
- **Customer-confirmation status:** `Accepted` — the customer confirmed she tried the product herself, approved it, and accepted the handover documentation in writing.
- **Independently used by the customer?** Tried herself and approved; not yet used in her own daily work (the product targets end users, and as a brand it needs further work).
- **Deployed / operated on customer side?** No — she does not need a customer-side deployment during the course. A possible operational transfer (Railway, MongoDB Atlas, Resend, optional LLM key + env values) was **deferred to a post-course discussion** at her request.

## Customer trial / UAT results

The Sprint 5 changes were demonstrated live and exercised by the customer, with no failures. Per-scenario status is maintained in [docs/user-acceptance-tests.md](../../docs/user-acceptance-tests.md) — password reset (US-27), the irritant warning (US-11), and the reworked account/tracker frontend were the focus this session.

## Remaining risks and post-course limitations

- **Operational ownership** (hosting, database, mail, optional LLM key) stays team-owned during the course; if those accounts lapse after the course the service stops (see the handover document's known-limitations/remaining-actions).
- **Minor UX polish** on one screen remains an optional follow-up.
- No customer-side deployment yet — deliberately deferred, not a blocker for the reached handover level.

## Sprint 5 close-out

Sprint 5 is the final sprint — there is no subsequent sprint to carry work into. The following
remaining items are completed **within this sprint**, before submission, rather than deferred:

- Finalize the `MVP v3` release once the remaining Sprint 5 PRs are merged (PBI-507).
- Record and publish the public sanitized demo video (PBI-508).
- Store the customer's written acceptance and the recording link in the Week 7 Moodle
  submission (private).

## Links

- Transcript: [sprint-review-transcript.md](sprint-review-transcript.md)
- User acceptance tests: [docs/user-acceptance-tests.md](../../docs/user-acceptance-tests.md)
- Customer handover: [docs/customer-handover.md](../../docs/customer-handover.md)
- Sprint 5 milestone: <https://github.com/Koyash-team/koyash/milestone/5>
