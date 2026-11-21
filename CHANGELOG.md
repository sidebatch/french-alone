# Changelog

## 1.22.0 — 2026-11-21

- Refine Lou and all 12 fitted outfits from one shared character reference, keeping four poses, existing item IDs, prices and ownership. Ship versioned transparent WebP sheets and thumbnails for offline use.
- Add soft contact shadows to accessories, lens highlights to round glasses, and shared dimensional lighting for room props, walls, floor and window. Certificate rendering uses the same assets.
- Present Lou in an atelier fitting stage with a larger optional view and a brief greeting. Hide the catalog during close inspection; preserve purchase rules, unsaved outfits, focus and saved poses when returning.
- Keep a single scrolling dialog and adapt compact screens. Verify 189 automated tests, 37 syntax checks, four browser viewport sizes, offline saved outfits and canvas room rendering.
- Document art prompts, asset locations and compatibility in [Lou's atelier](docs/lou-atelier-1.22.md).

## 1.21.0 — 2026-11-21

- Add optional automatic backup to one user-selected file. Reuse its file handle for updates, verify each completed write, and keep one previous record inside the same JSON document without producing numbered downloads.
- Read the connected file before initializing learning state. Recover missing local records, preserve newer local work after interrupted file saves, and require a choice when file and device histories diverge or an older file replaces the last saved one.
- Persist the selected handle and last verified state in IndexedDB. Check actual browser support and permission on launch, protect concurrent writes with Web Locks, and show explicit permission or write failures without discarding local progress.
- Keep existing manual backups compatible. Disconnect automatic backup before manual replacement or reset while retaining the external file. Keep the backup dialog to one scrolling body with fixed close controls.
- Verify 187 automated tests, 37 syntax checks and mobile-size browser flows using real file handles with a simulated native picker. Actual Android file selection and persistent permissions still require device verification.

## 1.20.0 — 2026-11-20

- Add device-only record inspection, automatic local snapshots and JSON backup export/import. Keep the existing five record keys and require a preview and explicit restore action before replacing progress. No account, record server or cloud transfer is added.
- Protect original records from fresh-state writes after read errors, malformed data or unsupported versions. Detect stale writers before saving, show storage failures, and preserve damaged raw values for export.
- Save a recovery copy before applying a backup. Roll back partial failures, preserve a journal if interrupted, and expose the pre-restore copy for inspection or undo. Reject unrelated or incomplete backup files without changing progress.
- Keep the latest complete snapshot and up to three daily first copies, reducing snapshot count under storage pressure. Offer persistent-storage requests where supported. Explain that local copies share browser storage and a separately saved file is needed after site-data deletion.
- Cache the new tools for offline use. Verify mobile-size file export, explicit reset and offline restore of all five records. The reported Android record loss remains unconfirmed on the affected device; this update cannot reconstruct records already erased without a surviving copy.

## 1.19.0 — 2026-11-20

- Add 210 authored follow-up exercises across all 21 courses, bringing the bank to 420 questions (180 beginner, 240 intermediate). Reuse learned patterns in new situations, with 147 additional full-sentence writing prompts, 42 blanks and 21 arrangements.
- Add five-question follow-up rounds from completed course cards and completion screens. Include follow-ups after their basic course in daily rounds, with existing due-review limits, hints, retries, XP and stamps.
- Connect every new prompt to a targeted learning goal, mini lesson and grammar reference. Register alternatives for time and conditional-clause placement, gender agreement, question word order and polite orders.
- Keep all original question IDs, completed basic courses and paused ten-question sessions. Save and restore each course's follow-up draft separately, validate round membership and guard replayed rewards.
- Cache the additional content for offline use. Verify 142 automated tests and complete all 210 follow-ups in Chrome, including narrow mobile layouts.

## 1.18.0 — 2026-11-18

- Wrap sentence answers as learners type. Preserve accent editing, drafts and Enter-to-check while protecting unfinished IME input.
- Widen vocabulary search and finish vocabulary and grammar searches with Enter. Add short reviews within each vocabulary topic and show flashcard usage notes on demand.
- Resume unfinished basic lessons from the home screen. Reveal a selected calendar day's details above the mobile navigation.
- Restore expanded placement controls and scroll position when continuing room decoration. Disable unavailable layering actions and explain purchases kept in a full room's inventory.

## 1.17.0 — 2026-11-17

- Start monthly calendars and weekly learning records on Sunday, including keyboard navigation.
- Keep typed answers, corrections and action buttons accessible when the mobile keyboard opens. Opening an explanation keeps focus on the explanation.
- Group vocabulary and grammar references by topic. Keep opened topics and focus when saving expressions, searching and returning from details.
- Bring course cards higher on the page with expandable filters. Compact calendar details, quiz feedback and certificate previews, with secondary statistics and sound controls available on demand.

## 1.16.0 — 2026-11-16

- Add seven outfits in all four poses, four eyewear designs and five beret accessories to Lou’s wardrobe. Mint cloud pajamas are free. The other pieces cost one to six study stamps.
- Browse six wearable pieces per page. Paging keeps the fitting-room preview, and equipped items can be removed at the mirror.

## 1.15.0 — 2026-11-16

- Keep the lesson start and room shortcuts within reach on the home screen. Give Lou’s room one scrolling surface on small screens, with six decorations per page and expandable placement controls.
- Show all five outfits fitted to Lou in each of the four poses. The wardrobe, home, practice and certificate use the same dressed artwork, including offline.

## 1.14.0 — 2026-11-16

- Add Lou’s wardrobe with three coat patterns, four selectable poses, five outfits, four glasses and five headpieces. Three starter pieces are free. Preview combinations, buy individual pieces with study stamps and save the look for home, practice and dated certificate images.
- Add six room decorations inspired by a bakery, a trip to Provence and an evening of stargazing.

## 1.13.1 — 2026-11-14

- Give learners a first attempt before showing the completed sentence on all 42 choice exercises. The goal, optional hint, and explicit answer reveal remain available.
- Remove answer words from the vocabulary notes beside fill-in prompts.

## 1.13.0 — 2026-11-14

- Show Lou’s short learning goal beside each of the 210 practice prompts, including daily rounds and review.
- Accept additional sentence orders and equivalent wording. Recognize selected natural alternatives to the requested structure and invite another try without marking a mistake.

## 1.12.1 — 2026-11-13

- Correct French grammar examples and Korean explanations in the reference library, exercise feedback and phrase cards. Clarify pronoun roles, agreement, verb forms and time expressions.
- Align the first-person forms in future and conditional tables with each verb. Accept both clause orders and previous model answers for the revised writing exercises.

## 1.12.0 — 2026-11-13 (published on GitHub Pages)

- Add 27 room decorations, stamp purchases, reusable copies, a saved wish list and a room editor with drag/touch/keyboard movement, scaling, rotation, flipping, ordering, wall colors and floor styles.
- Award room currency at 3, 10 and 20 completed practice questions per day, up to three stamps; include legacy days and keep the existing 1/3/7-day gifts. Spending never reduces learning achievements or XP.
- Save the decorated room in the home view and certificate, preserving dated arrangements for past cards. Remove cumulative stamps from certificates and shorten the reward to “+20 XP / 경험치”.
- Verify 121 tests, responsive editor layouts, browser purchases, touch dragging, real PNG export and offline shopping. Keep purchases when cancelling layout changes and report storage failures without claiming a successful save.

## 1.11.0 — 2026-11-13 (included in the 1.12.0 release)

- Add a monthly learning calendar with daily detail, real completed-question totals, XP and stamps. Preserve historical records without inferring missing basic-quiz counts from XP.
- Create 1080×1350 PNG learning cards with the selected date, results and Lou's room as earned by that date. Open from home, completion screens or the calendar; download or explicitly share on supported devices.
- Preserve the completion screen and focus when closing a card. Support offline generation, keyboard calendar navigation, export errors and native-share cancellation. Validate all existing features plus ten new record tests and browser flows.

## 1.7.0 — 2026-11-12

- Audit all 210 exercises and replace course-wide “Learn more” text with explicit question-specific lessons. Add 114 short lessons with form tables, translated examples and common confusions.
- Separate irregular participles, auxiliary negation and agreement; provide targeted word, conjugation, pronoun, relative-clause, comparison and subjunctive explanations.
- Review all 72 basic expressions, remove unrelated course tips from individual explanations, and expand number and café usage notes.
- Keep explanations collapsed, preserve question IDs and grading, and cache all lessons offline. Record the complete content inventory and QA scope in `docs/content-audit-1.7.md`.

## 1.6.0 — 2026-11-12

- Add 12 intermediate courses / 120 exercises: past events, movement and agreement, past background, future plans, real and imagined conditions, object pronouns, y/en, relative clauses, comparisons, opinions and the present subjunctive.
- Offer beginner/intermediate selection on home and in the course library. Start intermediate practice immediately without completing beginner courses first.
- Scope daily rounds, review and recommendations to the selected level; save its preference and keep separate short-round, review and retry drafts.
- Preserve the existing 90 beginner exercises and their IDs, progress and XP. Keep explanations collapsed and all new content available offline without AI calls or speech assessment.

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
