# Changelog

## 1.5.0 — 2026-11-09

- Center home on Lou, one start action and five-question daily rounds; offer a three-question option and preserve all ten-question courses.
- Mix up to two due questions with new material in authored order. Previously credited questions become typing recall.
- Keep the answer input stable while checking, show compact bottom feedback and open explanations only on “왜?”. Offer word or letter cards after two unsuccessful typing attempts.
- Retry only assisted or incorrect questions immediately after a round. Report genuine recovery and new learning without awarding the same XP twice.
- Add one stamp per day after three completed questions. Lou's room gains a plant, books and a rug after one, three and seven stamped days.
- Preserve quick-round drafts, input formats, helper cards and existing progress. Migrate earlier practice days and guard completed rounds against replay.
- Include partially learned courses in progress filters and cache the new interface offline. No runtime AI calls or speech assessment.

## 1.4.0 — 2026-11-09

- Expand text practice to 9 courses / 90 questions in three units, adding standalone word typing, states, possession, destinations, ordering, needs and locations.
- Expand basic expressions to 12 lessons / 72 expressions and revise usage explanations across the existing lessons.
- Separate sentence practice and basic expressions; add unit/status filters, persistent course completion and compact home recommendations.
- Explain each answer with a specific note, sentence pattern and common pitfalls; recap assisted questions after a round, including resumed rounds.
- Add French accent keys with cursor insertion, card reset and token-aligned feedback for missing words and accents. Ignore unfinished IME composition.
- Count only full-sentence recall as independently written sentences. Preserve completion when older history rolls off, and recover malformed basic-quiz drafts safely.
- Keep all exercises local and available offline. No microphone, speech assessment, runtime AI generation or paid API is introduced.

## 1.3.1 — 2026-11-07

- Replace the initial vector cat with four consistent, soft 3D Lou poses: greeting, delight, thinking and celebration.
- Redesign home around a clear daily recommendation, one full-width start action, readable course rows and a weekly habit card backed by real progress.
- Unify typography, surfaces, touch controls and feedback across home, study, vocabulary, progress and settings.
- Replace the old Bonjour b mark with a French Alone f mark across the interface and install icons.
- Preserve audio controls, learning drafts and saved progress; cache the new mascot sheet and shared styling offline.

## 1.3.0 — 2026-11-07

- Add Lou, an inline vector cat companion, with a home greeting and distinct encouragement for correct answers, retries, reveals and completion.
- Replace quiet sine tones with layered phone-friendly chimes, separate outcome melodies and compression; wait for audio resumption before scheduling.
- Add a saved effect volume (80% by default), three sound previews and mute-aware controls while preserving existing progress and mute preferences.
- Enlarge mobile touch targets and hide the idle companion while typing; respect reduced motion.
- Cache the companion artwork and styles offline and verify audio scheduling, volume migration and outcome reactions.

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
