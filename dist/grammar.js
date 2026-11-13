import {grammarArticles,grammarCategories,grammarById} from './grammar-data.js';
import {GRAMMAR_KEY,createGrammarStore,searchGrammar} from './grammar-core.js';

export function createGrammar({storage,icon,escape,onSaveError=()=>{}}) {
  const doc=document,win=window,dialog=doc.querySelector('#grammar-dialog');
  const store=createGrammarStore(storage,onSaveError);
  let query='',category='all',returnPoint=null;
  const eye=(id)=>'<span class="grammar-views" data-grammar-count="'+id+'" aria-label="내가 본 횟수 '+store.count(id)+'회">'+icon('eye')+'<span>'+store.count(id)+'</span></span>';
  const filters=()=>[{id:'all',title:'전체'},...grammarCategories].map(item=>'<button type="button" class="filter-button '+(category===item.id?'active':'')+'" data-action="grammar-filter" data-value="'+item.id+'" aria-pressed="'+(category===item.id)+'">'+item.title+'</button>').join('');
  function results() {
    const articles=searchGrammar(query,category);
    if(!articles.length)return '<div class="empty-state"><h2>검색 결과가 없어요</h2><button class="secondary-button" data-action="grammar-clear">검색 초기화</button></div>';
    const list=items=>'<div class="grammar-list">'+items.map(article=>'<button type="button" class="grammar-entry" data-action="grammar-open" data-id="'+article.id+'"><span class="grammar-entry-copy"><strong>'+escape(article.title)+'</strong><span lang="fr">'+escape(article.fr)+'</span></span>'+eye(article.id)+icon('chevron')+'</button>').join('')+'</div>';
    return query.trim()?list(articles):grammarCategories.filter(group=>articles.some(article=>article.category===group.id)).map(group=>'<section class="grammar-group"><h2>'+group.title+'</h2>'+list(articles.filter(article=>article.category===group.id))+'</section>').join('');
  }
  function renderLibrary(){
    store.reload();
    return '<div class="page-heading"><h1>문법</h1><span class="section-count">'+grammarArticles.length+'개 항목</span></div><div class="search-box grammar-search">'+icon('search')+'<label class="visually-hidden" for="grammar-search">문법 검색</label><input id="grammar-search" type="search" placeholder="문법, 단어, 활용형 검색" value="'+escape(query)+'" autocomplete="off"><button type="button" class="search-clear" data-action="grammar-clear" aria-label="검색어 지우기" '+(query?'':'hidden')+'>'+icon('close')+'</button></div><div class="grammar-filters filter-row" role="group" aria-label="문법 분류">'+filters()+'</div><div class="search-result-count" id="grammar-result-count" role="status">'+searchGrammar(query,category).length+'개 항목</div><div id="grammar-results">'+results()+'</div>';
  }
  function refreshResults(){
    const target=doc.querySelector('#grammar-results');if(!target)return;
    target.innerHTML=results();doc.querySelector('#grammar-result-count').textContent=searchGrammar(query,category).length+'개 항목';
    doc.querySelector('.grammar-search .search-clear').hidden=!query;
    doc.querySelectorAll('[data-action="grammar-filter"]').forEach(button=>{button.classList.toggle('active',category===button.dataset.value);button.setAttribute('aria-pressed',String(category===button.dataset.value));});
  }
  function refreshCounts(){doc.querySelectorAll('[data-grammar-count]').forEach(node=>{const count=store.count(node.dataset.grammarCount);node.setAttribute('aria-label','내가 본 횟수 '+count+'회');node.querySelector('span').textContent=count;});}
  function articleHTML(article){
    return '<p class="grammar-intro">'+escape(article.summary)+'</p>'+article.sections.map(section=>'<section class="grammar-section"><h3>'+escape(section.title)+'</h3>'+(section.paragraphs||[]).map(text=>'<p>'+escape(text)+'</p>').join('')+(section.table?'<table class="grammar-table"><caption class="visually-hidden">'+escape(section.title)+'</caption><thead><tr>'+section.table.headers.map(header=>'<th scope="col">'+escape(header)+'</th>').join('')+'</tr></thead><tbody>'+section.table.rows.map(row=>'<tr>'+row.map((cell,index)=>index===0?'<th scope="row">'+escape(cell)+'</th>':'<td lang="fr">'+escape(cell)+'</td>').join('')+'</tr>').join('')+'</tbody></table>':'')+(section.examples?.length?'<div class="grammar-examples">'+section.examples.map(([fr,ko])=>'<div><p lang="fr">'+escape(fr)+'</p><p>'+escape(ko)+'</p></div>').join('')+'</div>':'')+'</section>').join('');
  }
  function open(id,{context='',opener=doc.activeElement}={}) {
    const article=grammarById(id);if(!article||dialog.open)return;
    const study=doc.querySelector('#study-dialog'),body=study?.querySelector('.dialog-body');
    returnPoint={opener,body,bodyScroll:body?.scrollTop||0,study,studyScroll:study?.scrollTop||0,x:win.scrollX,y:win.scrollY};
    dialog.innerHTML='<header class="grammar-header"><div><p lang="fr">'+escape(article.fr)+'</p><h2 id="grammar-title" tabindex="-1">'+escape(article.title)+'</h2></div><button type="button" class="icon-button" data-action="grammar-close" aria-label="문법 닫기">'+icon('close')+'</button></header><div class="grammar-reader" tabindex="0" aria-label="문법 내용">'+articleHTML(article)+'</div>';
    dialog.dataset.grammarArticle=id;dialog.showModal();store.open(id,context);
    dialog.querySelector('.grammar-header>div').insertAdjacentHTML('beforeend',eye(id));refreshCounts();
    dialog.querySelector('.grammar-reader').scrollTop=0;dialog.querySelector('#grammar-title').focus({preventScroll:true});
  }
  function close(restore=true){
    if(!dialog.open)return;
    const notice=dialog.querySelector('#toast');if(notice)doc.body.append(notice);
    const point=returnPoint;returnPoint=null;dialog.close();delete dialog.dataset.grammarArticle;
    if(restore&&point){
      if(point.opener?.isConnected)point.opener.focus({preventScroll:true});
      if(point.body?.isConnected)point.body.scrollTop=point.bodyScroll;
      if(point.study?.isConnected)point.study.scrollTop=point.studyScroll;
      win.scrollTo({left:point.x,top:point.y,behavior:'instant'});
    }
  }
  doc.addEventListener('click',event=>{
    const button=event.target.closest('[data-action]');if(!button)return;
    switch(button.dataset.action){
      case 'grammar-open':open(button.dataset.id,{opener:button});break;
      case 'grammar-close':close();break;
      case 'grammar-filter':category=button.dataset.value;refreshResults();break;
      case 'grammar-clear':query='';category='all';doc.querySelector('#grammar-search').value='';refreshResults();doc.querySelector('#grammar-search').focus();break;
    }
  });
  doc.addEventListener('input',event=>{if(event.target.id==='grammar-search'){query=event.target.value;refreshResults();}});
  dialog.addEventListener('cancel',event=>{event.preventDefault();event.stopPropagation();close();});
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const first=dialog.querySelector('[data-action="grammar-close"]'),last=dialog.querySelector('.grammar-reader');
    if(event.shiftKey&&(doc.activeElement===first||doc.activeElement.id==='grammar-title')){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus();}
  });
  win.addEventListener('storage',event=>{if(event.key===GRAMMAR_KEY||event.key===null){store.reload();refreshCounts();}});
  return {key:GRAMMAR_KEY,open,close,isOpen:()=>dialog.open,renderLibrary,reload:()=>{store.reload();refreshCounts();},reset:()=>{store.reset();query='';category='all';refreshCounts();}};
}
