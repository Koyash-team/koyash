# Week 7 Reflection

*Sprint 5 closed the project: the deterministic irritant warning for sensitive-skin users
(US-11), self-service password reset via the customer's mail domain (US-27), and the frontend
UX rework (PBI-506) all shipped, the customer confirmed the transition (`Accepted`), and the
final `MVP v3` release (`v1.4.0`) was cut. This reflection focuses on the follow-up maintenance,
the transition work, and what the trial-to-delivery loop taught us.*

## Learning points

- **Validate deployment-platform constraints before building on them.** Password reset was not
  blocked by our code but by our host: Railway blocks outbound SMTP on its plans, so the SMTP
  mailer could never deliver from production. The fix was to change *transport*, not the
  feature — an HTTPS mail API (Resend) on port 443 — while keeping the single-use, expiring,
  no-user-enumeration design. The lesson is to confirm the platform's network limits early,
  before a feature depends on them.
- **A deterministic feature can satisfy an "AI-flavoured" request.** US-11 was originally our
  own idea to have the LLM judge ingredients. Keeping the LLM strictly to justification
  (ADR-001), we delivered the warning as a rule-based, tested filter for sensitive-skin users
  instead — safer, testable, and with no new external dependency. Scoping to the real gap (a
  suitable product that still carries a common irritant) mattered more than the technique.
- **The trial → feedback → targeted-fix loop closed cleanly.** Every Week 6 trial item mapped
  to Sprint 5 scope and was resolved: finish the frontend (PBI-506), password reset (US-27),
  reminders re-scoped to the customer's Telegram bot, and the irritant warning (US-11). A real
  trial produced feedback a scripted demo would not have.
- **Contract changes need their tests in the same change.** The replacement endpoint's response
  shape changed (`ProductOut` → `BagItem`, so alternatives now carry a justification) without
  its test being updated in the same PR, which turned CI red until a follow-up fixed it.

## Validated assumptions

- **"Ready for independent use" is an acceptable transition outcome for this customer.** She
  tried `MVP v3` herself, approved it, and accepted the handover documentation in writing; she
  does not need a customer-side deployment during the course and deferred the operational
  transfer to a post-course discussion.
- **Guest-first plus deterministic safety still holds.** The account remains an optional layer,
  and allergens / special conditions stay hard-excluded independently of the new advisory
  warning.

## Friction and gaps

- **The frontend arrived as one large PR near the end of the Sprint again** (the recurring
  pattern from Sprints 3–4), and it opened with red CI — an unformatted-code failure and a
  backend test broken by the contract change, plus a pre-existing flaky timer test that
  surfaced. All were fixed in follow-up commits, but it cost a review cycle at the deadline.
- **Operational ownership (hosting, database, mail, optional LLM key) is still team-owned.**
  This is a real post-course continuity risk; it is documented in `docs/customer-handover.md`
  with the concrete transfer steps, but the transfer itself is deferred.

## Planned response (carried beyond the course)

- Land API/contract changes **together with their test updates** in the same PR, and run
  prettier/tests locally before opening, so CI does not go red at the deadline.
- Pair on the frontend earlier in the cycle so the UI is not the last thing to land.
- Complete the **operational-ownership transfer** in the post-course discussion (the transfer
  checklist is already written in the handover document), so the service survives beyond the
  course.
