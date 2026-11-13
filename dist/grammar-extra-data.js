const S=(title,text,examples=[])=>({title,paragraphs:Array.isArray(text)?text:[text],examples});
const T=(title,headers,rows)=>({title,table:{headers,rows}});
const A=(id,category,title,term,summary,aliases,sections)=>({id,category,title,term,fr:term,summary,aliases,lessonIds:[],sections});

export const extraGrammarArticles=[
  A('word-classes','basics','품사와 문장 성분','classes de mots et fonctions','단어의 종류와 문장 안에서 맡는 역할을 구분해요.',['품사','문장 성분','sujet','verbe','nom','COD','COI','주격대명사'],[
    S('종류와 역할은 달라요','명사·동사 같은 품사는 단어의 종류예요. 주어·직접목적어 같은 문장 성분은 그 문장에서 맡는 역할이에요. 같은 명사도 문장에 따라 역할이 달라져요.',[['Marie regarde Paul.','마리는 폴을 바라봐.'],['Paul regarde Marie.','폴은 마리를 바라봐.']]),
    T('자주 만나는 품사',['이름','예'],[['명사 (nom)','livre · 책'],['동사 (verbe)','lire · 읽다'],['형용사 (adjectif)','petit · 작은'],['부사 (adverbe)','souvent · 자주'],['대명사 (pronom)','elle · 그녀'],['전치사 (préposition)','avec · ~와 함께'],['한정사 (déterminant)','le · un · mon · ce'],['접속사 (conjonction)','et · parce que']]),
    T('주어와 목적어',['역할','예문에서 찾기'],[['주어 (sujet): 누가?','Marie lit un livre. → Marie'],['직접목적어 (COD): 무엇을?','Marie lit un livre. → un livre'],['간접목적어 (COI): 누구에게?','Marie parle à Paul. → à Paul']]),
    S('한국어 조사만으로 정하지 않아요','프랑스어 동사가 어떤 연결을 요구하는지 확인해요. écouter Paul은 직접목적어이고 parler à Paul은 간접목적어예요. 주격대명사 je·tu·il·elle·on·nous·vous·ils·elles는 주어 자리에 와요.',[['On apprend le français.','우리는 프랑스어를 배워. (일상적인 on)']])]),
  A('gender-plural','basics','명사의 성과 복수형','genre et nombre des noms','명사의 성을 함께 익히고 자주 쓰는 불규칙 복수를 확인해요.',['남성','여성','복수형','pluriel','chevaux','yeux','animaux'],[
    S('성은 명사의 특징이에요','명사는 보통 남성 또는 여성이에요. un livre·une table처럼 관사와 묶어 익혀요. 사물의 성은 현실의 남녀와 관계없고 어미만으로 항상 예측할 수도 없어요.'),
    T('복수형의 대표 패턴',['단수','복수'],[['un livre','des livres'],['un bateau','des bateaux'],['un animal','des animaux'],['un choix','des choix'],['un nez','des nez'],['un œil','des yeux']]),
    S('패턴마다 예외가 있어요','-al은 -aux가 흔하지만 un bal → des bals처럼 예외가 있어요. -ou는 보통 s를 붙이고 bijou·chou·genou 같은 일부 명사는 x를 붙여요. -s·-x·-z로 끝나는 명사는 복수에서 철자가 같아요.',[['un trou → des trous','구멍 하나 → 여러 구멍'],['un bijou → des bijoux','장신구 하나 → 여러 장신구']]),
    S('명사와 주변 말을 함께 바꿔요','관사와 형용사도 명사의 성·수에 맞춰요. 복수 s는 보통 발음하지 않지만 연결되는 말에 따라 소리의 차이가 생길 수 있어요.',[['un petit livre → des petits livres','작은 책 한 권 → 작은 책들']])]),
  A('possessive-adjectives','basics','소유형용사','adjectifs possessifs','누구의 것인지 말하면서, 뒤에 오는 명사의 성·수에 맞춰요.',['mon','ma','mes','ton','ta','tes','son','sa','ses','notre','votre','leurs','déterminants possessifs','소유'],[
    S('주인과 물건을 나눠 봐요','주인이 누구인지에 따라 mon·ton·son 등의 묶음을 고르고, 소유하는 명사의 성·수에 따라 형태를 골라요. son livre는 주인이 남성이든 여성이든 livre가 남성이므로 son이에요. 현대 문법에서는 소유한정사(déterminant possessif)라고도 해요.'),
    T('주인별 형태',['주인','남성 단수 / 여성 단수 / 복수'],[['나','mon / ma / mes'],['너','ton / ta / tes'],['그·그녀','son / sa / ses'],['우리','notre / notre / nos'],['당신·여러분','votre / votre / vos'],['그들·그녀들','leur / leur / leurs']]),
    S('여성 명사인데 mon을 쓰는 경우','모음·무음 h로 시작하는 여성 단수 명사 바로 앞에는 ma·ta·sa 대신 mon·ton·son을 써요. 명사가 남성으로 바뀐 것은 아니에요.',[['mon amie','나의 여자 친구'],['ma petite amie','나의 여자 친구·여자친구 (petite가 사이에 있음)'],['son histoire','그의·그녀의 이야기']]),
    S('관사를 겹쳐 쓰지 않아요','mon livre처럼 소유형용사 자체가 명사를 한정하므로 le mon livre라고 쓰지 않아요. leur livre는 그들의 책 한 권, leurs livres는 그들의 여러 책이에요. 주인이 여럿이라는 이유만으로 항상 leurs를 쓰지는 않아요.',[['Elle cherche son sac.','그녀는 자기 가방을 찾고 있어.']])]),
  A('demonstrative-adjectives','basics','지시형용사','adjectifs démonstratifs','이것·저것에 해당하는 명사를 가리켜요.',['ce','cet','cette','ces','déterminants démonstratifs'],[
    S('명사 앞에서 가리켜요','뒤에 오는 명사의 성·수에 맞춰 형태를 골라요. 현대 문법에서는 지시한정사(déterminant démonstratif)라고도 해요.'),
    T('네 가지 형태',['상황','형태와 예'],[['남성 단수 · 자음 앞','ce livre'],['남성 단수 · 모음/무음 h 앞','cet ami · cet hôtel'],['여성 단수','cette maison · cette amie'],['복수 · 남녀 공통','ces livres · ces maisons']]),
    S('여성은 모음 앞에서도 cette','cet은 남성 단수의 형태예요. 여성 명사 amie에는 cette amie를 써요. h aspiré로 시작하는 남성 명사에는 ce héros처럼 ce를 유지해요.',[['Cet hôtel est calme.','이 호텔은 조용해.'],['Cette histoire est intéressante.','이 이야기는 흥미로워.']]),
    S('가까움과 대조를 더할 때','명사 뒤에 -ci·-là를 붙여 이쪽·저쪽 또는 둘 사이의 대조를 나타낼 수 있어요. 명사를 쓰지 않고 받으려면 celui·celle 같은 지시대명사가 필요해요.',[['Je préfère ce livre-ci à ce livre-là.','나는 저 책보다 이 책을 더 좋아해.']])]),
  A('partitive-articles','basics','부분관사','articles partitifs','개수를 세지 않고 어떤 양이나 일부를 말해요.',['du','de la','de l’','부분량','partitif'],[
    S('얼마인지 정하지 않은 양','음식·음료 같은 대상의 일부를 말할 때 du·de la·de l’을 써요. 복수 형태 des는 문맥과 문법 분류에 따라 부정관사 또는 부분관사로 설명되기도 해요.'),
    T('세 가지 기본형',['명사','부분량 표현'],[['남성 단수','du pain · 빵'],['여성 단수','de la soupe · 수프'],['모음·무음 h 앞','de l’eau · 물']]),
    S('취향·한 개·부분량 구분','일반적인 취향은 정관사, 한 잔처럼 단위가 정해지면 부정관사, 양을 정하지 않으면 부분관사를 써요.',[['J’aime le café.','나는 커피를 좋아해.'],['Je prends un café.','나는 커피 한 잔을 마실게.'],['Je bois du café.','나는 커피를 마셔.']]),
    S('부정과 수량 표현 뒤','일반적인 부정에서는 du·de la·de l’이 de·d’로 바뀌어요. beaucoup de·un peu de 뒤에도 바로 명사를 붙여요. être 뒤나 대조를 강조하는 경우는 관사를 유지할 수 있어요.',[['Je ne bois pas de café.','나는 커피를 마시지 않아.'],['Je bois un peu de café.','나는 커피를 조금 마셔.'],['Ce n’est pas du café.','이것은 커피가 아니야.']])]),
  A('adjective-position','basics','형용사의 위치와 뜻','place et sens de l’adjectif','명사 앞뒤의 위치에 따라 자연스러움과 뜻이 달라져요.',['형용사 위치','grand','ancien','propre','beau','bel','nouvel','vieil'],[
    S('기본 위치와 자주 쓰는 예외','색·국적처럼 분류하는 형용사는 보통 명사 뒤에 와요. petit·grand·beau·bon 같은 자주 쓰는 형용사는 앞에 오는 일이 많아요.',[['une voiture rouge','빨간 자동차'],['un petit village','작은 마을']]),
    T('위치에 따라 달라지는 뜻',['명사 앞','명사 뒤'],[['un grand homme · 위대한 사람','un homme grand · 키 큰 사람'],['mon ancien appartement · 예전 아파트','un meuble ancien · 오래된 가구'],['ma propre chambre · 나 자신의 방','une chambre propre · 깨끗한 방']]),
    S('모음 앞의 남성 단수형','beau·nouveau·vieux는 남성 단수 명사의 모음·무음 h 바로 앞에서 bel·nouvel·vieil이 돼요. 여성형은 belle·nouvelle·vieille예요.',[['un bel hôtel / une belle maison','아름다운 호텔 / 아름다운 집'],['un vieil ami','오래된 친구·나이 든 친구 (문맥에 따라)']]),
    S('복수 형용사가 명사 앞에 올 때','격식 있는 표준 표현에서는 부정관사 des가 de로 바뀌는 경우가 많아요. 합성어처럼 굳어진 표현은 예외가 있어요.',[['de beaux jardins','아름다운 정원들'],['des petits pois','완두콩']])]),
  A('adverbs','basics','부사의 형태와 위치','adverbes','어떻게·얼마나·얼마나 자주 하는지 덧붙여요.',['부사','-ment','rapidement','doucement','bien','souvent'],[
    S('무엇을 꾸미나요?','부사는 동사·형용사·다른 부사 또는 문장 전체를 꾸밀 수 있고 보통 성·수에 따라 바뀌지 않아요.',[['Elle parle lentement.','그녀는 천천히 말해.'],['C’est très utile.','그것은 아주 유용해.']]),
    T('-ment 만들기',['출발 형태','부사'],[['lent → lente','lentement'],['doux → douce','doucement'],['vrai','vraiment'],['constant','constamment'],['prudent','prudemment'],['bon','bien (불규칙 대응)']]),
    S('형용사 앞, 동사의 주변','정도를 나타내는 très는 형용사·부사 앞에 와요. souvent·bien 같은 짧은 부사는 활용된 동사 뒤, 복합시제에서는 조동사와 과거분사 사이에 자주 와요. 긴 방식 부사는 뒤쪽에도 올 수 있어요.',[['Je lis souvent.','나는 자주 읽어.'],['J’ai bien dormi.','나는 잘 잤어.'],['Elle a répondu calmement.','그녀는 차분하게 대답했어.']]),
    S('beaucoup와 très','동사의 정도는 beaucoup, 형용사의 정도는 très가 기본이에요. beaucoup de 뒤에는 명사가 와요.',[['J’aime beaucoup ce livre.','나는 이 책을 아주 좋아해.'],['Ce livre est très intéressant.','이 책은 아주 흥미로워.']])]),
  A('quantity','basics','수량과 부정 표현','quantité et indéfinis','많이·조금·모두·각각을 명사와 연결해요.',['beaucoup de','un peu de','trop de','assez de','chaque','tout','tous','aucun'],[
    S('양을 말하면 de','beaucoup de·peu de·un peu de·assez de·trop de 뒤에 명사를 붙여요. 모음 앞에서는 d’로 줄고, 셀 수 있는 여러 대상은 복수로 써요.',[['beaucoup de livres','많은 책'],['un peu d’eau','물 조금'],['assez de temps','충분한 시간']]),
    T('대상을 나누어 말하기',['표현','예'],[['chaque + 단수','chaque jour · 매일'],['quelques + 복수','quelques jours · 며칠'],['plusieurs + 복수','plusieurs personnes · 여러 사람'],['tout / toute / tous / toutes','tous les jours · 매일 / toute la journée · 하루 종일']]),
    S('peu와 un peu','peu는 적어서 부족하다는 느낌, un peu는 조금은 있다는 느낌이 될 수 있어요. 정도를 문맥에 맞춰 골라요.',[['J’ai peu de temps.','나는 시간이 별로 없어.'],['J’ai un peu de temps.','나는 시간이 조금 있어.']]),
    S('aucun과 부정','aucun·aucune는 보통 단수 명사와 쓰고 ne와 함께 하나도 없음을 나타내요. 같은 뜻의 부정에 pas를 더하지 않아요.',[['Je n’ai aucune question.','나는 질문이 하나도 없어.'],['Aucun élève n’est absent.','결석한 학생이 아무도 없어.']])]),
  A('interrogatives','basics','의문사와 quel','mots interrogatifs et quel','누구·무엇·언제·왜·어떤 것을 묻는지 구분해요.',['qui','quoi','que','quel','quelle','comment','pourquoi','combien','quand','의문형용사','의문대명사'],[
    T('묻는 내용',['의문사','예문'],[['누구 · qui','Qui vient ?'],['무엇 · que / quoi','Que fais-tu ? / Tu fais quoi ?'],['언제 · quand','Quand pars-tu ?'],['어디 · où','Où habites-tu ?'],['어떻게 · comment','Comment allez-vous ?'],['왜 · pourquoi','Pourquoi pars-tu ?'],['얼마나 · combien','Combien ça coûte ?']]),
    S('주어를 묻는지 목적어를 묻는지','Qui vient ?의 qui는 오는 사람이므로 주어예요. Qui est-ce que tu vois ?의 qui는 보는 대상이에요. 사물이 주어이면 Qu’est-ce qui… ?, 사물이 목적어이면 Qu’est-ce que… ?로 구별해요.',[['Qu’est-ce qui se passe ?','무슨 일이 일어나고 있나요?'],['Qu’est-ce que tu lis ?','너는 무엇을 읽고 있어?']]),
    T('quel은 명사에 맞춰요',['성·수','형태'],[['남성 단수','quel livre'],['여성 단수','quelle heure'],['남성 복수','quels livres'],['여성 복수','quelles questions']]),
    S('전치사 뒤의 무엇','전치사 뒤에서는 보통 quoi를 써요. pourquoi는 parce que로 이유를 답하고, combien de 뒤에는 묻는 수량의 명사가 와요.',[['À quoi penses-tu ?','너는 무엇을 생각하고 있어?'],['Combien de livres as-tu ?','너는 책이 몇 권 있어?']])]),
  A('countries-prepositions','basics','나라·도시의 전치사','prépositions devant les lieux','어디에 가는지와 어디에서 오는지를 구분해요.',['en France','au Japon','aux États-Unis','à Paris','de France','pays','나라'],[
    T('위치·목적지',['장소','전치사와 예'],[['도시','à Paris'],['여성 국가','en France'],['남성 국가 · 자음 시작','au Japon'],['모음으로 시작하는 국가','en Iran'],['복수 국가','aux États-Unis']]),
    S('국가의 성도 확인해요','-e로 끝나는 국가는 여성인 경우가 많지만 le Mexique처럼 예외도 있어요. 국가명과 관사를 함께 익히는 편이 정확해요. 섬·특수 지명에는 별도 관용이 있어요.'),
    T('출발지',['장소','오는 곳'],[['도시','de Paris'],['여성 국가','de France'],['남성 국가 · 자음 시작','du Japon'],['모음 시작','d’Iran'],['복수 국가','des États-Unis']]),
    S('국적·언어와 구별해요','Je suis en France는 위치, Je suis français·française는 국적, Je parle français는 언어예요. 모양이 비슷해도 문장 안의 역할이 달라요.',[['Elle vient du Japon et habite en France.','그녀는 일본에서 왔고 프랑스에 살아.']])]),
  A('time-prepositions','basics','시간의 전치사','prépositions de temps','시작점·기간·걸린 시간·앞으로 남은 시간을 구분해요.',['depuis','pendant','pour','dans','il y a','en une heure','기간'],[
    T('같은 숫자, 다른 시간 관계',['표현','핵심 뜻'],[['depuis deux ans','2년 전부터 지금까지'],['pendant deux heures','2시간 동안'],['en deux heures','2시간 걸려서 완료'],['dans deux heures','지금부터 2시간 후'],['il y a deux heures','지금으로부터 2시간 전'],['pour deux jours','예정된 2일 동안']]),
    S('계속되는 일에는 depuis','지금도 이어지는 상태는 depuis와 현재형을 함께 쓰는 경우가 많아요. 과거의 한 시점까지 이어졌다면 반과거 등 문맥에 맞는 시제를 써요.',[['J’habite ici depuis deux ans.','나는 2년 전부터 여기 살고 있어.'],['Je l’attendais depuis une heure.','나는 그를 한 시간째 기다리고 있었어.']]),
    S('기간과 완료에 걸린 시간','pendant는 얼마 동안 지속됐는지, en은 끝내는 데 얼마나 걸렸는지 말할 수 있어요.',[['J’ai lu pendant une heure.','나는 한 시간 동안 읽었어.'],['J’ai lu ce livre en une heure.','나는 이 책을 한 시간 만에 읽었어.']]),
    S('앞일과 지난 시점','dans와 il y a의 방향을 구분해요. 날짜·요일·계절에는 à huit heures, le lundi, en été, au printemps처럼 표현별 전치사·관사도 함께 익혀요.',[['Je partirai dans deux jours.','나는 이틀 후에 떠날 거야.'],['Je suis arrivé il y a deux jours.','나는 이틀 전에 도착했어. (남성 화자)']])]),
  A('present-regular','verbs','현재형의 규칙 활용','présent de l’indicatif','주어에 맞는 어미와 규칙동사의 대표 패턴을 익혀요.',['현재','présent','parler','finir','vendre','1군','2군','-er','-ir','-re'],[
    S('현재·습관·일반적인 사실','현재형은 지금 하는 일뿐 아니라 습관이나 일반적인 사실에도 써요. 동사원형을 통째로 붙이지 않고 주어에 맞춰 바꿔요.'),
    T('parler · 말하다',['주어','현재형'],[['je','parle'],['tu','parles'],['il / elle / on','parle'],['nous','parlons'],['vous','parlez'],['ils / elles','parlent']]),
    T('finir · 끝내다',['주어','현재형'],[['je','finis'],['tu','finis'],['il / elle / on','finit'],['nous','finissons'],['vous','finissez'],['ils / elles','finissent']]),
    T('vendre · 팔다',['주어','현재형'],[['je','vends'],['tu','vends'],['il / elle / on','vend'],['nous','vendons'],['vous','vendez'],['ils / elles','vendent']]),
    S('끝 모양만으로 전부 분류하지 않아요','finir형 -ir 동사는 nous에서 -issons를 쓰지만 partir·venir는 이 패턴이 아니에요. -re 동사도 모두 vendre처럼 변하지 않아요. aller는 -er로 끝나지만 불규칙이고, manger → nous mangeons처럼 발음을 지키는 철자 변화도 있어요.',[['Nous finissons à six heures.','우리는 여섯 시에 끝내.']])]),
  A('present-irregular','verbs','현재형의 주요 불규칙 동사','verbes irréguliers au présent','자주 쓰는 동사를 여섯 인칭으로 비교해요.',['faire','venir','prendre','dire','lire','écrire','boire','savoir','connaître','불규칙 현재'],[
    S('현재형은 단수·복수 어간도 봐요','불규칙 동사는 어미뿐 아니라 어간도 달라질 수 있어요. 표의 순서는 je, tu, il·elle·on, nous, vous, ils·elles예요. être·avoir·aller·vouloir·pouvoir는 각각의 항목에 전체 활용표가 있어요.'),
    T('동사별 여섯 형태',['원형','je → tu → il → nous → vous → ils'],[['faire','fais / fais / fait / faisons / faites / font'],['venir','viens / viens / vient / venons / venez / viennent'],['prendre','prends / prends / prend / prenons / prenez / prennent'],['dire','dis / dis / dit / disons / dites / disent'],['lire','lis / lis / lit / lisons / lisez / lisent'],['écrire','écris / écris / écrit / écrivons / écrivez / écrivent'],['boire','bois / bois / boit / buvons / buvez / boivent'],['savoir','sais / sais / sait / savons / savez / savent'],['connaître','connais / connais / connaît / connaissons / connaissez / connaissent']]),
    S('알다의 두 동사','savoir는 사실이나 방법을 안다는 뜻에, connaître는 사람·장소에 익숙하다는 뜻에 자주 써요.',[['Je sais nager.','나는 수영할 줄 알아.'],['Je connais cette ville.','나는 이 도시를 알아.']]),
    S('vous와 ils도 따로 확인해요','vous faites·vous dites에는 일반적인 -ez 어미가 없어요. venir의 ils viennent, prendre의 ils prennent처럼 단수와 복수의 어간 차이도 함께 익혀요.',[['Vous faites quoi demain ?','여러분은 내일 무엇을 하나요?']])]),
  A('pronominal-verbs','verbs','대명동사','verbes pronominaux','주어와 연결되는 대명사를 동사와 함께 써요.',['se lever','se laver','se souvenir','me','te','se','대명동사 과거','재귀'],[
    S('동사 앞의 me·te·se','se lever처럼 사전형에 se가 붙는 동사예요. 주어에 맞춰 재귀대명사를 바꿔요. 스스로 하는 행동, 서로 하는 행동, 대명사와 함께 굳어진 뜻 등으로 쓰여요.'),
    T('se lever 현재형',['주어','형태'],[['je','me lève'],['tu','te lèves'],['il / elle / on','se lève'],['nous','nous levons'],['vous','vous levez'],['ils / elles','se lèvent']]),
    S('부정과 동사원형','부정은 ne + 대명사 + 활용된 동사 + pas예요. 원형 앞의 대명사도 실제 행동의 주어에 맞춰요.',[['Je ne me lève pas tôt.','나는 일찍 일어나지 않아.'],['Nous allons nous reposer.','우리는 쉴 거야.']]),
    S('복합과거의 일치는 구조를 봐요','조동사는 être를 쓰지만 무조건 주어에 일치하는 것은 아니에요. se가 직접목적어이면 앞에 놓인 그 목적어에 일치해요. 직접목적어가 뒤에 오거나 se가 간접목적어이면 일치하지 않는 경우가 있어요.'),
    T('헷갈리는 세 문장',['문장','이유'],[['Elles se sont lavées.','se가 씻는 대상 → 여성 복수 일치'],['Elles se sont lavé les mains.','씻는 대상 les mains가 뒤에 옴 → lavé'],['Elles se sont parlé.','parler à: se가 간접목적어 → parlé'],['Elles se sont souvenues de lui.','본질적 대명동사 se souvenir → 주어 일치']]),
    S('뜻도 동사별로 확인해요','se souvenir de는 기억하다, se rendre compte de는 알아차리다처럼 묶음으로 익혀요. 모든 대명동사를 “자기 자신을 ~하다”로 번역하지 않아요.',[['Je me souviens de ce jour.','나는 그날을 기억해.']])]),
  A('imperative','verbs','명령법','impératif','부탁·지시·제안을 주어 없이 표현해요.',['명령','parle','allez','vas-y','donne-le-moi','sois','ayez'],[
    S('tu·nous·vous에 해당하는 형태','말하는 상대에게 지시하거나 함께 하자고 제안해요. 주어 대명사는 쓰지 않아요. 기본 형태는 현재형을 바탕으로 하지만 예외가 있어요.'),
    T('자주 쓰는 명령법',['동사','tu / nous / vous'],[['parler','parle / parlons / parlez'],['finir','finis / finissons / finissez'],['prendre','prends / prenons / prenez'],['aller','va / allons / allez'],['être','sois / soyons / soyez'],['avoir','aie / ayons / ayez'],['savoir','sache / sachons / sachez']]),
    S('tu형의 s와 y·en','-er 동사와 aller의 tu형은 보통 s가 없어요. 바로 뒤에 y·en이 이어져 연결되는 경우에는 Parles-en·Vas-y처럼 s를 넣어요.',[['Écoute !','들어 봐!'],['Vas-y !','가 봐!'],['N’y va pas !','거기에 가지 마!']]),
    S('긍정과 부정의 대명사 위치','긍정에서는 동사 뒤에 붙이고 하이픈으로 이어요. 부정에서는 동사 앞으로 돌아가요. 긍정에서 me·te는 보통 moi·toi가 되지만 en 앞에서는 m’·t’로 줄어요.',[['Donne-le-moi.','그것을 나에게 줘.'],['Ne me le donne pas.','그것을 나에게 주지 마.'],['Donne-m’en un.','그것 하나를 나에게 줘.'],['Lève-toi. / Ne te lève pas.','일어나. / 일어나지 마.']])]),
  A('recent-past','tenses','최근과거','passé récent','방금 끝난 일을 venir de와 원형으로 말해요.',['venir de','viens de','venais de','방금','최근과거'],[
    S('venir de + 동사원형','venir를 주어에 맞춰 현재형으로 바꾸고 de 뒤에는 원형을 써요. 모음 앞의 de는 d’로 줄어요.',[['Je viens de finir.','나는 방금 끝냈어.'],['Elle vient d’arriver.','그녀는 방금 도착했어.']]),
    T('주어별 venir',['주어','형태'],[['je / tu','viens de partir'],['il / elle / on','vient de partir'],['nous','venons de partir'],['vous','venez de partir'],['ils / elles','viennent de partir']]),
    S('과거의 그때 막 끝났다면','venir를 반과거로 바꾸면 과거의 기준 시점 바로 전에 끝난 일이에요. 현재를 기준으로 한 “방금”과 구별해요.',[['Je venais de manger quand il a appelé.','그가 전화했을 때 나는 막 식사를 마친 참이었어.']]),
    S('출발지를 뜻하는 venir de와 구별','de 뒤가 장소 명사면 어디에서 온다는 뜻일 수 있어요. 최근과거에서는 반드시 행동의 원형이 와요.',[['Je viens de Paris.','나는 파리에서 와.'],['Je viens de visiter Paris.','나는 방금 파리를 방문했어.']])]),
  A('ongoing-present','tenses','현재 진행 중인 일','être en train de','지금 하고 있는 행동이라는 점을 강조해요.',['현재진행','en train de','진행형'],[
    S('être en train de + 동사원형','être를 주어에 맞추고 en train de 뒤에는 원형을 써요. 프랑스어는 단순한 현재형만으로도 현재 진행을 말할 수 있어서 항상 이 표현을 넣지는 않아요.',[['Je lis.','나는 읽어·읽고 있어.'],['Je suis en train de lire.','나는 지금 읽는 중이야.']]),
    T('주어와 시점 바꾸기',['상황','표현'],[['그녀가 지금','Elle est en train de travailler.'],['우리가 지금','Nous sommes en train de manger.'],['내가 그때','J’étais en train de lire.']]),
    S('진행 중인 행동에 써요','직업·정체성·늘 유지되는 상태를 말하려는 경우에는 보통 단순한 être나 현재형을 써요. 영어의 진행형과 모든 상황이 일치하는 것은 아니에요.',[['Je suis étudiant.','나는 학생이야.'],['Je suis en train d’étudier.','나는 지금 공부하는 중이야.']])]),
  A('pluperfect','tenses','대과거','plus-que-parfait','이미 지난 시점보다 더 먼저 끝난 일을 말해요.',['대과거','avais','était parti','avait fini','이미 끝났었다'],[
    S('과거보다 앞선 과거','avoir·être의 반과거 + 과거분사로 만들어요. 복합과거에서 고른 조동사를 그대로 쓰되 그 조동사를 반과거로 바꿔요.'),
    T('복합과거와 대과거',['복합과거','대과거'],[['j’ai fini','j’avais fini'],['elle est partie','elle était partie'],['nous avons vu','nous avions vu'],['ils se sont levés','ils s’étaient levés']]),
    S('기준이 되는 과거가 있어요','그때 이미 끝나 있었음을 나타내요. 한국어의 “~했었다”라는 어미 하나만으로 시제를 결정하지 말고 두 사건의 순서를 봐요.',[['Quand je suis arrivé, elle était déjà partie.','내가 도착했을 때 그녀는 이미 떠난 뒤였어. (남성 화자)'],['J’avais fini avant son arrivée.','그가·그녀가 도착하기 전에 나는 끝낸 상태였어.']]),
    S('부정과 일치는 유지해요','ne … pas는 조동사를 감싸요. être 동사나 앞선 직접목적어에 따른 과거분사 일치 규칙도 그대로 적용돼요.',[['Elles n’étaient pas encore arrivées.','그녀들은 아직 도착하지 않은 상태였어.']])]),
  A('conditional-past','tenses','조건법 과거','conditionnel passé','실현되지 않은 과거와 그 결과, 아쉬움을 말해요.',['aurais','serais allé','후회','했을텐데','si j’avais su'],[
    S('조건법 조동사 + 과거분사','avoir·être를 조건법 현재로 바꾸고 과거분사를 붙여요. aurais fini, serais parti처럼 만들어요.'),
    T('주어별 조동사',['주어','avoir / être'],[['je / tu','aurais / serais'],['il / elle / on','aurait / serait'],['nous','aurions / serions'],['vous','auriez / seriez'],['ils / elles','auraient / seraient']]),
    S('실현되지 않은 과거의 조건','si + 대과거가 조건, 조건법 과거가 결과예요. 이 조건 구문의 si절에 Si j’aurais su라고 쓰지 않아요.',[['Si j’avais su, je serais venu.','알았더라면 왔을 텐데. (남성 화자)'],['Si elle avait étudié, elle aurait réussi.','그녀가 공부했더라면 성공했을 텐데.']]),
    S('아쉬움과 확인되지 않은 정보','J’aurais voulu는 그러고 싶었지만 이루지 못한 바람에 쓸 수 있어요. 보도에서는 확인되지 않은 과거 정보를 나타내기도 하므로 항상 후회로 번역하지 않아요.',[['J’aurais voulu rester plus longtemps.','나는 더 오래 머물고 싶었어.'],['Le train aurait quitté la gare.','기차가 역을 떠났다고 해. (미확인 정보)']])]),
  A('future-perfect','tenses','미래완료','futur antérieur','미래의 어느 시점까지 완료될 일을 말해요.',['aurai fini','sera parti','futur antérieur','미래완료'],[
    S('미래형 조동사 + 과거분사','avoir·être의 단순미래 + 과거분사예요. aurai fini, sera partie처럼 써요. 미래의 기준 시점에 완료돼 있을 일을 나타내요.'),
    T('두 조동사 비교',['avoir','être'],[['j’aurai fini','je serai parti / partie'],['nous aurons fini','nous serons partis / parties'],['elles auront fini','elles seront parties']]),
    S('먼저 끝내고 그다음에','미래의 두 사건을 말할 때 먼저 완료될 일에 미래완료를 쓸 수 있어요. quand 뒤라고 언제나 현재형을 쓰는 것은 아니에요.',[['Quand j’aurai fini, je t’appellerai.','내가 끝내고 나면 너에게 전화할게.'],['Demain soir, elle sera arrivée.','내일 저녁이면 그녀는 도착해 있을 거야.']]),
    S('지난 일의 추측으로도 써요','문맥에 따라 이미 일어난 일을 추측할 수 있어요. 형태의 이름만 보고 항상 미래로 번역하지 않아요.',[['Il aura oublié notre rendez-vous.','그는 우리 약속을 잊어버렸나 봐.']])]),
  A('past-subjunctive','tenses','접속법 과거','subjonctif passé','접속법이 필요한 자리에서 이미 완료된 일을 표현해요.',['aie fini','soit venue','ayons','접속법 과거'],[
    S('접속법 조동사 + 과거분사','avoir·être의 접속법 현재 + 과거분사로 만들어요. 접속법이 필요한 이유와 완료 여부를 따로 생각해요.'),
    T('조동사 형태',['주어','avoir / être'],[['que j’ / que je','aie / sois'],['que tu','aies / sois'],['qu’il / qu’elle','ait / soit'],['que nous','ayons / soyons'],['que vous','ayez / soyez'],['qu’ils / qu’elles','aient / soient']]),
    S('현재와 과거 비교','venir와 être venu처럼 완료 여부가 달라져요. 주절이 현재여도 그보다 먼저 끝난 일을 말할 수 있어요.',[['Je suis content que tu viennes.','네가 와서·온다니 나는 기뻐. (남성 화자)'],['Je suis content que tu sois venu.','네가 와 준 것이 나는 기뻐. (남성 화자·남성 청자)']]),
    S('미래의 마감까지 끝내야 할 때도','이름은 과거지만 미래의 기준 시점 전에 완료돼야 하는 일에도 쓸 수 있어요. être를 쓰면 성·수 일치를 확인해요.',[['Il faut que tu aies fini avant midi.','너는 정오 전에 끝내 놓아야 해.'],['Je suis heureuse qu’elles soient arrivées.','그녀들이 도착해서 나는 기뻐. (여성 화자)']])]),
  A('literary-past','tenses','글에서 만나는 단순과거·전과거','passé simple et passé antérieur','이야기·문학에서 보이는 과거 형태를 알아봐요.',['문어체','단순과거','전과거','fut','eut','alla','vint','passé simple'],[
    S('이야기를 진행하는 단순과거','주로 글에서 완료된 사건을 이어 서술할 때 써요. 일상 대화에서는 같은 사건을 복합과거로 말하는 경우가 많아요. 오래전 일이라서 무조건 단순과거인 것은 아니에요.'),
    T('parler의 여섯 인칭',['주어','단순과거'],[['je','parlai'],['tu','parlas'],['il / elle','parla'],['nous','parlâmes'],['vous','parlâtes'],['ils / elles','parlèrent']]),
    T('자주 보이는 불규칙형',['원형','il / ils'],[['être','fut / furent'],['avoir','eut / eurent'],['faire','fit / firent'],['venir','vint / vinrent'],['prendre','prit / prirent']]),
    S('전과거는 그보다 먼저 완료된 일','avoir·être의 단순과거 + 과거분사예요. 주로 문어체에서 après que·dès que·quand 등과 함께 뒤의 사건보다 먼저 끝난 일을 나타내요.',[['Dès qu’il eut fini, il sortit.','그는 끝내자마자 밖으로 나갔다.']]),
    S('실용 회화에서는','회화에서는 Il a fini, puis il est sorti처럼 말할 수 있어요. 문학에서 보이는 접속법 반과거(imparfait du subjonctif)·접속법 대과거(plus-que-parfait du subjonctif)는 여기의 직설법 과거와 다른 형태예요.')]),
  A('indirect-objects','connections','간접목적어 대명사','pronoms compléments indirects','누구에게 하는 행동인지 짧게 받아요.',['lui','leur','COI','me','te','nous','vous','간접목적어'],[
    S('동사의 연결부터 봐요','parler à·téléphoner à·donner quelque chose à처럼 à로 연결된 사람을 받을 때 lui·leur를 쓰는 동사가 있어요. 한국어의 “~에게”만 보고 자동으로 결정하지 않아요.'),
    T('누구에게?',['대상','대명사'],[['나에게','me / m’'],['너에게','te / t’'],['그에게·그녀에게','lui'],['우리에게','nous'],['당신에게·여러분에게','vous'],['그들에게·그녀들에게','leur']]),
    S('위치와 수','lui는 남녀 모두 한 사람, leur는 여러 사람을 받아요. 동사 앞에 두고 leur에는 복수 s를 붙이지 않아요. 원형의 대상이면 원형 앞에 놓아요.',[['Je lui téléphone.','나는 그에게·그녀에게 전화해.'],['Je veux leur parler.','나는 그들에게 말하고 싶어.'],['Je ne lui ai pas répondu.','나는 그에게·그녀에게 대답하지 않았어.']]),
    S('모든 à + 사람이 lui는 아니에요','penser à quelqu’un은 penser à lui·elle처럼 강세형을 쓰고, 사물에 대한 penser à는 y로 받을 수 있어요. 동사의 구조와 대상을 함께 확인해요.',[['Je pense à elle.','나는 그녀를 생각해.'],['Je pense à ce problème. → J’y pense.','나는 이 문제를 생각해. → 나는 그것을 생각해.']])]),
  A('pronoun-order','connections','목적어 대명사의 배열 순서','ordre des pronoms compléments','대명사가 두 개 이상이면 정해진 자리를 따라 놓아요.',['le lui','me le','leur en','l’y','대명사 순서','double pronom'],[
    T('일반적인 동사 앞 순서',['순서','형태'],[['1','me · te · se · nous · vous'],['2','le · la · les'],['3','lui · leur'],['4','y'],['5','en']]),
    S('모든 칸을 채우는 것은 아니에요','필요한 대명사만 골라 이 순서대로 놓아요. 사람과 사물 중 무엇을 받는지도 확인해요.',[['Je le lui donne.','나는 그것을 그에게·그녀에게 줘.'],['Il me le donne.','그는 그것을 나에게 줘.'],['Je leur en donne deux.','나는 그들에게 그것을 두 개 줘.']]),
    S('부정과 원형 앞','ne 뒤에서 같은 순서를 유지하고, 해당 대상을 받는 동사원형이 있으면 그 앞에 붙여요.',[['Je ne le lui donne pas.','나는 그것을 그에게·그녀에게 주지 않아.'],['Je vais le lui donner.','나는 그것을 그에게·그녀에게 줄 거야.']]),
    S('긍정 명령은 별도 순서','긍정 명령에서는 동사 뒤에 le·la·les → moi·toi·lui·nous·vous·leur → y → en 순서로 놓고 하이픈으로 이어요. 부정 명령은 일반 순서로 돌아가요.',[['Donne-le-moi.','그것을 나에게 줘.'],['Ne me le donne pas.','그것을 나에게 주지 마.'],['Donnez-leur-en.','그들에게 그것을 좀 주세요.']])]),
  A('stressed-pronouns','connections','강세형 인칭대명사','pronoms personnels toniques','전치사 뒤나 강조·대조에서 사람을 나타내요.',['moi','toi','lui','elle','eux','elles','강세형'],[
    T('주격과 강세형',['주격대명사','강세형'],[['je','moi'],['tu','toi'],['il','lui'],['elle','elle'],['nous','nous'],['vous','vous'],['ils','eux'],['elles','elles']]),
    S('전치사 뒤와 짧은 답','avec·chez·pour 등의 뒤에서 쓰고, 누가 하겠냐는 질문에 Moi !처럼 홀로 답할 수도 있어요.',[['Je viens avec toi.','나는 너와 함께 갈게·올게.'],['Nous allons chez eux.','우리는 그들 집에 가.'],['C’est pour elle.','이것은 그녀를 위한 거야.']]),
    S('강조·대조할 때','주어를 강조하거나 둘을 비교할 때 써요. 강조만 하고 동사를 활용할 주격대명사를 함께 쓰는 구조가 흔해요.',[['Moi, je préfère rester.','나는 말이야, 머무는 편이 좋아.'],['Elle est plus grande que moi.','그녀는 나보다 키가 커.']]),
    S('lui가 같은 모양이어도','Je lui parle의 lui는 동사 앞 간접목적어 대명사, avec lui의 lui는 전치사 뒤 강세형이에요. 모양만 보고 역할이 같다고 생각하지 않아요.',[['Je parle avec lui.','나는 그와 이야기해.']])]),
  A('possessive-pronouns','connections','소유대명사','pronoms possessifs','명사를 반복하지 않고 나의 것·너의 것으로 받아요.',['le mien','la mienne','les miens','le tien','le sien','le nôtre','le vôtre','le leur'],[
    S('소유형용사와 구별','mon livre는 명사가 있고 le mien은 그 명사를 대신해요. 받는 명사의 성·수와 주인이 누구인지를 함께 봐요.',[['C’est mon livre. C’est le mien.','이건 내 책이야. 내 것이야.']]),
    T('주인별 형태',['주인','남성 단수 / 여성 단수 / 남성 복수 / 여성 복수'],[['나','le mien / la mienne / les miens / les miennes'],['너','le tien / la tienne / les tiens / les tiennes'],['그·그녀','le sien / la sienne / les siens / les siennes'],['우리','le nôtre / la nôtre / les nôtres / les nôtres'],['당신·여러분','le vôtre / la vôtre / les vôtres / les vôtres'],['그들·그녀들','le leur / la leur / les leurs / les leurs']]),
    S('관사와 악센트를 포함해요','우리 것·여러분 것의 nôtre·vôtre에는 ô가 있어요. 소유형용사 notre·votre와 구별해요. à·de와 정관사가 만나면 au mien·du mien처럼 합쳐져요.',[['Ma voiture est petite. La tienne est grande.','내 차는 작아. 네 차는 커.'],['Je pense à mon avenir et au tien.','나는 내 미래와 네 미래를 생각해.']])]),
  A('demonstrative-pronouns','connections','지시대명사','pronoms démonstratifs','앞서 나온 명사나 상황을 이것·저것으로 받아요.',['celui','celle','ceux','celles','ceci','cela','ça','celui-ci'],[
    T('명사의 성·수에 따라',['받는 명사','형태'],[['남성 단수','celui'],['여성 단수','celle'],['남성 복수','ceux'],['여성 복수','celles']]),
    S('명사를 빼고 받는 형태','celui·celle 등은 보통 -ci·-là, de로 시작하는 말, 관계절 등의 설명과 함께 써요.',[['Je prends celui-ci.','나는 이것으로 할게. (남성 명사)'],['Ma chambre est plus petite que celle de Paul.','내 방은 폴의 방보다 작아.'],['J’aime ceux qui écoutent.','나는 귀 기울여 듣는 사람들을 좋아해.']]),
    S('상황 전체는 ceci·cela·ça','특정 성·수를 가진 명사 대신 말이나 상황 전체를 받을 수 있어요. ça는 일상 대화에서 자주 써요.',[['Ça me plaît.','나는 그것이 마음에 들어.'],['Cela dépend.','그건 경우에 따라 달라.']]),
    S('c’est와 il est','대상을 소개하며 명사구를 붙이면 c’est가 흔하고, 이미 나온 사람의 성질이나 무관사 직업은 il·elle est가 흔해요. 문맥에 따라 선택이 달라요.',[['C’est un médecin. Il est médecin.','그분은 의사야. 그는 의사야.']])]),
  A('relative-dont-ou','connections','관계대명사 dont와 où','pronoms relatifs dont et où','de로 연결된 관계와 장소·시간의 관계를 구분해요.',['dont','où','le jour où','avoir besoin de','관계대명사'],[
    S('dont는 de의 관계를 받아요','parler de·avoir besoin de 같은 동사의 연결이나 명사 사이의 소유·연관을 받을 수 있어요. 앞 명사와 관계절 안의 빈자리를 이어 봐요.',[['C’est le livre dont j’ai besoin.','이것은 내가 필요한 책이야.'],['Je connais une femme dont le fils habite ici.','나는 아들이 여기에 사는 여성을 알아.']]),
    S('de나 소유표현을 중복하지 않아요','dont가 이미 de 관계를 맡으므로 dont j’en parle처럼 같은 관계를 en으로 다시 받지 않아요. dont le fils에서 le를 son으로 중복하지도 않아요.'),
    S('où는 장소·시간 관계','où 뒤의 절에서 장소·시간을 채워 줘요. 명사가 장소여도 동사의 직접목적어이면 que를 써요.',[['la ville où j’habite','내가 사는 도시'],['la ville que je visite','내가 방문하는 도시'],['le jour où nous sommes arrivés','우리가 도착한 날']]),
    S('à의 관계라면 dont가 아니에요','penser à ce problème는 le problème auquel je pense처럼 à에 맞는 관계대명사를 골라요.',[['C’est une question à laquelle je pense souvent.','이것은 내가 자주 생각하는 질문이야.']])]),
  A('relative-compound','connections','복합관계대명사','pronoms relatifs composés','전치사와 함께 lequel의 성·수 형태를 골라요.',['lequel','laquelle','lesquels','lesquelles','auquel','duquel','à laquelle'],[
    T('기본형과 축약형',['기본형','à와 연결 / de와 연결'],[['lequel','auquel / duquel'],['laquelle','à laquelle / de laquelle'],['lesquels','auxquels / desquels'],['lesquelles','auxquelles / desquelles']]),
    S('앞의 명사에 일치해요','전치사는 원래 관계에서 필요한 것을 유지해요. sur la table은 la table sur laquelle…처럼 연결해요.',[['La chaise sur laquelle je suis assis est confortable.','내가 앉아 있는 의자는 편안해. (남성 화자)'],['Les projets auxquels je participe sont intéressants.','내가 참여하는 프로젝트들은 흥미로워.']]),
    S('사람이면 전치사 + qui도 가능해요','사람을 받으면 avec qui·à qui 등도 써요. 사물의 전치사 뒤에서는 lequel 계열이 필요한 경우가 많아요.',[['La personne avec qui je travaille est gentille.','나와 함께 일하는 사람은 친절해.']]),
    S('단순한 de와 복합 전치사','동사가 직접 요구하는 de 관계는 보통 dont로 받아요. à côté de·près de 같은 복합 전치사 뒤에서는 duquel·de laquelle 계열을 써요.',[['La maison près de laquelle il habite est ancienne.','그가 사는 곳 가까이에 있는 그 집은 오래됐어.']])]),
  A('superlative','connections','최상급','superlatif','여럿 중 가장 ~한 대상을 말해요.',['le plus','la moins','le meilleur','le mieux','가장','최상급'],[
    S('정관사 + plus·moins','형용사의 성·수를 명사에 맞추고, 비교 범위는 de로 덧붙일 수 있어요.',[['C’est la chambre la plus calme de l’hôtel.','이것은 호텔에서 가장 조용한 방이야.'],['C’est le billet le moins cher.','이것은 가장 싼 표야.']]),
    T('비교급에서 최상급으로',['비교급','최상급'],[['plus grand','le plus grand / la plus grande'],['moins cher','le moins cher / la moins chère'],['meilleur','le meilleur / la meilleure'],['mieux','le mieux']]),
    S('bon과 bien은 다르게','명사나 대상의 좋음에는 meilleur를 성·수에 맞추고, 동작의 잘함에는 le mieux를 써요.',[['C’est la meilleure solution.','이것은 가장 좋은 해결책이야.'],['C’est elle qui chante le mieux.','가장 노래를 잘하는 사람은 그녀야.']]),
    S('형용사 위치도 확인해요','명사 앞 형용사는 le plus petit village처럼, 뒤 형용사는 le village le plus calme처럼 쓸 수 있어요. 소유형용사가 있으면 mon meilleur ami처럼 표현하기도 해요.',[['Ce sont mes meilleurs amis.','이들은 나의 가장 친한 친구들이야.']])]),
  A('passive','connections','수동태','voix passive','행동을 받는 대상을 주어로 놓아요.',['수동','능동','être écrit','par','passif'],[
    S('être + 과거분사','직접목적어가 있는 능동 문장을 바꿀 때 그 대상을 주어로 삼고, être를 필요한 시제로 활용해요. 과거분사는 수동태 주어의 성·수에 맞춰요.',[['Paul écrit la lettre.','폴이 그 편지를 써.'],['La lettre est écrite par Paul.','그 편지는 폴에 의해 쓰여.']]),
    T('être의 시제가 달라져요',['시제','수동 표현'],[['현재','La porte est fermée.'],['복합과거','La porte a été fermée.'],['미래','La porte sera fermée.']]),
    S('행위자는 par로, 필요하면 생략','누가 했는지 말하려면 보통 par를 붙여요. 중요하지 않거나 모르면 생략할 수 있어요. aimer·connaître 같은 동사는 문맥에 따라 de를 쓰기도 해요.',[['Ce livre a été traduit en coréen.','이 책은 한국어로 번역됐어.'],['Elle est aimée de tous.','그녀는 모두에게 사랑받아.']]),
    S('상태인지 사건인지 문맥을 봐요','La porte est fermée는 닫힌 상태를 말할 수도 있어요. 모든 être + 과거분사가 같은 종류의 수동 사건은 아니에요. 일상에서는 주어 on으로 자연스럽게 말하는 방법도 있어요.',[['On parle français ici.','여기서는 프랑스어를 써.']])]),
  A('reported-speech','connections','간접화법과 시제 일치','discours indirect et concordance des temps','남의 말을 내 문장 안으로 옮겨 전해요.',['간접화법','직접화법','discours rapporté','시제 일치','le lendemain'],[
    S('말을 그대로 인용하거나 전해요','직접화법은 말을 따옴표로 인용해요. 간접화법은 dire que·demander si처럼 문장에 넣고 인칭·소유표현을 말하는 상황에 맞춰 바꿔요.',[['Elle dit : « Je suis prête. » → Elle dit qu’elle est prête.','그녀는 “난 준비됐어”라고 말해. → 그녀는 자신이 준비됐다고 말해.']]),
    T('전달 동사가 과거일 때의 대표 변화',['원래 말의 시제','전달할 때'],[['현재','반과거'],['복합과거','대과거'],['단순미래','조건법 현재'],['미래완료','조건법 과거']]),
    S('과거에서 본 미래','과거에 한 말의 미래는 조건법으로 전할 수 있어요. 여전히 유효한 일반 사실은 현재를 유지하기도 하므로 기계적으로 모든 시제를 바꾸지는 않아요.',[['Il a dit : « Je viendrai. » → Il a dit qu’il viendrait.','그는 “갈게·올게”라고 말했어. → 그는 오겠다고 말했어.'],['Elle a dit qu’elle avait fini.','그녀는 끝냈다고 말했어.']]),
    S('질문·명령 전달','예·아니요 질문은 si, 의문사 질문은 그 의문사를 써요. 간접의문에서는 직접 질문의 도치를 그대로 옮기지 않아요. 부탁·명령은 demander de + 원형 등으로 전해요.',[['Il me demande si je viens.','그는 내가 오는지 물어봐.'],['Elle demande où tu habites.','그녀는 네가 어디 사는지 물어봐.'],['Il me demande de partir.','그는 나에게 떠나 달라고 해.']]),
    S('시간과 장소도 기준에 맞춰요','전달하는 시점·장소가 달라지면 demain → le lendemain, hier → la veille, ici → là 같은 변화가 필요할 수 있어요. 같은 날 같은 장소에서 전하면 그대로 유지할 수도 있어요.')]),
  A('gerund','connections','제롱디프','gérondif','같은 사람이 하는 두 행동을 ~하면서·~해서로 연결해요.',['gérondif','gerondif','jerondif','동명사','en parlant','en faisant','en marchant'],[
    S('en + 현재분사','동사의 nous 현재형에서 -ons를 빼고 -ant를 붙인 뒤 en을 앞에 놓아요. être → étant, avoir → ayant, savoir → sachant는 예외예요. 한국어 교재에서 동명사라고도 부르지만 영어의 동명사와 쓰임이 같지는 않아요.'),
    T('형태 만들기',['nous 현재형','제롱디프'],[['nous parlons','en parlant'],['nous finissons','en finissant'],['nous faisons','en faisant'],['nous mangeons','en mangeant'],['nous prenons','en prenant'],['nous allons','en allant']]),
    S('동시 행동·방법·조건','문맥에 따라 ~하면서, ~함으로써, ~하면으로 해석해요. 형태 자체는 성·수에 따라 바뀌지 않아요.',[['J’écoute de la musique en cuisinant.','나는 요리하면서 음악을 들어.'],['On apprend en pratiquant.','우리는 연습하면서 배워.'],['En partant tôt, tu arriveras à l’heure.','일찍 출발하면 제시간에 도착할 거야.']]),
    S('누가 하는 행동인지 같아야 해요','기본적으로 제롱디프의 행동 주체는 주절의 주어와 같아야 해요. 주체가 다르면 quand·pendant que 같은 절로 풀어 쓰는 편이 명확해요.',[['En rentrant, j’ai rencontré Paul.','나는 돌아오는 길에 폴을 만났어.'],['Quand je suis rentré, Paul cuisinait.','내가 돌아왔을 때 폴은 요리 중이었어. (남성 화자)']]),
    S('현재분사와 구별','en 없이 쓰는 parlant은 현재분사로 다른 구조에 쓰일 수 있어요. tout en은 동시성이나 양보의 뜻을 강조할 수 있어요.',[['Il travaille tout en écoutant la radio.','그는 라디오를 들으면서 일해.']])]),
  A('present-participle','connections','현재분사와 형용사적 분사','participe présent et adjectif verbal','-ant 형태가 행동인지 성질인지 구분해요.',['participe présent','adjectif verbal','parlant','fatigant','fatiguant','현재분사'],[
    S('현재분사는 동사의 성격','행동을 표현하고 목적어·부사를 받을 수 있어요. 성·수에 따라 일치시키지 않아요. en을 앞에 붙인 제롱디프와 구조를 구별해요.',[['des étudiants parlant français','프랑스어를 말하는 학생들'],['une personne sachant conduire','운전할 줄 아는 사람']]),
    T('만드는 방법과 예외',['출발 형태','현재분사'],[['nous lisons','lisant'],['nous finissons','finissant'],['nous commençons','commençant'],['être','étant'],['avoir','ayant'],['savoir','sachant']]),
    S('형용사적 분사는 성질을 설명','형용사처럼 쓰이면 명사의 성·수에 일치해요. 철자도 다른 쌍이 있으므로 뜻과 문장 역할을 확인해요.',[['des histoires intéressantes','흥미로운 이야기들'],['des enfants fatiguant leurs parents','부모를 지치게 하는 아이들 (행동)'],['des enfants fatigants','피곤하게 만드는 아이들 (성질)']]),
    S('관계절로 풀어 볼 수 있어요','명사를 설명하는 현재분사는 qui절로 바꾸어 의미를 확인할 수 있어요. 독립된 분사구문 등 모든 형태를 제롱디프의 같은 주어 규칙으로 처리하지 않아요.',[['les personnes attendant ici → les personnes qui attendent ici','여기서 기다리는 사람들']])]),
  A('subordinating-conjunctions','connections','목적·시간·양보의 접속사','conjonctions de subordination','어떤 관계로 잇는지에 따라 뒤의 동사 형태를 골라요.',['pour que','afin que','avant que','après que','bien que','sans que','pendant que','jusqu’à ce que'],[
    T('접속사와 대표적인 법',['접속사','뜻과 뒤의 형태'],[['pour que / afin que','~하도록 → 접속법'],['avant que','~하기 전에 → 접속법'],['bien que','~이지만 → 접속법'],['sans que','~하지 않은 채 → 접속법'],['jusqu’à ce que','~할 때까지 → 접속법'],['après que','~한 후에 → 표준 문법에서는 직설법'],['pendant que / parce que','~하는 동안 / ~이므로 → 직설법']]),
    S('주어가 같으면 원형으로 간단히','목적의 주어가 같으면 pour + 원형, 다르면 pour que + 주어 + 접속법으로 표현할 수 있어요.',[['Je travaille pour réussir.','나는 성공하려고 일해.'],['Je parle lentement pour que tu comprennes.','네가 이해하도록 나는 천천히 말해.']]),
    S('avant와 après를 구별','avant de + 원형, après avoir·être + 과거분사로 같은 주어의 앞뒤 행동을 연결할 수 있어요. après que 뒤의 표준 형태는 직설법이에요.',[['Après avoir mangé, je suis sorti.','먹은 뒤 나는 밖으로 나갔어. (남성 화자)'],['Je partirai après qu’il aura fini.','그가 끝낸 뒤 나는 떠날 거야.']]),
    S('ne가 항상 부정은 아니에요','avant que 등 뒤에 문어적인 ne explétif가 쓰이기도 해요. 이 ne만으로 “~하지 않다”라고 해석하지 않아요. pas가 있는 실제 부정과 구별해요.',[['Je partirai avant qu’il ne revienne.','그가 돌아오기 전에 나는 떠날 거야.']])])
];
