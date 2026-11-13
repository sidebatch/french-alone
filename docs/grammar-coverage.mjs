// Editorial crosswalk, not a copy of any book. Labels below are our Korean topic summaries.
// Units map the publicly visible contents, not every sentence/exercise inside the books.
const units=rows=>rows.map(([topic,...articles],index)=>({unit:index+1,topic,articles}));
export const grammarCoverage=[
 {id:'bescherelle-2024',title:'Bescherelle — La grammaire pour tous (2024)',
  url:'https://www.bescherelle.com/livre/bescherelle-la-grammaire-pour-tous-nouvelle-edition-9782401104778/',
  contents:'https://www.liseuse-hachette.fr/?ean=9782401110380',
  unitBasis:'공개 미리보기의 본문 소단원 39개. 서문·목차·색인·요약표 제외. 번호는 아래 대조표 내 순서.',
  units:units([
   ['단어','word-classes','word-formation'],['문장','sentence-elements','punctuation'],['발화','enunciation'],['글과 담화','cohesion','discourse-types'],
   ['주어 기능','subject-pronouns','subject-agreement'],['동사구','verb-construction','sentence-elements'],['상황 보충어','sentence-elements','spatial-prepositions','time-prepositions'],
   ['명사구 구조','noun-expansion'],['명사','gender-plural','compound-nouns'],['명사 한정','articles','partitive-articles','possessive-adjectives','demonstrative-adjectives','indefinite-words','numbers'],['명사 수식','noun-expansion','adjective-position','relative-meaning'],['분리된 수식','noun-expansion','participial-clauses'],
   ['동사 체계','verb-construction','present-regular','present-irregular','spelling-verbs'],['법과 시간','tense-map','aspect'],['비인칭 형태','infinitive','infinitive-past','gerund','present-participle','compound-participle'],['접속법','subjunctive','subjunctive-choice','past-subjunctive','literary-subjunctive'],['직설법','compound-past','imparfait','pluperfect','future','future-perfect','passe-simple-forms','anterior-past'],['조건법','conditional','conditional-past'],['명령법','imperative','past-imperative'],['동사·분사 일치','subject-agreement','participle-agreement'],['동사 구문','verb-construction','pronominal-verbs','causative','perception','impersonal'],['동사 목적어','verb-prepositions','object-pronouns','indirect-objects'],['속성 연결','sentence-elements','adjective-prepositions','presentatives'],['측정·필수 장소','sentence-elements','participle-agreement'],
   ['대명사 원리','word-classes','cohesion'],['인칭대명사','subject-pronouns','object-pronouns','indirect-objects','pronoun-order','stressed-pronouns'],['그 밖의 대명사','y','en','possessive-pronouns','demonstrative-pronouns','indefinite-words','relatives'],['형용사구','agreement','adjective-irregular','colors','adjective-prepositions'],['불변 품사','adverbs','spatial-prepositions','coordination','punctuation'],
   ['문장 유형','questions','inversion','exclamation-emphasis','imperative'],['문장 형태','negation','advanced-negation','passive','impersonal','exclamation-emphasis'],['제시·명사문·감탄·부름','presentatives','punctuation'],
   ['복문','coordination'],['보충절','completive','indirect-questions'],['관계절','relatives','relative-dont-ou','relative-compound','neutral-relatives','relative-meaning'],['상황 종속절','cause','consequence','purpose','opposition','concession','time-clauses','condition-connectors','quantity-comparison'],
   ['글의 응집','cohesion'],['발화의 표시','enunciation'],['말의 전달','reported-speech','discourse-types']
  ])},
 {id:'cle-intermediate',title:'Grammaire progressive du français — intermédiaire, 공개 학습 메뉴',
  url:'https://livre-web.cle-international.com/applis/9782090381030/audioexers/start.html',
  contents:'https://livre-web.cle-international.com/applis/9782090381030/audioexers/activities/menu.js',
  unitBasis:'공개 메뉴 1–36단원. 37번 점수 화면 제외.',
  units:units([
   ['être·전치사·주어','etre','subject-pronouns','spatial-prepositions'],['형용사 성','agreement','adjective-irregular'],['기초 부정·질문','negation','questions','advanced-negation'],['관사·축약','articles','partitive-articles','spatial-prepositions'],['대상 소개','presentatives'],['소유','possessive-adjectives','possessive-pronouns'],['지시','demonstrative-adjectives','demonstrative-pronouns'],['공간·나라','places','countries-prepositions','spatial-prepositions'],['avoir·몸 상태','avoir','avoir-states'],['형용사 위치','adjective-position','tout','ordinals-fractions'],['-er 현재·철자 변화','present-regular','spelling-verbs'],['수량','quantity','partitive-articles','article-omission'],['en','en'],['비교','comparison','quantity-comparison'],['y·en','y','en'],['다른 동사 현재','present-irregular','common-verb-contrasts','modal-verbs'],['대명동사','pronominal-verbs'],['목적어 대명사','object-pronouns','indirect-objects','pronoun-order'],['강세형','stressed-pronouns'],['명령','imperative','pronoun-order'],['조건법','conditional','requests'],['관계대명사','relatives','relative-dont-ou','relative-compound'],['의문사','interrogatives','inversion'],['확장 부정','negation','advanced-negation'],['간접 전달','reported-speech','indirect-questions'],['근접미래','future','aller'],['복합과거','compound-past','etre-past','participles','participle-agreement','past-negation'],['시간·기간','time-prepositions','dates-time'],['수동','passive'],['반과거','imparfait','past-contrast'],['대과거','pluperfect'],['과거 간접 전달','reported-speech','discourse-types'],['단순미래','future'],['가정','conditions','conditional-past','condition-connectors'],['접속법','subjunctive','subjunctive-choice'],['논리 연결','cause','concession','connectors']
  ])},
 {id:'ellipses-b2',title:'FLE — Objectif B2. Grammaire en contexte (2021)',
  url:'https://www.editions-ellipses.fr/fr/accueil/13825-fle-francais-langue-etrangere-objectif-b2-grammaire-en-contexte-pour-enrichir-et-consolider-ses-connaissances-titre-provisoire-9782340058255.html',
  contents:'https://www.editions-ellipses.fr/fr/index.php?controller=attachment&id_attachment=46618',
  unitBasis:'출판사 공개 목차의 문법 22단원. 연습문제·정답 제외.',
  units:units([
   ['부정','negation','advanced-negation'],['과거 시제','compound-past','imparfait','past-contrast','pluperfect','literary-past'],['미래 시제','future','future-perfect'],['시간과 기간','time-prepositions','time-clauses'],['목적어 대명사','object-pronouns','indirect-objects','y','en'],['대명사 조합','pronoun-order'],['관계대명사 기초','relatives','relative-dont-ou'],['관계대명사 확장','relative-compound','neutral-relatives','relative-meaning'],['부정대명사','indefinite-words','tout'],['수동','passive'],['분사·제롱디프','present-participle','gerund','compound-participle','participial-clauses'],['원형','infinitive','infinitive-past','verb-prepositions','perception','causative'],['조건법','conditional','conditional-past'],['가정','conditions','condition-connectors'],['접속법','subjunctive','subjunctive-choice','past-subjunctive'],['대조','opposition'],['양보','concession'],['원인','cause'],['결과','consequence'],['목적','purpose'],['담화 연결','cohesion','coordination','enunciation'],['간접화법','reported-speech','indirect-questions','discourse-types']
  ])}
];
