# Sprint 5 Retrospective

*Sprint 5 was the final Sprint. It responded to the Week 6 trial feedback and completed the
transition: the deterministic irritant warning (US-11), self-service password reset (US-27),
and the frontend UX rework (PBI-506) shipped; the customer confirmed the transition
(`Accepted`, `Ready for independent use`); and the final `MVP v3` release (`v1.4.0`) was cut.
Tracker email reminders (PBI-504) were dropped, as the customer runs them from her own Telegram
bot.*

## What went well

- **Every Week 6 trial item was resolved.** The trial feedback mapped one-to-one onto Sprint 5
  scope and all of it landed: frontend polish, password reset, the irritant warning, and the
  reminders re-scope.
- **A blocker was cleared pragmatically without changing the feature.** Password-reset email
  could not be delivered over SMTP on our host; switching the transport to the Resend HTTPS API
  (in a background task) fixed delivery while preserving the single-use / expiring /
  no-user-enumeration behaviour.
- **The final transition was actually confirmed.** The customer trialed `MVP v3` herself,
  approved it, and accepted the handover documentation in writing — a concrete transition
  outcome, not an assumed one.
- **Safety stayed deterministic.** US-11 shipped as a rule-based, tested warning rather than an
  LLM ingredient judgement, keeping ADR-001 intact and adding no external dependency.

## What did not go well

- **The frontend landed as one large PR near the deadline** and opened with red CI: an
  unformatted-code (prettier) failure, a backend test broken by the alternatives contract
  change (`ProductOut` → `BagItem`) that was not updated in the same PR, and a pre-existing
  flaky timer test in the Loading screen that surfaced. All were fixed in follow-up commits,
  but the churn happened at the deadline.
- **The release and the report set clustered at the Sprint boundary** again, even though the
  `CHANGELOG` was kept current on individual PRs.

## What the team changed or attempted to change based on the previous Sprint Retrospective, and what results they observed

- **Sprint 4 AP1 (make "deployed from `main` with the UI matching the design" the *first*
  milestone, not the last):** *partially applied.* The deployment already redeploys from
  `main`, and the UI was brought to the design this Sprint — but the frontend work still
  concentrated near the end rather than being front-loaded, so the same compression recurred.
- **Sprint 4 AP2 (assemble the release and the report incrementally):** *partially applied.*
  `CHANGELOG.md` was updated on user-visible PRs during the Sprint, which helped; but dating the
  release and writing the report set still happened at the boundary.

## Action points (carried beyond the course)

1. Land API/contract changes **with their test updates in the same PR**, and run
   prettier/tests locally before opening a PR, so CI does not go red at the deadline.
2. **Front-load and pair on the frontend** so UI polish is not the last thing to land — the
   one retro item that recurred across Sprints 3–5.
3. Complete the **operational-ownership transfer** (Railway, MongoDB Atlas, Resend, optional
   LLM key) in the post-course discussion, following the transfer checklist already in
   `docs/customer-handover.md`, so the product remains usable after the course.
