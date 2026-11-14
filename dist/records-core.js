import { today } from './core.js';

export function isRecordDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return year >= 1900 && today(new Date(year, month - 1, day, 12)) === value;
}
const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
export function shiftMonth(month, offset) {
  const [year, number] = month.split('-').map(Number);
  return today(new Date(year, number - 1 + offset, 1, 12)).slice(0, 7);
}
export function monthDates(month) {
  const [year, number] = month.split('-').map(Number);
  const first = new Date(year, number - 1, 1, 12);
  const offset = (first.getDay() + 6) % 7;
  const length = new Date(year, number, 0, 12).getDate();
  return Array.from({ length: Math.ceil((offset + length) / 7) * 7 }, (_, i) =>
    i < offset || i >= offset + length ? null : `${month}-${String(i - offset + 1).padStart(2, '0')}`);
}

// XP in activity already includes practice rewards. Never add practice XP again.
// Persistent day totals outlive the most recent 200 practice runs.
export function learningRecords(activity = {}, practiceDays = {}) {
  const records = {};
  for (const date of new Set([...Object.keys(activity), ...Object.keys(practiceDays)])) {
    if (!isRecordDate(date)) continue;
    const entry = activity[date], practice = practiceDays[date];
    const hasActivity = Number.isFinite(entry?.xp) && entry.xp >= 0;
    const practiceQuestions = count(practice?.questions), basicQuestions = count(entry?.basicQuestions);
    if (!hasActivity && !practiceQuestions && !basicQuestions) continue;
    records[date] = {
      date, xp: hasActivity ? entry.xp : 0,
      questions: practiceQuestions + basicQuestions, practiceQuestions, basicQuestions,
      rounds: count(practice?.rounds) + count(entry?.basicRounds),
      partial: hasActivity && (!Number.isSafeInteger(entry.basicQuestions) || entry.basicCountPartial === true),
      stamp: practiceQuestions >= 3
    };
  }
  return records;
}
export function recordSummary(records, date) {
  const record = records[date];
  if (!record) return null;
  const cursor = new Date(`${date}T12:00:00`);
  let streak = 0;
  while (records[today(cursor)]) { streak++; cursor.setDate(cursor.getDate() - 1); }
  const stamps = Object.values(records).filter(day => day.date <= date && day.stamp).length;
  return { ...record, streak, stamps };
}
export function monthSummary(records, month, until = today()) {
  const days = Object.values(records).filter(day => day.date.startsWith(`${month}-`) && day.date <= until);
  return { days: days.length, questions: days.reduce((sum, day) => sum + day.questions, 0),
    xp: days.reduce((sum, day) => sum + day.xp, 0), stamps: days.filter(day => day.stamp).length };
}
