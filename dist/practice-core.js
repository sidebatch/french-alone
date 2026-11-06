import { today } from './core.js';
import { practicePacks, practiceQuestions, questionById } from './practice-data.js';

export const PRACTICE_KEY = 'bonjour-practice-v1';
export const freshPractice = () => ({ version: 1, cards: {}, runs: [] });
export function normalizeAnswer(value) {
  return String(value).normalize('NFC').toLocaleLowerCase('fr').replace(/[’‘ʼ`]/g,"'")
    .replace(/[.!?…,;:]/g,'').replace(/\s*'\s*/g,"'").replace(/\s+/g,' ').trim();
}
export const isCorrect = (question, value) => [question.answer, ...(question.accepted || []), ...(question.cue?[question.full]:[])].some(answer => normalizeAnswer(answer) === normalizeAnswer(value));
const validDate = value => {
  if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y,m,d] = value.split('-').map(Number);return today(new Date(y,m-1,d,12)) === value;
};
export function addDays(date, days) {
  if(!validDate(date)) throw Error('Invalid practice date');
  const [y,m,d] = date.split('-').map(Number);const result = new Date(y,m-1,d,12);result.setDate(result.getDate()+days);return today(result);
}
export function readPractice(storage) {
  const state = freshPractice();
  try {
    const raw = JSON.parse(storage.getItem(PRACTICE_KEY));if(raw?.version !== 1) return state;
    for(const q of practiceQuestions) {
      const card = raw.cards?.[q.id];
      if(!card || !validDate(card.due) || !validDate(card.lastSeen)) continue;
      state.cards[q.id] = {
        due: card.due, lastSeen: card.lastSeen,
        strength: Number.isInteger(card.strength) ? Math.max(0,Math.min(4,card.strength)) : 0,
        seen: Number.isInteger(card.seen) ? Math.max(1,card.seen) : 1,
        credited: card.credited === true, independent: card.independent === true
      };
    }
    if(Array.isArray(raw.runs)) state.runs = raw.runs.filter(run => validDate(run?.date) &&
      (run.packId === 'review' || practicePacks.some(p=>p.id===run.packId)) &&
      Number.isInteger(run.total) && run.total > 0 && run.total <= 10 &&
      Number.isInteger(run.independent) && run.independent >= 0 && run.independent <= run.total &&
      Number.isInteger(run.correct) && run.correct >= 0 && run.correct <= run.total &&
      Number.isInteger(run.xp) && run.xp >= 0 && run.xp <= run.total*10)
      .slice(-200).map(run=>({date:run.date,packId:run.packId,total:run.total,independent:run.independent,correct:run.correct,xp:run.xp,transfer:run.transfer===true,continued:run.continued===true}));
  } catch { /* Keep the valid default when browser storage is unavailable or corrupt. */ }
  return state;
}
export function dueQuestions(state, date=today()) {
  return practiceQuestions.filter(q=>state.cards[q.id]?.due <= date)
    .sort((a,b)=>state.cards[a.id].due.localeCompare(state.cards[b.id].due)||state.cards[a.id].strength-state.cards[b.id].strength);
}
export function reviewDeck(state, date=today()) {
  return dueQuestions(state,date).slice(0,10).map(q=>({ ...q, kind:'input', phase:'다시 꺼내 보기', transfer:false, model:undefined, choices:undefined, tiles:undefined }));
}
export function nextPack(state, currentId) {
  if(currentId){const index=practicePacks.findIndex(p=>p.id===currentId);return practicePacks[(index+1)%practicePacks.length];}
  return practicePacks.find(pack=>!state.runs.some(run=>run.packId===pack.id)) || practicePacks[0];
}
export const independentSentences = state => [...new Set(practiceQuestions.filter(q=>state.cards[q.id]?.independent).map(q=>normalizeAnswer(q.full)))];
export function recordPractice(state, results, {packId, date=today(), continued=false}={}) {
  if(!validDate(date) || !results.length || results.length > 10 || (packId!=='review'&&results.length!==practicePacks.find(p=>p.id===packId)?.questions.length) || new Set(results.map(r=>r.id)).size !== results.length ||
    ![...practicePacks.map(p=>p.id),'review'].includes(packId) || results.some(r=>!questionById(r.id) || (packId!=='review' && questionById(r.id).packId!==packId))) throw Error('Invalid practice results');
  const before = new Set(independentSentences(state));
  const transfer=packId!=='review'&&results.some(r=>questionById(r.id).transfer&&!state.cards[r.id]&&r.correct&&r.independent);
  let xp=0,independent=0,correct=0;
  for(const result of results) {
    const q=questionById(result.id);
    const card=state.cards[q.id] ||= {strength:0,seen:0,credited:false,independent:false};
    const solo=result.correct===true && result.independent===true && (q.kind==='input' || packId==='review');
    if(result.correct===true) {correct++;if(!card.credited){xp+=5;card.credited=true;}}
    if(solo){independent++;if(!card.independent){xp+=5;card.independent=true;}card.strength=card.lastSeen===date?Math.max(1,card.strength):Math.min(4,card.strength+1);}
    else card.strength=0;
    card.seen++;card.lastSeen=date;card.due=addDays(date,solo?[1,1,3,7,14][card.strength]:1);
  }
  const summary={date,packId,total:results.length,correct,independent,xp,transfer,continued};
  state.runs.push(summary);state.runs=state.runs.slice(-200);
  return {...summary,newSentences:independentSentences(state).filter(sentence=>!before.has(sentence)).length};
}
