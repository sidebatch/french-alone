import { phrases, lessons } from './data.js';
export const STORAGE_KEY = 'bonjour-french-v1';
export const today = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const freshState = () => ({ version: 1, completed: [], mastered: [], favorites: [], mistakes: [], activity: {}, slow: false });
export function readState(storage) {
  try {
    const raw = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!raw || raw.version !== 1) return freshState();
    const state = freshState();
    const ids = new Set(phrases.map(p=>p.id));
    for (const key of ['mastered','favorites','mistakes']) state[key] = [...new Set(Array.isArray(raw[key]) ? raw[key].filter(id=>ids.has(id)) : [])];
    state.completed = [...new Set(Array.isArray(raw.completed) ? raw.completed.filter(id=>lessons.some(l=>l.id===id)) : [])];
    if (raw.activity && typeof raw.activity === 'object') for (const [date,value] of Object.entries(raw.activity)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(value?.xp) && value.xp >= 0) state.activity[date] = {xp:value.xp, words:Number.isFinite(value.words) ? Math.max(0,value.words) : 0};
    }
    state.slow = raw.slow === true;
    return state;
  } catch { return freshState(); }
}
export function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let i=result.length-1;i>0;i--) {const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export function makeQuestions(deck, random = Math.random) {
  return shuffle(deck,random).map(phrase=>({ phrase, choices:shuffle([phrase, ...shuffle(phrases.filter(p=>p.ko!==phrase.ko),random).slice(0,3)],random) }));
}
export function finishLesson(state, lessonId, answers, date=today()) {
  const deck = phrases.filter(p=>p.lessonId===lessonId);
  if (!deck.length || answers.length !== deck.length || new Set(answers.map(a=>a.id)).size !== deck.length || answers.some(a=>!deck.some(p=>p.id===a.id))) throw new Error('Incomplete lesson');
  const correct = answers.filter(a=>a.correct).map(a=>a.id);
  const wrong = answers.filter(a=>!a.correct).map(a=>a.id);
  const newlyLearned = correct.filter(id=>!state.mastered.includes(id));
  const first = !state.completed.includes(lessonId);
  const passed = correct.length >= Math.ceil(deck.length*0.7);
  const xp = newlyLearned.length*10 + (first && passed ? 20 : 0);
  state.mastered = [...new Set([...state.mastered,...correct])];
  state.mistakes = [...new Set([...state.mistakes.filter(id=>!correct.includes(id)),...wrong])];
  if (passed && first) state.completed.push(lessonId);
  const activity = state.activity[date] ||= {xp:0,words:0};
  activity.xp += xp; activity.words += newlyLearned.length;
  return {correct:correct.length,total:deck.length,passed,xp,first};
}
export function streak(state, date=new Date()) {
  const d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
  if (!state.activity[today(d)]) d.setDate(d.getDate()-1);
  let count=0;
  while (state.activity[today(d)]) {count++; d.setDate(d.getDate()-1);}
  return count;
}
export const totalXP = state => Object.values(state.activity).reduce((sum,item)=>sum+item.xp,0);
