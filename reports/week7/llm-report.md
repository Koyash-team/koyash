# LLM Usage Report — Week 7

This report discloses how AI / LLM tools were used **as development assistance** during
Assignment 6, Week 7 (Sprint 5).

## AI tool used

The team used **Claude Code** (an AI coding/writing assistant) during the Sprint, and
**ChatGPT** earlier for design/presentation image generation. They were used to help with:

- **Code** — the deterministic irritant warning (US-11) on the backend and its display on the
  results and saved-bag cards, with its tests; the mail-transport fix for password reset (US-27)
  — switching delivery from SMTP to the Resend HTTPS API in a background task; and the
  follow-up fixes that got the frontend rework (PBI-506) to green CI (updating the alternatives
  test to the new `BagItem` response shape, applying Prettier, and clearing the Loading-screen
  timers on unmount to stop a test-teardown flake).
- **Documentation** — **structuring and editing** the Week 7 documentation: the customer-handover
  update (Accepted transition status and the self-host transfer steps), the UAT scenarios
  (UAT-013 password reset, UAT-014 irritant warning, and the Week 7 execution notes), and this
  Week 7 report set. Organizing sections and wording, not deciding the content.
- **Presentation** — drafting the Demo Day speaker script/structure; **ChatGPT** generated the
  illustrations used in the slide deck.

## How it was controlled

All AI-assisted output was **reviewed by the team and merged through the normal issue-linked,
peer-reviewed PR workflow**, with the CI quality gates (lint, type-check, build, tests,
coverage, quality-requirement tests, dependency scans, and the Markdown link check) enforced on
the protected `main` branch — one approving review from another team member on every PR, no
admin bypass. When a large frontend PR opened with failing checks, the failures were fixed and
re-verified (backend suite green at 98% coverage) before merge, rather than bypassed. Product
and process decisions — scope, the transition outcome, the customer conversation, and the
handover status — were made by the team; the AI was used as an assistant, not an authority.
