import {grammarArticles,grammarById} from './grammar-data.js';
import {miniLessons} from './practice-lessons.js';

export const GRAMMAR_KEY='bonjour-grammar-v1';
export const normalizeGrammar=value=>String(value).normalize('NFD').replace(/\p{Diacritic}/gu,'').normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const searchable=grammarArticles.map(article=>{
  const text=normalizeGrammar([article.title,article.fr,article.term,article.summary,...article.aliases,...article.sections.flatMap(section=>[section.title,...section.paragraphs||[],...section.table?.headers||[],...section.table?.rows.flat()||[],...section.examples?.flat()||[]]),...article.lessonIds.flatMap(id=>{const lesson=miniLessons[id];return [lesson.title,lesson.rule,...lesson.forms.flat(),lesson.example.fr,lesson.example.ko,lesson.caution];})].join(' '));
  return {article,title:normalizeGrammar(article.title),fr:normalizeGrammar(article.fr),term:normalizeGrammar(article.term||''),aliases:article.aliases.map(normalizeGrammar),text,words:new Set(text.split(/[^a-z]+/))};
});
export function searchGrammar(query='',category='all') {
  const q=normalizeGrammar(query),terms=q.split(' ').filter(Boolean);
  return searchable.filter(row=>(category==='all'||row.article.category===category)&&terms.every(term=>/^[a-z]{1,2}$/.test(term)?row.words.has(term):row.text.includes(term)))
    .map(row=>({article:row.article,score:!q?0:row.fr===q||row.term===q?100:row.aliases.includes(q)?90:row.title===q?85:row.title.includes(q)?70:row.aliases.some(alias=>alias.includes(q))||row.term.includes(q)?50:10}))
    .sort((a,b)=>b.score-a.score).map(row=>row.article);
}
export const freshGrammar=()=>({version:1,counts:{},seen:[]});
export function parseGrammar(raw) {
  const clean=freshGrammar();
  try {
    const value=JSON.parse(raw);
    if(value?.version!==1)return clean;
    for(const article of grammarArticles){const count=value.counts?.[article.id];if(Number.isSafeInteger(count)&&count>0)clean.counts[article.id]=count;}
    if(Array.isArray(value.seen))clean.seen=value.seen.filter(item=>grammarById(item?.id)&&typeof item.context==='string'&&item.context.length>0&&item.context.length<=220).slice(-512).map(({id,context})=>({id,context}));
  } catch { /* An unreadable record starts empty; learning records are separate. */ }
  return clean;
}
export function createGrammarStore(storage,onSaveError=()=>{}) {
  let state=freshGrammar(),failed=false;
  function reload(){if(!failed){try{state=parseGrammar(storage.getItem(GRAMMAR_KEY));}catch{ /* Keep this visit's record if storage is unavailable. */ }}return state;}
  function save(){try{storage.setItem(GRAMMAR_KEY,JSON.stringify(state));}catch{if(!failed)onSaveError();failed=true;}}
  reload();
  return {
    count:id=>state.counts[id]||0,
    open(id,context=''){
      if(!grammarById(id))return 0;
      reload();
      const key=typeof context==='string'?context.slice(0,220):'';
      if(key&&state.seen.some(item=>item.id===id&&item.context===key))return state.counts[id]||0;
      state.counts[id]=Math.min(Number.MAX_SAFE_INTEGER,(state.counts[id]||0)+1);
      if(key)state.seen=[...state.seen,{id,context:key}].slice(-512);
      save();return state.counts[id];
    },
    reload,
    reset(){state=freshGrammar();save();}
  };
}
