// Korean labels follow familiar course terminology; French labels also support lookup.
export const grammarTerms={
  '직접타동사':'verbe transitif direct','간접타동사':'verbe transitif indirect','서술어':'prédicat','명사문':'phrase nominale','부름말':'apostrophe','감탄사':'interjection','등위접속':'coordination','복문':'phrase complexe',
  '부정법 과거':'infinitif passé','동사원형 과거':'infinitif passé','명령법 과거':'impératif passé','복합분사':'participe composé','과거 제롱디프':'gérondif passé','이중복합시제':'temps surcomposé',
  '사역구문':'construction causative','지각동사':'verbe de perception','비인칭 동사':'verbe impersonnel','비인칭':'impersonnel','주어와 동사의 일치':'accord du verbe avec le sujet','과거분사 일치':'accord du participe passé',
  '부정형용사':'adjectif indéfini','기수':'nombre cardinal','서수':'nombre ordinal','분수':'fraction','합성명사':'nom composé','집합 명사':'nom collectif','명사화':'nominalisation','접두사':'préfixe','접미사':'suffixe',
  '동격':'apposition','선행사':'antécédent','보충절':'proposition complétive','분사절':'proposition participiale','원형절':'proposition infinitive','시간절':'subordonnée temporelle','허사 ne':'ne explétif',
  '자유간접화법':'discours indirect libre','감탄문':'phrase exclamative','강조구문':'mise en relief','등위접속사':'conjonction de coordination','모음 생략':'élision','연음':'liaison','유음 h':'h aspiré','무음 h':'h muet',
  '동명사':'gérondif','소유한정사':'déterminant possessif','지시한정사':'déterminant démonstratif','한정사':'déterminant',
  '무관사':'absence d’article','명사구':'groupe nominal','동사구':'groupe verbal','부사구':'groupe adverbial','전치사구':'groupe prépositionnel','형용사구':'groupe adjectival',
  '분사구문':'proposition participiale','간접의문문':'interrogation indirecte','간접의문':'interrogation indirecte','본질적 대명동사':'verbe essentiellement pronominal','복합시제':'temps composé','단순시제':'temps simple','인칭':'personne',
  '불규칙 동사':'verbe irrégulier','규칙동사':'verbe régulier','불규칙동사':'verbe irrégulier','본동사':'verbe principal','자동사':'verbe intransitif','타동사':'verbe transitif',
  '고유명사':'nom propre','보통명사':'nom commun','인칭대명사':'pronom personnel','주어 대명사':'pronom sujet',
  '활용':'conjugaison','어간':'radical','어미':'terminaison','품사':'classe de mots','문장 성분':'fonction grammaticale',
  '소유형용사':'adjectif possessif','지시형용사':'adjectif démonstratif','대명동사':'verbe pronominal','재귀대명사':'pronom réfléchi',
  '간접목적어 대명사':'pronom complément indirect','직접목적어 대명사':'pronom complément direct','목적어 대명사':'pronom complément',
  '간접목적어':'complément d’objet indirect, COI','직접목적어':'complément d’objet direct, COD','주격대명사':'pronom sujet','강세형 인칭대명사':'pronom personnel tonique',
  '소유대명사':'pronom possessif','지시대명사':'pronom démonstratif','복합관계대명사':'pronom relatif composé','관계대명사':'pronom relatif','부정대명사':'pronom indéfini',
  '의문형용사':'adjectif interrogatif','의문대명사':'pronom interrogatif','접속법 과거':'subjonctif passé','접속법 현재':'subjonctif présent','접속법':'subjonctif',
  '조건법 현재':'conditionnel présent','조건법 과거':'conditionnel passé','조건법':'conditionnel','직설법':'indicatif','명령법':'impératif',
  '접속법 반과거':'imparfait du subjonctif','접속법 대과거':'plus-que-parfait du subjonctif',
  '복합과거':'passé composé','반과거':'imparfait','대과거':'plus-que-parfait','단순과거':'passé simple','전과거':'passé antérieur',
  '단순미래':'futur simple','근접미래':'futur proche','최근과거':'passé récent','미래완료':'futur antérieur','현재형':'présent',
  '과거분사':'participe passé','현재분사':'participe présent','동사원형':'infinitif','원형':'infinitif','제롱디프':'gérondif','형용사적 분사':'adjectif verbal',
  '부정관사':'article indéfini','정관사':'article défini','부분관사':'article partitif','관사':'article','형용사':'adjectif','부사':'adverbe','전치사':'préposition',
  '대명사':'pronom','접속사':'conjonction','관계절':'proposition relative','주절':'proposition principale','종속절':'proposition subordonnée',
  '부정문':'phrase négative','의문문':'phrase interrogative','의문사':'mot interrogatif','비교급':'comparatif','최상급':'superlatif',
  '수동태':'voix passive','능동태':'voix active','간접화법':'discours indirect','직접화법':'discours direct','시제 일치':'concordance des temps',
  '성·수 일치':'accord en genre et en nombre','조동사':'auxiliaire','주어':'sujet','명사':'nom','동사':'verbe','목적어':'complément d’objet'
};
const pattern=new RegExp(Object.keys(grammarTerms).sort((a,b)=>b.length-a.length).join('|'),'g');
export function renderGrammarText(value,escape,seen=new Set()) {
  const safe=part=>escape(part).replace(/(^|[\s·→+])(-[a-zàâçéèêëîïôùûüœ]+)/gi,'$1<span class="grammar-affix" lang="fr">$2</span>');
  let result='',cursor=0;const text=String(value);
  for(const match of text.matchAll(pattern)){
    const term=match[0],fr=grammarTerms[term];result+=safe(text.slice(cursor,match.index))+escape(term);cursor=match.index+term.length;
    if(!seen.has(term)&&!text.slice(cursor).startsWith(' ('+fr)&&!text.slice(cursor).startsWith('('+fr))result+='<span class="grammar-term" lang="fr"> ('+escape(fr)+')</span>';
    seen.add(term);
  }
  return result+safe(text.slice(cursor));
}
export const existingArticleTerms={
  infinitive:'infinitif',negation:'négation',articles:'noms et articles',agreement:'accord de l’adjectif',places:'prépositions de lieu',requests:'conditionnel de politesse',need:'avoir besoin de',questions:'interrogation',
  'compound-past':'passé composé',participles:'participe passé','etre-past':'passé composé avec être','past-negation':'négation au passé composé',imparfait:'imparfait','past-contrast':'imparfait et passé composé',
  future:'futur simple',conditions:'si + présent',conditional:'conditionnel présent','object-pronouns':'pronoms compléments directs',y:'pronom y',en:'pronom en',relatives:'propositions relatives',comparison:'comparatif',connectors:'connecteurs logiques',opinion:'expression de l’opinion',subjunctive:'subjonctif présent'
};
