import { today } from './core.js';
import { practicePacks, practiceQuestions, questionById } from './practice-data.js';
import { alternativeForQuestion } from './practice-goals.js';

export const PRACTICE_KEY = 'bonjour-practice-v1';
export const PRACTICE_DRAFT_KEY = 'bonjour-practice-drafts-v1';
export const ROUND_SIZES = {daily:5,light:3,'daily-intermediate':5,'light-intermediate':3};
export const QUICK_MODES = [...Object.keys(ROUND_SIZES),'review-intermediate','retry','retry-intermediate'];
export const isRecallRound = id => ['review','review-intermediate','retry','retry-intermediate'].includes(id);
export const roundLevel = id => id.endsWith('-intermediate')?'intermediate':'beginner';
export const freshPractice = () => ({ version: 1, level:'beginner', cards: {}, runs: [], completed: [], days: {} });
export function normalizeAnswer(value) {
  return String(value).normalize('NFC').toLocaleLowerCase('fr').replace(/[’‘ʼ`]/g,"'")
    .replace(/[.!?…,;:]/g,'').replace(/\s*'\s*/g,"'").replace(/\s+/g,' ').trim();
}
const answersFor = q => [q.answer, ...(q.accepted || []), ...(q.cue ? [q.full] : [])];
export const isCorrect = (q, value) => answersFor(q).some(answer => normalizeAnswer(answer) === normalizeAnswer(value));
export function alternativeFeedback(q, value) {
  const entry = alternativeForQuestion(q.id);
  if (!entry || !value) return '';
  const attempt = normalizeAnswer(value);
  return entry.forms.some(form => normalizeAnswer(form) === attempt) ? entry.feedback : '';
}
export const asRecall = q => ({...q,kind:'input',phase:'기억 꺼내기',transfer:false,model:undefined,choices:undefined,tiles:undefined});
export function supportTiles(q) {
  const answer=q.answer.replace(/[.!?]+$/g,'').trim();
  const words=answer.split(/\s+/);
  return {tiles:words.length>1?words:Array.from(answer),joiner:words.length>1?' ':''};
}
export function dailyDeck(state, date=today(), size=5, level=state.level||'beginner') {
  const pool=practiceQuestions.filter(q=>q.level===level);
  const unseen=pool.filter(q=>!state.cards[q.id]);
  const due=dueQuestions(state,date,level);
  const selected=due.slice(0,unseen.length?Math.min(2,size-1):size);
  selected.push(...unseen.slice(0,size-selected.length));
  const known=pool.filter(q=>state.cards[q.id]&&!selected.some(item=>item.id===q.id))
    .sort((a,b)=>state.cards[a.id].due.localeCompare(state.cards[b.id].due)||state.cards[a.id].strength-state.cards[b.id].strength);
  selected.push(...known.slice(0,size-selected.length));
  return selected.map(q=>state.cards[q.id]?.credited?asRecall(q):({...q,transfer:q.transfer===true&&!state.cards[q.id]}));
}
export const dailyProgress = (state,date=today()) => ({questions:state.days[date]?.questions||0,rounds:state.days[date]?.rounds||0,days:Object.values(state.days).filter(day=>day.questions>=3).length});
// Align tokens against the nearest accepted answer. Missing words get their own
// marker instead of incorrectly marking every subsequent word as a typo.
export function answerFeedback(question, value) {
  const attempt = String(value).trim().split(/\s+/).filter(Boolean);
  const candidates = answersFor(question);
  const compared = candidates.map(answer => {
    const expected = answer.trim().split(/\s+/).filter(word => normalizeAnswer(word));
    const actual = attempt.filter(word => normalizeAnswer(word));
    const costs = Array.from({length: actual.length + 1}, () => Array(expected.length + 1).fill(0));
    for(let i=0;i<=actual.length;i++)costs[i][0]=i;
    for(let j=0;j<=expected.length;j++)costs[0][j]=j;
    for(let i=1;i<=actual.length;i++)for(let j=1;j<=expected.length;j++) {
      costs[i][j]=Math.min(costs[i-1][j]+1,costs[i][j-1]+1,costs[i-1][j-1]+(normalizeAnswer(actual[i-1])===normalizeAnswer(expected[j-1])?0:1));
    }
    const tokens=[];let i=actual.length,j=expected.length;
    while(i||j) {
      if(i&&j&&normalizeAnswer(actual[i-1])===normalizeAnswer(expected[j-1])) {tokens.unshift({text:actual[--i],kind:'ok'});j--;}
      else if(j&&costs[i][j]===costs[i][j-1]+1){tokens.unshift({text:'빠진 단어',kind:'missing'});j--;}
      else if(i&&j&&costs[i][j]===costs[i-1][j-1]+1){tokens.unshift({text:actual[--i],kind:'change'});j--;}
      else {tokens.unshift({text:actual[--i],kind:'extra'});}
    }
    const strip = text => normalizeAnswer(text).normalize('NFD').replace(/\p{Diacritic}/gu,'');
    return {tokens,cost:costs[actual.length][expected.length],accentOnly:strip(value)===strip(answer)};
  });
  return compared.sort((a,b)=>a.cost-b.cost)[0];
}
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
    state.level=raw.level==='intermediate'?'intermediate':'beginner';
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
      (run.packId === 'review' || QUICK_MODES.includes(run.packId) || practicePacks.some(p=>p.id===run.packId)) &&
      Number.isInteger(run.total) && run.total > 0 && run.total <= 10 &&
      Number.isInteger(run.independent) && run.independent >= 0 && run.independent <= run.total &&
      Number.isInteger(run.correct) && run.correct >= 0 && run.correct <= run.total &&
      Number.isInteger(run.xp) && run.xp >= 0 && run.xp <= run.total*10)
      .slice(-200).map(run=>({date:run.date,packId:run.packId,total:run.total,independent:run.independent,correct:run.correct,xp:run.xp,transfer:run.transfer===true,continued:run.continued===true,...(typeof run.runId==='string'?{runId:run.runId.slice(0,80)}:{})}));
    state.completed = [...new Set([
      ...(Array.isArray(raw.completed) ? raw.completed.filter(id=>practicePacks.some(pack=>pack.id===id)) : []),
      ...state.runs.filter(run=>practicePacks.some(pack=>pack.id===run.packId)).map(run=>run.packId),
      ...practicePacks.filter(pack=>pack.questions.every(q=>state.cards[q.id])).map(pack=>pack.id)
    ])];
    if(raw.days&&typeof raw.days==='object')for(const [date,day] of Object.entries(raw.days)) {
      if(validDate(date)&&Number.isInteger(day?.questions)&&day.questions>0&&Number.isInteger(day?.rounds)&&day.rounds>0)state.days[date]={questions:day.questions,rounds:day.rounds};
    }
    // Old installations already have real completed rounds; keep those days.
    for(const date of new Set(state.runs.map(run=>run.date)))if(!state.days[date]) {
      const runs=state.runs.filter(run=>run.date===date);
      state.days[date]={questions:runs.reduce((sum,run)=>sum+run.total,0),rounds:runs.length};
    }
  } catch { /* Keep the valid default when browser storage is unavailable or corrupt. */ }
  return state;
}
export function dueQuestions(state, date=today(), level) {
  return practiceQuestions.filter(q=>(!level||q.level===level)&&state.cards[q.id]?.due <= date)
    .sort((a,b)=>state.cards[a.id].due.localeCompare(state.cards[b.id].due)||state.cards[a.id].strength-state.cards[b.id].strength);
}
export function reviewDeck(state, date=today(), level) {
  return dueQuestions(state,date,level).slice(0,10).map(q=>({ ...q, kind:'input', phase:'다시 꺼내 보기', transfer:false, model:undefined, choices:undefined, tiles:undefined }));
}
export function nextPack(state, currentId) {
  const level=practicePacks.find(p=>p.id===currentId)?.level||state.level||'beginner';
  const packs=practicePacks.filter(p=>p.level===level);
  if(currentId){const index=packs.findIndex(p=>p.id===currentId);if(index>=0)return packs[(index+1)%packs.length];}
  return packs.find(pack=>!state.completed.includes(pack.id)) || packs[0];
}

export function readPracticeDrafts(storage) {
  const drafts={};
  try {
    const raw=JSON.parse(storage.getItem(PRACTICE_DRAFT_KEY));if(raw?.version!==1)return drafts;
    for(const packId of [...practicePacks.map(pack=>pack.id),'review',...QUICK_MODES]) {
      const item=raw.sessions?.[packId];if(!item||item.packId!==packId)continue;
      const pack=practicePacks.find(p=>p.id===packId);
      const ids=item.questionIds;
      if(!Array.isArray(ids)||!ids.length||ids.length>10||new Set(ids).size!==ids.length||ids.some(id=>!questionById(id)))continue;
      if(pack&&(ids.length!==pack.questions.length||ids.some((id,i)=>id!==pack.questions[i].id)))continue;
      if(ROUND_SIZES[packId]&&(ids.length!==ROUND_SIZES[packId]||ids.some(id=>questionById(id).level!==roundLevel(packId))))continue;
      if(!Number.isInteger(item.index)||item.index<0||item.index>=ids.length||!Array.isArray(item.results)||item.results.length!==item.index)continue;
      if(item.results.some((r,i)=>r?.id!==ids[i]||typeof r.correct!=='boolean'||typeof r.independent!=='boolean'||r.independent&&!r.correct))continue;
      const formats=ids.map((id,i)=>isRecallRound(packId)?'input':QUICK_MODES.includes(packId)&&item.formats?.[i]==='input'?'input':questionById(id).kind);
      const original=questionById(ids[item.index]);
      const q=formats[item.index]==='input'?{...original,kind:'input',tiles:undefined,choices:undefined}:original;
      const current=item.current||{};
      const supported=q.kind==='input'&&current.supported===true;
      const expected=supported?supportTiles(q).tiles:q.tiles||[];
      const sameTiles=Array.isArray(current.tiles)&&[...expected].sort().join('\0')===[...current.tiles].sort().join('\0');
      const tiles=sameTiles?[...current.tiles]:[...expected];
      const selected=sameTiles&&Array.isArray(current.selected)?[...new Set(current.selected.filter(i=>Number.isInteger(i)&&i>=0&&i<tiles.length))]:[];
      const draft=typeof current.draft==='string'?current.draft.slice(0,180):'';
      const choice=q.choices?.includes(current.choice)?current.choice:null;
      let status=['idle','wrong','alternative','correct','revealed'].includes(current.status)?current.status:'idle';
      const value=supported?selected.map(i=>tiles[i]).join(supportTiles(q).joiner):q.kind==='choice'?choice:q.kind==='order'?selected.map(i=>tiles[i]).join(' '):draft;
      if(status==='correct'&&!isCorrect(q,value||''))status='idle';
      if(status==='alternative'&&!alternativeFeedback(q,value))status='idle';
      drafts[packId]={packId,questionIds:[...ids],formats,index:item.index,...(typeof item.runId==='string'?{runId:item.runId.slice(0,80)}:{}),
        results:item.results.map((r,i)=>({id:r.id,correct:r.correct,independent:r.independent&&formats[i]==='input',needsReview:r.needsReview===true||!r.correct})),
        continued:item.continued===true,updatedAt:Number.isFinite(item.updatedAt)?item.updatedAt:0,
        current:{draft,choice,tiles,selected,status,supported,errors:Number.isInteger(current.errors)?Math.max(0,Math.min(20,current.errors)):status==='wrong'?1:0,hints:Math.min(2,Math.max(status==='revealed'?2:supported?1:0,Number.isInteger(current.hints)?current.hints:0)),hadError:current.hadError===true||status==='wrong'||supported}
      };
    }
  } catch { /* An invalid paused session must never block the learning screen. */ }
  return drafts;
}
export const independentSentences = state => [...new Set(practiceQuestions.filter(q=>!q.cue&&!q.model&&q.mode!=='word'&&state.cards[q.id]?.independent).map(q=>normalizeAnswer(q.full)))];
export function recordPractice(state, results, {packId, date=today(), continued=false,runId}={}) {
  const special=packId==='review'||QUICK_MODES.includes(packId);
  if(!validDate(date) || !results.length || results.length > 10 || (!special&&results.length!==practicePacks.find(p=>p.id===packId)?.questions.length) || (ROUND_SIZES[packId]&&(results.length!==ROUND_SIZES[packId]||results.some(r=>questionById(r.id)?.level!==roundLevel(packId))))||new Set(results.map(r=>r.id)).size !== results.length ||
    ![...practicePacks.map(p=>p.id),'review',...QUICK_MODES].includes(packId) || results.some(r=>!questionById(r.id) || (!special && questionById(r.id).packId!==packId))) throw Error('Invalid practice results');
  if(runId&&state.runs.some(run=>run.runId===runId))return {...state.runs.find(run=>run.runId===runId),xp:0,newSentences:0,recovered:0,newQuestions:0,duplicate:true};
  const before = new Set(independentSentences(state));
  const transfer=!isRecallRound(packId)&&results.some(r=>questionById(r.id).transfer&&!state.cards[r.id]&&r.correct&&r.independent);
  const newQuestions=results.filter(r=>!state.cards[r.id]).length;
  let xp=0,independent=0,correct=0,recovered=0;
  for(const result of results) {
    const q=questionById(result.id);
    const card=state.cards[q.id] ||= {strength:0,seen:0,credited:false,independent:false};
    const solo=result.correct===true && result.independent===true && (q.kind==='input' || special);
    if(solo&&card.seen>0&&card.strength===0)recovered++;
    if(result.correct===true) {correct++;if(!card.credited){xp+=5;card.credited=true;}}
    if(solo){independent++;if(!card.independent){xp+=5;card.independent=true;}card.strength=card.lastSeen===date?Math.max(1,card.strength):Math.min(4,card.strength+1);}
    else card.strength=0;
    card.seen++;card.lastSeen=date;card.due=addDays(date,solo?[1,1,3,7,14][card.strength]:1);
  }
  const summary={date,packId,total:results.length,correct,independent,xp,transfer,continued,...(runId?{runId}: {})};
  state.runs.push(summary);state.runs=state.runs.slice(-200);
  for(const pack of practicePacks)if(!state.completed.includes(pack.id)&&pack.questions.every(q=>state.cards[q.id]))state.completed.push(pack.id);
  const day=state.days[date]||={questions:0,rounds:0};day.questions+=results.length;day.rounds++;
  return {...summary,recovered,newQuestions,newSentences:independentSentences(state).filter(sentence=>!before.has(sentence)).length};
}
