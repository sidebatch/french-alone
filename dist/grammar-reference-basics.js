// Original Korean reference lessons. Editorial scope and sources: docs/grammar-library-1.10.md.
const S=(title,text,examples=[])=>({title,paragraphs:Array.isArray(text)?text:[text],examples});
const T=(title,rows)=>({title,table:{headers:['형태·구분','규칙·예'],rows}});
const A=(id,title,term,summary,aliases,sections)=>({id,category:'basics',title,fr:term,term,summary,aliases,lessonIds:[],sections});
export const referenceBasics=[
 A('sentence-elements','문장 성분과 기본 어순','fonctions dans la phrase','단어의 종류와 문장에서 맡는 역할을 구분해요.',['문장 성분','서술어','보어','보충어','sujet','attribut','complément circonstanciel'],[
  S('품사와 역할은 달라요','명사라는 품사는 같아도 문장에서는 주어·목적어 등 다른 역할을 할 수 있어요. 기본 서술문은 주어 + 동사 + 필요한 보충어 순서예요.',[['Lina lit un roman.','리나는 소설을 읽어. (Lina: 주어, un roman: 직접목적어)']]),
  T('핵심 역할',[['주어 · sujet','Lina dort. → 누가 자는지'],['직접목적어 · COD','Elle lit ce livre. → 전치사 없이 동사에 연결'],['간접목적어 · COI','Elle parle à Paul. → 동사가 요구하는 전치사로 연결'],['주어의 속성 · attribut du sujet','Elle semble fatiguée. → 주어의 상태'],['상황 보충어 · complément circonstanciel','Demain, elle partira. → 시간·장소·이유 등']]),
  S('옮기거나 빼 볼 때','상황 보충어는 대체로 이동·생략이 가능하지만 뜻과 강조가 달라져요. 동사가 요구하는 목적어나 장소는 마음대로 빼면 뜻이 불완전해질 수 있어요. Elle habite à Lyon의 장소와 Ce sac pèse dix kilos의 무게는 동사에 밀접한 보충어예요.',[['À Lyon, elle travaille beaucoup.','리옹에서 그녀는 일을 많이 해.'],['Elle habite à Lyon.','그녀는 리옹에 살아.']]),
  S('목적어의 속성','trouver·rendre·nommer 뒤에서는 목적어를 설명하는 말도 올 수 있어요. 형용사는 그 목적어의 성·수에 맞춰요.',[['Je trouve ces idées utiles.','나는 이 생각들이 유용하다고 봐.'],['Cette nouvelle la rend heureuse.','이 소식은 그녀를 행복하게 해.']])]),
 A('subject-pronouns','주어 대명사와 on','pronoms sujets et on','말하는 사람과 대상을 정하고 동사를 맞춰요.',['je','tu','il','elle','nous','vous','ils','elles','on','주격대명사'],[
  T('여섯 인칭',[['1인칭 단수','je / j’ · 나'],['2인칭 단수','tu · 너'],['3인칭 단수','il / elle / on'],['1인칭 복수','nous · 우리'],['2인칭 복수·존칭','vous · 너희 / 당신'],['3인칭 복수','ils / elles · 그들 / 그녀들']]),
  S('주어는 보통 생략하지 않아요','일반 문장에서는 활용된 동사 앞에 주어가 필요해요. 명령문에서는 생략해요. il은 남성 명사, elle은 여성 명사도 받으므로 사람만 가리키지 않아요.',[['La porte est ouverte. Elle est lourde.','문이 열려 있어. 그 문은 무거워.'],['Viens !','와!']]),
  S('on의 두 쓰임','on은 불특정한 사람을 뜻하거나 일상 대화에서 nous를 대신해요. 어느 뜻이든 동사는 3인칭 단수예요. 특정한 우리를 뜻하면 형용사·être와 쓰는 과거분사는 실제 사람들의 성·수에 맞출 수 있어요.',[['On parle français ici.','여기서는 프랑스어를 써.'],['On est arrivées.','우리 도착했어. (여성 여러 명)']]),
  S('tu와 vous','vous는 여러 명에게 말할 때도, 한 사람을 정중하게 부를 때도 써요. 한 사람에게 쓰면 동사는 vous형이지만 그 사람을 꾸미는 말은 단수예요.',[['Madame, vous êtes prête ?','선생님, 준비되셨어요?']])]),
 A('noun-expansion','명사구와 명사 수식','groupe nominal et expansions du nom','명사를 중심으로 정보를 덧붙이는 방법이에요.',['명사구','동격','apposition','complément du nom','épithète'],[
  S('중심 명사 찾기','명사구는 한정사·중심 명사·수식어로 이루어질 수 있어요. 중심 명사가 문장 속 일치의 기준이 돼요.',[['Les photos de ma sœur sont belles.','내 여동생의 사진들이 아름다워. (photos가 복수)']]),
  T('세 가지 확장',[['형용사 · épithète','une maison calme · 조용한 집'],['전치사구 · complément du nom','une maison en pierre · 돌로 된 집'],['관계절','une maison qui donne sur la mer · 바다가 보이는 집']]),
  S('명사와 전치사의 관계','de는 소유·내용·기원, à는 용도 등을 나타낼 수 있지만 고정된 결합을 확인해야 해요. tasse de thé는 담긴 내용, tasse à thé는 차를 마시는 용도의 잔이에요.',[['une tasse de thé','차 한 잔'],['une machine à laver','세탁기']]),
  S('동격과 떨어진 수식어','쉼표로 덧붙인 명사나 형용사는 추가 설명을 해요. 문장 앞에 떨어져 나온 형용사는 보통 뒤 문장의 주어를 설명하므로 연결 대상을 명확히 해요.',[['Mina, ma voisine, arrive.','내 이웃인 미나가 와.'],['Fatiguée, Mina rentre.','피곤해서 미나는 집에 돌아가.']])]),
 A('compound-nouns','합성명사와 특수 복수형','noms composés et pluriels particuliers','단어 구성에 따라 복수 표시가 달라져요.',['합성명사','복합명사','복수 예외','chou','bijou','œil','travail'],[
  T('자주 만나는 불규칙 복수',[['un œil / des yeux','눈'],['un travail / des travaux','일·공사'],['un bijou / des bijoux','보석'],['un chou / des choux','양배추'],['un détail / des détails','세부 사항: -ail이 모두 -aux는 아니에요'],['un festival / des festivals','축제: -al의 예외']]),
  S('합성어의 구성','명사·형용사는 뜻에 따라 복수 표시를 하고 동사·전치사·부사는 보통 그대로예요. 굳어진 합성어의 표기는 사전에서 단어 전체로 확인해요.',[['des coffres-forts','금고들'],['des arcs-en-ciel','무지개들']]),
  S('전통 표기와 개정 표기','1990년 개정 표기에서는 동사+명사 또는 전치사+명사 유형의 붙임표 합성어에서 마지막 명사를 단수에는 단수, 복수에는 복수로 쓰는 방향으로 정리했어요. 예를 들어 un après-midi / des après-midis가 가능해요. 전통 표기도 사용돼요.',[['des porte-monnaie / des porte-monnaies','지갑들 (전통 / 개정 표기)']]),
  S('고유명사와 뜻의 차이','사람의 성은 보통 복수 표시를 하지 않아요. 국민 집단을 가리키는 국적 명사는 대문자, 국적 형용사와 언어 이름은 소문자로 써요.',[['les Martin','마르탱 가족'],['les Français / des amis français / le français','프랑스인들 / 프랑스인 친구들 / 프랑스어']])]),
 A('adjective-irregular','형용사의 불규칙 일치','accords particuliers de l’adjectif','여성형과 복수형의 철자 변화를 확인해요.',['불규칙 여성형','doux','faux','blanc','public','demi','nu'],[
  T('여성형의 변화',[['-f → -ve','actif → active'],['-eux → -euse','heureux → heureuse'],['-er → -ère','cher → chère'],['자음 겹침','bon → bonne, naturel → naturelle'],['별도 형태','doux → douce, faux → fausse'],['-c 변화','blanc → blanche, public → publique']]),
  S('여럿을 함께 꾸밀 때','여러 명사를 함께 꾸미면 보통 복수로 맞춰요. 표준적인 일치 규칙에서는 남성과 여성이 섞인 집합에 남성 복수형을 써요. 하나만 꾸미는지 모두를 꾸미는지 문맥도 확인해요.',[['un pantalon et une veste neufs','새 바지와 새 재킷']]),
  S('demi와 nu의 위치','명사 앞의 demi-·nu-는 붙임표로 연결하고 그대로예요. 명사 뒤의 demi는 성만 맞추고 단수형을 유지해요. 명사 뒤의 nu는 일반 형용사처럼 일치해요.',[['une demi-heure / deux heures et demie','반 시간 / 두 시간 반'],['nu-pieds / les pieds nus','맨발로 / 맨발']]),
  S('부사처럼 쓰는 형용사','형용사가 동작 방식을 나타내는 부사 역할이면 성·수에 따라 바뀌지 않는 경우가 있어요. 목적어를 직접 꾸미는 것과 구분해요.',[['Ces fleurs coûtent cher.','이 꽃들은 비싸.'],['Ces fleurs sont chères.','이 꽃들은 비싼 꽃들이야.']])]),
 A('colors','색깔 형용사의 일치','adjectifs de couleur','기본 색과 명사에서 온 색, 복합 색을 구분해요.',['색깔','색상','marron','orange','rose','bleu clair'],[
  T('기본 규칙',[['일반 색 형용사','des robes bleues'],['명사에서 온 색: 보통 불변','des chaussures marron, des sacs orange'],['형용사로 정착한 예외','des fleurs roses, des écharpes mauves'],['두 단어로 된 색: 불변','des robes bleu clair, des yeux vert foncé']]),
  S('어떤 색인지 더 자세히','bleu clair처럼 두 단어로 하나의 색을 나타내면 두 단어 모두 일치하지 않아요. 색을 뜻하는 명사 자체를 말할 때에는 별도 명사 규칙이 적용돼요.',[['Elle porte des gants bleu foncé.','그녀는 짙은 파란색 장갑을 끼고 있어.']]),
  S('두 색을 연결할 때','빨강과 검정이 각각 다른 물건을 가리키면 rouges et noires처럼 일치시켜요. 각각의 물건에 두 색이 함께 있다는 뜻이면 rouge et noir처럼 불변으로 쓰기도 해요. 뜻이 모호하면 bicolore 등으로 분명히 해요.',[['des robes bicolores, rouges et noires','빨강과 검정 두 색으로 된 옷들']])]),
 A('article-omission','관사의 생략과 de','absence d’article et emploi de de','관사를 빼는 경우와 de로 바뀌는 경우를 구별해요.',['무관사','관사 생략','de beaux','profession','sans'],[
  T('기본 패턴',[['직업·신분: être + 명사','Elle est médecin.'],['수량 뒤 de','beaucoup de livres'],['보통 부정의 de','Je n’ai pas de voiture.'],['복수 명사 앞 형용사','de grandes fenêtres'],['고정 표현','avoir peur, en train, à pied']]),
  S('직업도 관사가 필요할 때','직업을 단순 분류하면 관사를 빼지만, 평가·수식이 들어간 명사구 또는 c’est 뒤에서는 관사를 써요.',[['Elle est une excellente médecin.','그녀는 훌륭한 의사야.'],['C’est une médecin.','그 사람은 의사야.']]),
  S('de로 바뀌지 않는 경우','부정문이어도 정관사는 유지해요. être 뒤의 부정관사·부분관사, 두 대상을 대조하는 부정에서도 관사를 유지할 수 있어요. bien des·la plupart des처럼 정해진 표현도 있어요.',[['Je n’aime pas le bruit.','나는 소음을 좋아하지 않아.'],['Ce n’est pas une erreur.','이건 실수가 아니야.'],['Je ne prends pas du thé, mais du café.','나는 차가 아니라 커피를 마셔.']]),
  S('sans·avec 뒤','막연한 결여·방식을 나타내면 관사가 없을 수 있어요. 특정하거나 수식된 대상을 가리키면 관사를 써요. 전치사 뒤에서 관사를 무조건 빼지는 않아요.',[['sans sucre / sans le sucre que tu as acheté','설탕 없이 / 네가 산 그 설탕 없이'],['avec plaisir / avec un grand plaisir','기꺼이 / 아주 기꺼이']])]),
 A('numbers','기수와 숫자 표기','nombres cardinaux','수를 읽고 cent·vingt·mille의 복수 규칙을 익혀요.',['숫자','기수','cardinaux','soixante-dix','quatre-vingts','cent','mille'],[
  T('수의 구조',[['0–16','zéro, un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze, douze, treize, quatorze, quinze, seize'],['17–19','dix-sept, dix-huit, dix-neuf'],['20·30·40·50·60','vingt, trente, quarante, cinquante, soixante'],['21·31·61','vingt et un, trente et un, soixante et un'],['70·71·80·81·90','soixante-dix, soixante et onze, quatre-vingts, quatre-vingt-un, quatre-vingt-dix'],['100·1 000·1 000 000','cent, mille, un million']]),
  S('cent와 vingt의 s',['곱해진 cent·vingt가 수의 끝에 있으면 s를 붙여요. 다른 수가 이어지면 빼요. mille는 변하지 않아요. million·milliard는 명사라 복수가 가능하고, 바로 뒤의 명사와 de로 연결해요.','mille 앞에서는 deux cent mille처럼 s를 빼지만, 명사 million 앞에서는 deux cents millions처럼 유지해요. 페이지·연도에서 순번을 나타내는 수의 cent·vingt도 보통 s 없이 적어요.'],[['deux cents / deux cent trois','200 / 203'],['quatre-vingts / quatre-vingt-deux','80 / 82'],['trois mille / deux millions de personnes','3,000 / 200만 명']]),
  S('un과 명사 일치','un은 여성 명사 앞에서 une가 될 수 있어요. 번호를 이름처럼 읽을 때에는 기본 수 이름을 쓰는 경우가 있어요.',[['vingt et une pages','21쪽'],['la page vingt et un','21쪽이라는 페이지']]),
  S('표기와 지역 차이','전통 표기에는 vingt et un처럼 띄어쓰기가 있고, 1990년 개정 표기는 vingt-et-un처럼 수를 이루는 말을 붙임표로 연결할 수 있어요. 벨기에·스위스 등에서는 septante·nonante를, 스위스 일부에서는 huitante도 써요.')]),
 A('ordinals-fractions','서수·분수·비율','nombres ordinaux, fractions et pourcentages','순서와 전체에서 차지하는 양을 말해요.',['서수','분수','비율','premier','deuxième','tiers','quart','pour cent'],[
  T('서수 만들기',[['1번째','premier / première'],['2번째','deuxième, second / seconde'],['-ième','trois → troisième, six → sixième'],['끝 e 탈락','quatre → quatrième'],['철자 변화','cinq → cinquième, neuf → neuvième'],['복합수','vingt et un → vingt et unième']]),
  S('분수의 이름','분자는 기수, 분모는 서수를 쓰되 1/2·1/3·1/4는 demi·tiers·quart를 써요. 분자가 여럿이면 분모를 복수로 써요.',[['un tiers / deux tiers','3분의 1 / 3분의 2'],['un quart / trois quarts','4분의 1 / 4분의 3'],['deux cinquièmes','5분의 2']]),
  S('명사 앞의 비율','la moitié de·un tiers de 뒤에 대상을 붙여요. pour cent는 “백분의”라는 뜻이고 cent에 s를 붙이지 않아요. 소수는 쉼표로 적고 virgule로 읽어요.',[['la moitié des élèves','학생들의 절반'],['vingt pour cent / 20 %','20퍼센트'],['2,5 : deux virgule cinq','2.5']]),
  S('second와 deuxième','둘 다 두 번째를 나타낼 수 있어요. second는 둘 중 두 번째라는 뉘앙스로 쓰이기도 하지만, “셋 이상이면 절대 쓸 수 없다”는 규칙은 아니에요.')]),
 A('dates-time','날짜·요일·시각','date, jours et heure','날짜를 읽고 하루 중 시점을 말해요.',['날짜','요일','시각','heure','lundi','janvier','midi'],[
  T('달과 요일',[['요일','lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche'],['1–6월','janvier, février, mars, avril, mai, juin'],['7–12월','juillet, août, septembre, octobre, novembre, décembre'],['날짜','le premier mai / le deux mai'],['연도','en 2026'],['약속 시각','à huit heures']]),
  S('요일 앞의 le','Lundi, je pars는 문맥상 특정 월요일이에요. Le lundi, je travaille는 매주 월요일의 습관을 나타낼 수 있어요. 날짜를 완성하면 le lundi 4 mai처럼 써요. 요일·달 이름은 소문자예요.',[['Je viens lundi.','나는 월요일에 와.'],['Je viens le lundi.','나는 매주 월요일에 와.']]),
  T('시각 읽기',[['8 h 15','huit heures et quart'],['8 h 30','huit heures et demie'],['8 h 45','neuf heures moins le quart'],['12 h / 0 h','midi / minuit'],['12 h 30','midi et demi'],['18 h 30','dix-huit heures trente']]),
  S('시각과 기간','Il est huit heures는 현재 시각, à huit heures는 어떤 일이 일어나는 시각이에요. 두 시간의 기간은 deux heures예요. 24시간 형식에서는 분을 숫자로 이어 읽는 방식이 명확해요.',[['Le cours dure deux heures.','수업은 두 시간 동안 진행돼.'],['Le cours commence à neuf heures.','수업은 9시에 시작해.']])]),
 A('indefinite-words','부정형용사와 부정대명사','déterminants et pronoms indéfinis','누군가·각자·아무것이나처럼 대상을 특정하지 않고 말해요.',['부정형용사','부정대명사','quelqu’un','chacun','n’importe','quelque','autre','même','tel'],[
  T('명사와 함께 / 명사를 대신',[['chaque élève','chacun / chacune · 각자'],['quelques personnes','quelques-uns / quelques-unes · 몇몇'],['plusieurs élèves','plusieurs · 여럿'],['aucun livre / aucune page','aucun / aucune · 하나도 없음'],['un autre livre / d’autres livres','un autre / d’autres · 다른 것'],['le même livre / les mêmes livres','le même / les mêmes · 같은 것']]),
  S('누군가와 무엇인가','quelqu’un·personne는 사람, quelque chose·rien은 사물을 나타내요. 뒤에서 형용사로 꾸미면 de를 넣어요. quelque chose와 rien을 꾸미는 형용사는 남성 단수예요.',[['quelque chose de nouveau','새로운 것'],['Je ne vois personne.','나는 아무도 보이지 않아.'],['Chacune a son livre.','각자 자기 책이 있어. (여성들)']]),
  S('아무나·아무거나','n’importe qui·quoi·où·quand는 선택의 제한이 없다는 뜻이에요. 명사와 함께 쓰는 n’importe quel은 명사에 맞춰 quelle·quels·quelles로 바뀌어요.',[['Choisis n’importe quelle carte.','아무 카드나 골라.'],['Tu peux venir n’importe quand.','언제든 와도 돼.']]),
  S('quelque와 tel','quelques는 “몇몇”, quelque + 수는 “약”이라 불변이에요. tel은 명사에 맞춰 telle·tels·telles로 바뀌어요. “어떤 것이든”의 quel que는 두 단어이며 뒤의 주어와 일치해요.',[['quelque vingt minutes','약 20분'],['une telle surprise','그런 놀라움'],['Quelles que soient tes raisons, explique-les.','네 이유가 무엇이든 설명해 줘.']])]),
 A('tout','tout의 네 가지 쓰임','tout : déterminant, pronom, adverbe et nom','모두·전부·아주라는 뜻에 따라 형태가 달라져요.',['tout','toute','tous','toutes','모두','전부'],[
  T('역할별 형태',[['명사를 한정','tout le pain / toute la nuit / tous les jours / toutes les pages'],['대명사: 모든 것','Tout va bien.'],['대명사: 모든 사람·대상','Ils sont tous ici. / Elles sont toutes ici.'],['부사: 아주·완전히','Il est tout petit.'],['명사: 전체','Le tout coûte dix euros.']]),
  S('매일과 하루 종일','tous les jours는 반복되는 매일, toute la journée는 하루 전체예요. tous가 독립 대명사로 “모두”를 뜻하면 보통 끝 s를 발음해요.',[['Je travaille tous les jours.','나는 매일 일해.'],['J’ai travaillé toute la journée.','나는 하루 종일 일했어.']]),
  S('부사 tout의 예외적 일치','“아주”라는 부사는 보통 tout 그대로예요. 다만 자음 또는 유음 h로 시작하는 여성 형용사 앞에서는 toute·toutes로 일치해요. 모음·무음 h 앞이면 tout를 유지해요.',[['Elle est toute petite.','그녀는 아주 작아.'],['Elles sont toutes honteuses.','그녀들은 무척 부끄러워해.'],['Elles sont tout heureuses.','그녀들은 무척 행복해.']]),
  S('전부인지 아주인지','Elles sont toutes petites는 “그녀들은 모두 작다” 또는 “아주 작다”로 읽힐 수 있어요. 문맥이 없으면 toutes les deux·très 등을 써서 뜻을 분명히 할 수 있어요.')]),
 A('spatial-prepositions','장소·이동·수단의 전치사','prépositions de lieu, de direction et de moyen','위치뿐 아니라 방향·출발점·이동 방법도 구분해요.',['장소 전치사','이동','dans','sur','vers','jusqu’à','à travers','chez'],[
  T('위치와 방향',[['dans / sur / sous','안에 / 위에 / 아래에'],['devant / derrière','앞에 / 뒤에'],['entre / parmi','사이 / 무리 속에'],['près de / loin de / à côté de','가까이 / 멀리 / 옆에'],['vers / jusqu’à','쪽으로 / ~까지'],['de… à… / à travers','~에서 ~로 / ~을 가로질러']]),
  S('chez와 장소 이름','chez는 사람이나 사람의 집·일터를 나타내요. 건물·도시·나라의 이름에는 그에 맞는 다른 전치사를 써요. chez moi에서 moi는 강세형이에요.',[['Je vais chez le dentiste.','나는 치과 의사에게 가.'],['Je suis à la pharmacie.','나는 약국에 있어.']]),
  S('교통수단과 재료','교통수단은 en train·en voiture·à vélo·à pied 같은 결합을 익혀요. en은 재료를 나타내기도 하고 avec는 도구를 나타낼 수 있어요.',[['Je viens en bus, puis à pied.','나는 버스로 온 다음 걸어와.'],['une table en bois / couper avec un couteau','나무 탁자 / 칼로 자르다']]),
  S('전치사와 관사 축약','à·de 뒤에 le·les가 오면 au·aux·du·des로 합쳐져요. la·l’ 앞에서는 합치지 않아요. près de le musée가 아니라 près du musée예요.',[['jusqu’au pont / à côté de l’école','다리까지 / 학교 옆에']])]),
 A('elision','모음 생략·연음·유음 h','élision, liaison et h aspiré','철자가 줄어드는 경우와 소리만 이어지는 경우를 구분해요.',['모음 생략','연음','h aspiré','h muet','élision','liaison','si il'],[
  T('철자에서 줄어드는 말',[['je / me / te / se','j’aime / m’appeler / t’aider / s’asseoir'],['le / la / de / ne / que','l’amie / d’ici / n’arrive / qu’elle'],['si + il / ils','s’il / s’ils: si elle은 그대로'],['ce + est / était','c’est / c’était'],['jusque·lorsque·puisque 등','jusqu’ici / lorsqu’il / puisqu’elle']]),
  S('h는 사전에서 확인해요','무음 h 앞에서는 모음 앞처럼 줄이고 연음할 수 있어요. 유음 h는 h 자체를 소리 내는 뜻이 아니라 생략·연음을 막는 표시예요.',[['l’hôtel / les hôtels','호텔 / 호텔들 (무음 h)'],['le héros / les héros','영웅 / 영웅들 (유음 h)']]),
  S('연음은 철자를 바꾸지 않아요','les amis의 s가 뒤 모음과 이어져 들려도 les를 l’로 바꾸지 않아요. 한정사+명사, 주어 대명사+동사의 연음은 흔히 필수이고 et 바로 뒤에서는 연음하지 않아요.',[['les amis / vous avez','친구들 / 당신은 가지고 있어'],['un garçon et une fille','남자아이와 여자아이']]),
  S('무조건 붙이지 않아요','et·ou·tu는 모음 앞이라고 표준 표기에서 apostrophe로 줄이지 않아요. parce que는 parce qu’il처럼 줄지만 parce que nous에서는 유지해요. aujourd’hui는 굳어진 단어예요.')]),
 A('homophones','헷갈리는 동음이의어','homophones grammaticaux','발음이 같아도 문장 속 역할에 따라 철자가 달라져요.',['동음이의어','a à','et est','ou où','son sont','ces ses','c’est s’est'],[
  T('바꾸어 확인하기',[['a / à','a는 avoir: avait로 바꿀 수 있음 / à는 전치사'],['et / est','et는 “그리고” / est는 être: était로 바꿀 수 있음'],['ou / où','ou는 선택 / où는 장소·시간'],['son / sont','son livre는 소유 / ils sont는 être'],['ces / ses','ces는 지시 / ses는 소유'],['on / ont','on은 주어 / ont는 avoir']]),
  S('c’est와 s’est','c’est는 ce + est, s’est는 대명동사의 se + est예요. s’est 뒤의 과거분사만 보고 고르지 말고 행동의 주어와 동사를 확인해요.',[['C’est Léa. Elle s’est levée.','레아야. 그녀는 일어났어.']]),
  S('leur와 leurs','동사 앞에서 “그들에게”인 leur는 불변이에요. 명사 앞에서 “그들의”인 소유형용사는 소유물의 수에 따라 leur·leurs로 바뀌어요.',[['Je leur donne leurs clés.','나는 그들에게 그들의 열쇠를 줘.']]),
  S('-er와 -é','-er 원형과 -é 과거분사는 발음이 같을 수 있어요. prendre·pris처럼 소리가 다른 동사로 바꾸어 문장 구조를 확인해요.',[['Je vais manger. / J’ai mangé.','나는 먹을 거야. / 나는 먹었어.']])]),
 A('punctuation','구두점과 문장 구분','ponctuation et phrase graphique','구두점으로 문장의 구조와 덧붙인 정보를 표시해요.',['구두점','쉼표','virgule','point','guillemets','phrase nominale','감탄사'],[
  T('기본 부호',[['마침표 .','평서문 끝'],['쉼표 ,','열거·덧붙임·문장 앞 상황어'],['쌍점 :','설명·예시·인용 소개'],['세미콜론 ;','가까이 연결되는 독립 문장'],['물음표 ? / 느낌표 !','질문 / 감탄·강한 요청'],['따옴표 « »','직접 인용']]),
  S('주어와 동사 사이','단순히 길다는 이유로 주어와 동사 사이에 쉼표를 넣지 않아요. 삽입된 설명은 양쪽 쉼표로 묶어요. 쉼표 유무가 관계절의 뜻을 바꿀 수도 있어요.',[['Lina, ma voisine, travaille ici.','내 이웃 리나는 여기에서 일해.']]),
  S('동사가 없는 문장','표지·제목·감탄에서는 동사 없이도 완결된 발화가 가능해요. 명사문과 감탄사는 일상 문장에서 주어·동사를 임의로 생략하는 것과 달라요.',[['Entrée interdite.','출입 금지.'],['Quelle chance !','정말 운이 좋네!'],['Paul, viens ici !','폴, 이리 와! (Paul은 부름말)']]),
  S('띄어쓰기 관습','프랑스식 조판에서는 쌍점·세미콜론·물음표·느낌표 앞과 프랑스식 따옴표 안쪽에 공백을 두는 관습이 있어요. 지역과 매체에 따라 세부 규칙이 다르며 구두점 앞의 공백과 문법 자체를 혼동하지 않아요.')]),
 A('word-formation','단어 형성과 명사화','formation des mots et nominalisation','동작·성질을 명사로 바꾸어 문장을 압축해요.',['명사화','접두사','접미사','nominalisation','préfixe','suffixe'],[
  T('형태를 바꾸는 방법',[['동사 → 명사','décider → décision, développer → développement'],['형용사 → 명사','libre → liberté, possible → possibilité'],['반대 접두사','possible → impossible, faire → défaire'],['다시 하는 뜻','lire → relire'],['품사 전환','le dîner, le beau']]),
  S('명사화하며 문장을 바꾸기','명사화하면 시제·주어가 더 이상 동사에 표시되지 않아요. 필요하면 소유형용사·de·시간 표현 등으로 보충해요. 접미사만 기계적으로 붙이면 틀릴 수 있으므로 명사형과 성을 함께 확인해요.',[['Le train arrive à huit heures. → L’arrivée du train à huit heures','기차가 8시에 도착한다. → 기차의 8시 도착']]),
  S('누가 누구에게 했는지','de로만 이어 붙이면 행동의 주체와 대상이 모호해질 수 있어요. par 등으로 주체를 밝히거나 문장으로 풀어 써요.',[['la destruction du pont par l’armée','군대에 의한 다리 파괴']]),
  S('명사 뒤의 전치사','동사의 결합과 명사의 결합이 항상 같지는 않아요. participer à는 la participation à로 이어지지만 changer quelque chose는 le changement de quelque chose처럼 바뀔 수 있어요.')])
];
