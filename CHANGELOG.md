# Changelog

## 1.2.1 — 2026-11-07

- Fit sentence practice to the visible viewport above the mobile keyboard, including browser panning and content-resize fallbacks.
- Keep the question and answer together when input focus automatically scrolls the practice body.
- Remove the repeated typing instructions and compact the focused header and controls.
- Add a dedicated round-completion screen with a short confetti animation, completion seal, actual results and earned XP.
- Respect reduced motion and the saved learning sound preference, and announce completion through focus.
- Preserve learning storage and duplicate-reward protection; cache the new viewport module for offline use.

## 1.2.0 — 2026-11-07

- Clarify lesson states (not started, in progress and completed), with per-lesson progress bars.
- Persist unfinished basic lessons and restore quiz state, question order and checked answer.
- Provide explicit right/wrong quiz feedback and explanations, with mistakes-only card review.
- Highlight mistyped tokens in sentence practice while hiding the answer until requested.
- Improve mobile input focus styling and compact keyboard-visible layouts.
- Add synthesized correct/wrong answer sounds with a saved toggle.
- Add phrase-detail dialog from vocabulary cards.
- Show version and © 2026 sidebatch across the interface.
- Preserve v1 localStorage keys and all existing practice drafts.
- Refresh PWA offline-cache version and assets.
