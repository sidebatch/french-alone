import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, finishLesson, readState } from '../dist/core.js';
import { phrases } from '../dist/data.js';
import { freshPractice, recordPractice, readPractice, dailyDeck } from '../dist/practice-core.js';
import { learningRecords, recordSummary, monthDates, monthSummary, shiftMonth } from '../dist/records-core.js';

test('legacy activity remains visible without inventing question counts or doubling practice XP', () => {
  const records = learningRecords({
    '2026-11-01': { xp: 70, words: 5 }, '2026-11-02': { xp: 25, words: 0 },
    '2026-02-30': { xp: 99 }, 'bad': { xp: 50 }
  }, { '2026-11-02': { questions: 5, rounds: 1 } });
  assert.equal(records['2026-11-01'].partial, true);
  assert.equal(records['2026-11-01'].questions, 0);
  assert.equal(records['2026-11-02'].questions, 5);
  assert.equal(records['2026-11-02'].xp, 25);
  assert.equal(Object.keys(records).length, 2);
  assert.deepEqual(monthSummary(records, '2026-11', '2026-11-13'), { days: 2, questions: 5, xp: 95, stamps: 1 });
});

test('new basic quizzes persist their real question counts, including zero-XP repeats', () => {
  let state = freshState();
  const answers = phrases.filter(p => p.lessonId === 'greetings').map(p => ({ id: p.id, correct: true }));
  finishLesson(state, 'greetings', answers, '2026-11-13');
  state = readState({ getItem: () => JSON.stringify(state) });
  const repeat = finishLesson(state, 'greetings', answers, '2026-11-13');
  assert.equal(repeat.xp, 0);
  state = readState({ getItem: () => JSON.stringify(state) });
  const day = learningRecords(state.activity, { '2026-11-13': { questions: 3, rounds: 1 } })['2026-11-13'];
  assert.equal(day.questions, 15); assert.equal(day.basicQuestions, 12);
  assert.equal(day.rounds, 3); assert.equal(day.partial, false); assert.equal(day.stamp, true);
  const basicOnly = learningRecords(state.activity)['2026-11-13'];
  assert.equal(basicOnly.stamp, false, 'basic quizzes do not change the practice stamp rule');
  state.activity['2026-11-12'] = { xp: 20, words: 2 };
  finishLesson(state, 'greetings', answers, '2026-11-12');
  assert.equal(learningRecords(readState({ getItem: () => JSON.stringify(state) }).activity)['2026-11-12'].partial, true);
});

test('calendar totals survive the recent-run limit and duplicate completion is not counted twice', () => {
  let practice = freshPractice();
  const date = '2026-11-13';
  const answers = dailyDeck(practice, date).map(q => ({ id: q.id, correct: true, independent: false }));
  recordPractice(practice, answers, { packId: 'daily', date, runId: 'saved' });
  recordPractice(practice, answers, { packId: 'daily', date, runId: 'saved' });
  practice.runs = [];
  practice = readPractice({ getItem: () => JSON.stringify(practice) });
  assert.equal(learningRecords({}, practice.days)[date].questions, 5);
  assert.equal(learningRecords({}, practice.days)[date].rounds, 1);
});

test('historical cards only include stamps and consecutive days earned by their date', () => {
  const records = learningRecords({
    '2026-11-01': { xp: 0, basicQuestions: 0 }, '2026-11-02': { xp: 0, basicQuestions: 0 },
    '2026-11-04': { xp: 0, basicQuestions: 0 }, '2026-12-01': { xp: 0, basicQuestions: 0 }
  }, {
    '2026-11-01': { questions: 3, rounds: 1 }, '2026-11-02': { questions: 3, rounds: 1 },
    '2026-11-04': { questions: 3, rounds: 1 }, '2026-12-01': { questions: 3, rounds: 1 }
  });
  assert.equal(recordSummary(records, '2026-11-02').stamps, 2);
  assert.equal(recordSummary(records, '2026-11-02').streak, 2);
  assert.equal(recordSummary(records, '2026-11-04').streak, 1);
  assert.equal(recordSummary(records, '2026-11-03'), null);
  assert.equal(monthSummary(records, '2026-11', '2026-11-02').days, 2);
});

test('month navigation handles leap years, Monday alignment, and December boundaries', () => {
  assert.equal(monthDates('2024-02').filter(Boolean).length, 29);
  assert.equal(monthDates('2025-02').filter(Boolean).length, 28);
  assert.deepEqual(monthDates('2026-11').slice(0, 7), [null, null, null, null, null, null, '2026-11-01']);
  assert.equal(monthDates('2026-11').length, 42);
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(shiftMonth('2026-01', -1), '2025-12');
});
