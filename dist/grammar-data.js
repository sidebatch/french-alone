import {miniLessons,questionLessonIds} from './practice-lessons.js';
import {extraGrammarArticles} from './grammar-extra-data.js';
import {existingArticleTerms} from './grammar-terms.js';
import {referenceBasics} from './grammar-reference-basics.js';
import {referenceVerbs} from './grammar-reference-verbs.js';
import {referenceSyntax} from './grammar-reference-syntax.js';

export const grammarCategories=[{id:'basics',title:'문장의 기본'},{id:'verbs',title:'동사와 표현'},{id:'tenses',title:'시제와 가정'},{id:'connections',title:'대명사와 연결'}];
const S=(title,text,examples=[])=>({title,paragraphs:Array.isArray(text)?text:[text],examples});
const T=(title,headers,rows)=>({title,table:{headers,rows}});
const F=id=>T(miniLessons[id].title,miniLessons[id].headers||['말·상황','형태·표현'],miniLessons[id].forms);
const A=(id,category,title,fr,summary,aliases,lessonIds,sections)=>({id,category,title,fr,summary,aliases,lessonIds,sections});

const coreGrammarArticles=[
  A('etre','verbs','être · 상태와 위치','être','누구인지, 어떤 상태인지, 어디에 있는지 말해요.',['suis','es','est','sommes','êtes','sont','있다','이다'],['etrePresent','homeLocation'],[
    S('상태·정체·위치','être 뒤에 형용사, 신분을 나타내는 말, 장소를 붙일 수 있어요. 주어에 따라 동사를 바꿔요.',[['Je suis prêt.','나는 준비됐어.'],['Elle est à la maison.','그녀는 집에 있어.']]),F('etrePresent'),
    S('형용사와 장소는 다르게 다뤄요','형용사는 주어의 성·수에 맞추지만 à la maison 같은 장소 표현은 그대로예요.',[['Ils sont prêts.','그들은 준비됐어.'],['Elles sont à la maison.','그녀들은 집에 있어.']]),
    S('다른 시제에서는','être의 과거분사는 été지만 être 자체의 복합과거에는 avoir를 써요. 반과거는 ét-, 미래는 ser-에서 만들어요.',[['J’ai été malade.','나는 아팠어.'],['J’étais ici.','나는 여기에 있었어.'],['Je serai ici.','나는 여기에 있을 거야.']])]),
  A('avoir','verbs','avoir · 소유','avoir','가진 것과 나이를 말하고, 복합과거도 만들어요.',['ai','as','a','avons','avez','ont','가지다','있어'],['avoirPresent'],[
    S('가진 것 말하기','avoir 뒤에 가진 물건을 놓아요. “어디에 있다”의 être와 구분해요.',[['J’ai un livre.','나는 책 한 권이 있어.'],['Le livre est ici.','그 책은 여기에 있어.']]),F('avoirPresent'),
    S('나이와 몸 상태','나이·배고픔·목마름에는 프랑스어에서 avoir를 써요.',[['J’ai vingt ans.','나는 스무 살이야.'],['J’ai faim.','나는 배고파.'],['J’ai soif.','나는 목말라.']]),
    S('본동사와 조동사','J’ai un livre에서 ai는 소유를 나타내는 동사예요. J’ai lu에서는 과거분사 lu와 함께 과거를 만드는 조동사예요.',[['J’ai lu ce livre.','나는 이 책을 읽었어.'],['Je n’ai pas de livre.','나는 책이 없어.']])]),
  A('aller','verbs','aller · 이동과 가까운 미래','aller','목적지에 가거나, 앞으로 할 일을 말해요.',['vais','vas','va','allons','allez','vont','가다','갈거야'],['allerPresent'],[
    S('aller + 장소','aller 뒤에 목적지를 붙이면 이동이에요. 도시는 보통 à, 명사가 있는 장소는 à la·au·à l’ 등을 써요.',[['Je vais à Paris.','나는 파리에 가.'],['Nous allons au café.','우리는 카페에 가.']]),F('allerPresent'),
    S('aller + 동사원형','활용된 aller 뒤에 동사원형을 붙이면 근접미래를 만들어요. 가까운 계획이나 앞으로 일어날 일을 표현해요.',[['Je vais manger.','나는 먹을 거야.'],['Elle va travailler.','그녀는 일할 거야.']]),
    S('과거와 미래의 불규칙형','aller는 -er로 끝나지만 현재형이 불규칙해요. 복합과거는 être + allé, 단순미래는 ir-를 써요.',[['Je suis allé à Paris.','나는 파리에 갔어. (남성 화자)'],['J’irai à Paris.','나는 파리에 갈 거야.']])]),
  A('vouloir','verbs','vouloir · 바람','vouloir','원하는 것과 하고 싶은 행동을 표현해요.',['veux','veut','voulons','voulez','veulent','원하다','하고싶다'],['vouloir'],[
    S('원하는 것이 물건인지 행동인지','물건이면 명사를, 행동이면 동사원형을 붙여요.',[['Je veux un livre.','나는 책 한 권을 원해.'],['Je veux dormir.','나는 자고 싶어.']]),F('vouloir'),
    S('부정과 정중한 요청','원하지 않으면 ne veux pas, 정중하게 부탁하면 voudrais를 사용할 수 있어요.',[['Je ne veux pas partir.','나는 떠나고 싶지 않아.'],['Je voudrais un café.','커피 한 잔 주세요.']]),
    S('다른 사람의 행동을 바랄 때','“나는 네가 오기를 원한다”처럼 행동의 주어가 달라지면 que 뒤에 주어와 접속법을 써요.',[['Je veux venir.','나는 오고 싶어.'],['Je veux que tu viennes.','나는 네가 오기를 원해.']])]),
  A('pouvoir','verbs','pouvoir · 가능','pouvoir','할 수 있는 일과 허락을 물어요.',['peux','peut','pouvons','pouvez','peuvent','할수있다','가능'],['pouvoir'],[
    S('가능한 행동은 동사원형으로','pouvoir만 주어에 맞춰 바꾸고 뒤의 행동은 원형을 써요. 사이에 à나 de는 넣지 않아요.',[['Je peux attendre.','나는 기다릴 수 있어.'],['Vous pouvez entrer.','들어오셔도 됩니다.']]),F('pouvoir'),
    S('허락·부탁과 부정','질문으로 쓰면 허락이나 도움을 요청할 수 있어요. ne … pas는 활용된 pouvoir를 감싸요.',[['Je peux essayer ?','입어 봐도 될까요?'],['Pouvez-vous répéter ?','다시 말씀해 주시겠어요?'],['Je ne peux pas venir.','나는 올 수 없어.']]),
    S('시간을 바꾸면','과거분사는 pu, 미래 어간은 pourr-예요. pourrais는 미래가 아니라 조건법으로, 더 조심스러운 부탁에도 써요.',[['J’ai pu venir.','나는 올 수 있었어.'],['Je pourrai venir.','나는 올 수 있을 거야.'],['Pourriez-vous m’aider ?','저를 도와주실 수 있을까요?']])]),
  A('aimer','verbs','aimer · 좋아하는 것','aimer','활동과 대상을 좋아하는 정도를 말해요.',['aime','aimes','aimons','aimez','aiment','좋아하다','beaucoup'],['aimer','beaucoup'],[
    S('활동에는 원형, 대상에는 명사','좋아하는 활동은 동사원형으로, 일반적인 취향의 대상은 보통 정관사와 함께 말해요.',[['J’aime lire.','나는 읽는 걸 좋아해.'],['J’aime le café.','나는 커피를 좋아해.']]),T('aimer 현재형',['주어','형태'],[['j’','aime'],['tu','aimes'],['il / elle','aime'],['nous','aimons'],['vous','aimez'],['ils / elles','aiment']]),
    S('정도와 부정','beaucoup는 많이 좋아한다는 뜻을 더해요. 부정문에서는 Je n’aime pas로 쓰고, 일반적인 취향의 le·la·les는 유지해요.',[['J’aime beaucoup marcher.','나는 걷는 걸 아주 좋아해.'],['Je n’aime pas le café.','나는 커피를 좋아하지 않아.']]),
    S('모음 앞의 줄임','Je aime는 J’aime, ne aime는 n’aime예요. 부정문에서는 n’가 동사 앞에 있으므로 주어는 Je로 써요.',[['J’aime cuisiner.','나는 요리하는 걸 좋아해.'],['Je n’aime pas cuisiner.','나는 요리하는 걸 좋아하지 않아.']])]),
  A('infinitive','basics','동사원형','L’infinitif','행동의 이름과 주어에 맞춘 동사를 구분해요.',['원형','dormir','attendre','essayer','rester','lire','dessiner','continuer','recommencer'],['dormir','rester','continuer','attendre','essayer','recommencer','lire','dessiner'],[
    S('행동의 이름','사전에서 찾는 동사의 기본형을 동사원형이라고 해요. 문장에서 실제로 행동하는 주어에 맞춰 바뀐 형태와 달라요.',[['dormir → Je dors.','자다 → 나는 잔다.'],['lire → Je lis.','읽다 → 나는 읽는다.']]),T('원형과 현재형',['동사원형','je의 현재형'],[['dormir','je dors'],['attendre','j’attends'],['lire','je lis'],['rester','je reste'],['essayer','j’essaie / j’essaye'],['dessiner','je dessine']]),
    S('두 동사가 이어질 때','veux·peux·aime 뒤의 행동은 원형으로 남겨요. 앞 동사만 주어에 맞춰 활용해요.',[['Je veux rester ici.','나는 여기 머물고 싶어.'],['Tu peux recommencer.','너는 다시 시작할 수 있어.'],['J’aime dessiner.','나는 그림 그리는 걸 좋아해.']]),
    S('전치사가 필요한 표현','모든 동사가 원형을 바로 받지는 않아요. avoir besoin de처럼 de가 표현에 포함된 경우에는 유지해요.',[['J’ai besoin de dormir.','나는 잘 필요가 있어.'],['Je veux dormir.','나는 자고 싶어.']])]),
  A('negation','basics','부정문','ne … pas','~하지 않는다, ~이 아니다를 표현해요.',['부정','ne pas','n’aime','없다','않다','싫어'],['wantNegative','canNegative','likeNegative','etreNegative','allerNegative'],[
    S('활용된 동사 앞뒤','기본 부정문은 ne + 활용된 동사 + pas예요. 뒤에 동사원형이 있으면 그 원형은 pas 뒤에 놓아요.',[['Je ne veux pas partir.','나는 떠나고 싶지 않아.'],['Je ne suis pas ici.','나는 여기에 있지 않아.']]),T('긍정에서 부정으로',['긍정','부정'],[['Je peux venir.','Je ne peux pas venir.'],['J’aime lire.','Je n’aime pas lire.'],['Je le lis.','Je ne le lis pas.'],['J’ai vu ce film.','Je n’ai pas vu ce film.']]),
    S('ne가 n’로 줄 때','동사가 모음이나 무음 h로 시작하면 ne가 n’가 돼요. 대명사가 끼면 그 다음 말에 맞춰 줄여요.',[['Je n’ai pas faim.','나는 배고프지 않아.'],['Je n’en ai pas.','나는 그것이 하나도 없어.']]),
    S('다른 부정 표현','pas 대신 plus는 “더 이상 ~않다”, jamais는 “한 번도·절대 ~않다”예요. pas encore는 “아직 ~않다”예요. 일상 구어에서는 ne를 빼기도 하지만 기본 구조는 함께 익혀요.',[['Je ne travaille plus ici.','나는 더 이상 여기서 일하지 않아.'],['Je n’ai pas encore mangé.','나는 아직 먹지 않았어.']]),
    S('아무것도·아무도','rien·personne가 같은 부정의 뜻을 맡으면 pas를 더하지 않아요. 복합과거에서 rien은 보통 과거분사 앞, 목적어 personne는 뒤에 놓아요.',[['Je n’ai rien vu.','나는 아무것도 보지 못했어.'],['Je n’ai vu personne.','나는 아무도 보지 못했어.'],['Personne n’est venu.','아무도 오지 않았어.']]),
    S('ne … que는 오직','부정이 아니라 범위를 제한하는 표현이에요. que는 제한할 말 바로 앞에 와요.',[['Je n’ai que deux livres.','나는 책이 두 권밖에 없어.'],['Je ne bois que de l’eau.','나는 물만 마셔.']])]),
  A('articles','basics','명사와 관사','un · une · le · la','명사의 성·수, 관사와 모음 앞 줄임을 살펴봐요.',['관사','명사','남성','여성','café','thé','sac','gare','musée','hôtel','un','une','les'],['sac','nounArticles','negativeDe','cafe','menuArticles','the','gare','hotel','musee'],[
    S('하나를 소개할 때와 정해진 것을 말할 때','처음 소개하는 하나에는 un·une, 이미 정해진 것에는 le·la를 써요. 성은 말하는 사람이 아니라 명사의 성이에요.',[['J’ai un livre. Le livre est ici.','책 한 권이 있어. 그 책은 여기 있어.']]),T('관사의 기본형',['종류','남성 / 여성 / 복수'],[['부정관사','un / une / des'],['정관사','le / la / les'],['모음·무음 h 앞 정관사','l’ / l’ / les'],['부분량','du / de la / de l’']]),T('명사와 함께 익히기',['남성 명사','여성 명사'],[['un sac · 가방','une question · 질문'],['un café · 커피','une salade · 샐러드'],['un thé · 차','une gare · 기차역'],['un musée · 박물관','une maison · 집'],['un hôtel · 호텔','une lettre · 편지']]),
    S('줄임과 부정','le hôtel은 l’hôtel, la aide는 l’aide로 줄어요. 가진 것이 없다고 할 때 un·une·des는 보통 de로 바뀌지만, 정관사나 être 뒤에는 그대로인 경우가 있어요.',[['Je n’ai pas de sac.','나는 가방이 없어.'],['Ce n’est pas un sac.','이건 가방이 아니야.'],['Je n’aime pas le thé.','나는 차를 좋아하지 않아.']]),
    S('수를 말할 때','대부분의 명사는 복수에 s를 붙여요. 단어 끝 모양만으로 성을 단정하지 마세요. musée는 -ée로 끝나지만 남성이에요.',[['un café → deux cafés','커피 한 잔 → 두 잔'],['une question → trois questions','질문 하나 → 세 개']])]),
  A('agreement','basics','형용사의 성·수 일치','L’accord de l’adjectif','설명하는 명사나 사람에 맞춰 형용사를 바꿔요.',['일치','prêt','prête','fatigué','fatiguée','준비','피곤'],['pret','fatigue'],[
    S('누구를 설명하는지 확인해요','être 뒤의 형용사는 주어를 설명하므로 주어의 성·수에 맞춰요. 기본적으로 여성에는 e, 복수에는 s를 더해요.',[['Il est prêt. Elle est prête.','그는 준비됐어. 그녀는 준비됐어.']]),F('pret'),F('fatigue'),
    S('항상 e를 더하는 것은 아니에요','이미 e로 끝나는 calme 같은 형용사는 여성형도 같아요. bon → bonne처럼 모양이 달라지는 형태도 따로 익혀요.',[['Il est calme. Elle est calme.','그는 차분해. 그녀는 차분해.'],['un bon livre / une bonne idée','좋은 책 / 좋은 생각']]),
    S('Je와 vous의 일치','Je는 화자에 따라 prêt·prête가 돼요. vous가 정중한 한 사람을 뜻하면 형용사는 그 한 사람의 성·수에 맞춰요.',[['Vous êtes prête.','준비되셨군요. (여성 한 사람)'],['Vous êtes prêtes.','여러분은 준비됐군요. (여성 여러 사람)']])]),
  A('places','basics','장소와 방향','à · au · ici','도시·집·가게와 여기·저기를 표현해요.',['장소','여기','집','도시','à','au','aux','maison','ici'],['ici','maison','aArticles'],[
    S('à와 정관사의 만남','à는 위치나 목적지를 나타낼 수 있어요. le와 les를 만나면 합쳐지지만 la와 l’는 그대로예요.'),F('aArticles'),
    S('도시와 장소 부사','도시는 보통 à Paris처럼 써요. ici·là는 이미 장소를 나타내므로 앞에 à를 더하지 않아요.',[['Je suis ici.','나는 여기에 있어.'],['Je vais à Paris.','나는 파리에 가.'],['Je reste à la maison.','나는 집에 머물러.']]),
    S('방향과 목적지','오른쪽은 à droite, 왼쪽은 à gauche, 직진은 tout droit예요. 사람의 집·일터는 chez + 사람으로 표현할 수 있어요.',[['C’est à droite.','오른쪽에 있어요.'],['Je vais chez Marie.','나는 마리네 집에 가.']])]),
  A('requests','verbs','정중한 요청','Je voudrais…','부탁이나 주문을 부드럽게 말해요.',['voudrais','voudriez','주문','부탁','주세요','정중'],['voudrais'],[
    S('바람을 부드럽게 표현해요','voudrais는 vouloir의 조건법 현재예요. 현재의 부탁에도 쓸 수 있으며 반드시 과거를 뜻하지 않아요.',[['Je voudrais un thé.','차 한 잔 주세요.'],['Je voudrais partir.','저는 떠나고 싶어요.']]),T('vouloir 조건법 현재',['주어','형태'],[['je / tu','voudrais'],['il / elle','voudrait'],['nous','voudrions'],['vous','voudriez'],['ils / elles','voudraient']]),
    S('메뉴와 수량 붙이기','하나면 명사의 성에 맞춰 un·une, 여러 개면 숫자와 복수 명사를 붙여요.',[['Je voudrais une salade.','샐러드 하나 주세요.'],['Je voudrais deux cafés.','커피 두 잔 주세요.']]),
    S('s’il vous plaît와 s’il te plaît','정중한 상대나 여러 사람에게는 vous, 친한 한 사람에게는 te를 써요.',[['Un café, s’il vous plaît.','커피 한 잔 주세요.'],['Aide-moi, s’il te plaît.','나를 도와줘, 부탁이야.']])]),
  A('need','verbs','필요한 것과 행동','avoir besoin de','필요, 바람, 불필요를 구분해요.',['besoin','aide','repos','필요','도움','휴식'],['besoin','aide','besoinNegative','besoinAction'],[
    S('avoir + besoin + de','avoir를 주어에 맞춰 바꾸고 besoin de는 유지해요. 필요한 물건·상태나 행동을 그 뒤에 붙여요.',[['J’ai besoin de repos.','나는 휴식이 필요해.'],['Nous avons besoin de manger.','우리는 먹을 필요가 있어.']]),T('de 뒤에 오는 말',['연결','표현'],[['모음 앞 줄임','besoin d’aide'],['동사원형','besoin de dormir'],['셀 수 있는 하나','besoin d’un stylo'],['정해진 그 책','besoin du livre → de + le livre']]),
    S('필요하지 않다고 말하기','부정문은 Je n’ai pas besoin de예요. pas는 ai 뒤에 놓고 de는 지우지 않아요.',[['Je n’ai pas besoin d’aide.','나는 도움이 필요하지 않아.']]),
    S('바람과 필요','Je veux는 하고 싶은 바람, J’ai besoin de는 필요를 표현해요. 둘 다 행동을 붙일 때는 동사원형을 써요.',[['Je veux dormir.','나는 자고 싶어.'],['J’ai besoin de dormir.','나는 잘 필요가 있어.']])]),
  A('questions','basics','위치와 질문','Où est… ?','단수·복수 질문과 질문 어순을 살펴봐요.',['où','ou','어디','질문','toilettes','화장실','물음표'],['whereSingular','toilettes'],[
    S('어디인지 묻기','단수 장소는 Où est, 복수 장소는 Où sont로 물어요. toilettes는 화장실이라는 뜻에서 보통 복수로 써요.',[['Où est la gare ?','기차역은 어디에 있나요?'],['Où sont les toilettes ?','화장실은 어디에 있나요?']]),
    S('질문을 만드는 세 가지 방식','일상에서는 평서문 어순과 질문 억양을 쓰고, est-ce que를 앞에 붙이거나 주어·동사를 도치할 수도 있어요.',[['Vous avez un sac ?','봉투 있나요?'],['Est-ce que vous avez un sac ?','봉투가 있나요?'],['Avez-vous un sac ?','봉투가 있나요?']]),
    S('où와 ou','où는 “어디”, ou는 “또는”이에요. 위치가 아니라 장소와 장소 중 하나를 고를 때는 악센트 없는 ou를 써요.',[['Où est le café ?','카페는 어디에 있나요?'],['Un café ou un thé ?','커피인가요, 차인가요?']])]),
  A('avoir-states','verbs','배고픔·갈증·더위·추위','avoir faim · soif · chaud · froid','내가 느끼는 상태와 바깥 날씨를 구분해요.',['faim','soif','chaud','froid','배고파','목말라','추워','더워'],['faim','soif'],[
    S('몸으로 느끼는 상태','이 표현들은 être가 아니라 avoir를 써요. faim·soif 앞에 관사를 넣지 않아요.'),T('기본 표현',['뜻','표현'],[['배고프다','avoir faim'],['목마르다','avoir soif'],['덥다 · 더위를 느끼다','avoir chaud'],['춥다 · 추위를 느끼다','avoir froid']]),
    S('주어와 시간을 바꾸기','avoir만 주어·시제에 맞춰 바꾸고 뒤의 말은 유지해요.',[['Tu as faim.','너는 배고파.'],['J’avais froid.','나는 추웠어.'],['Je n’ai pas soif.','나는 목마르지 않아.']]),
    S('날씨는 il fait','내가 덥다는 J’ai chaud, 날씨가 덥다는 Il fait chaud예요. 비가 온다는 별도의 동사 pleuvoir를 써요.',[['Il fait froid, mais je n’ai pas froid.','날씨는 춥지만 나는 춥지 않아.'],['Il pleut.','비가 와.']])]),
  A('compound-past','tenses','복합과거','Le passé composé','완료한 일을 조동사와 과거분사로 말해요.',['복합과거','passé composé','먹었어','봤어','했어','j’ai'],['pcAvoir','pcVoir','pcMange'],[
    S('두 부분으로 만드는 과거','avoir 또는 être의 현재형 + 과거분사로 만들어요. 완료한 사건이나 지난 일을 전할 때 사용해요.',[['J’ai mangé.','나는 먹었어.'],['Elle est partie.','그녀는 떠났어.']]),F('pcAvoir'),
    S('avoir와 être 고르기','대부분의 동사는 avoir를 쓰고, aller·arriver·partir 같은 일부 동사와 대명동사는 être를 써요. 모든 이동 동사가 être를 쓰는 것은 아니에요.',[['J’ai marché.','나는 걸었어.'],['Je suis allé à Paris.','나는 파리에 갔어. (남성 화자)']]),
    S('시간·장소와 일치','hier는 문장 앞이나 뒤에 둘 수 있어요. avoir의 과거분사는 주어가 여성·복수라고 자동으로 변하지 않아요. 직접목적어가 앞에 오면 일치 규칙을 따로 살펴봐야 해요.',[['Hier, nous avons vu ce film.','우리는 어제 이 영화를 봤어.'],['Les lettres que j’ai lues…','내가 읽은 편지들…']])]),
  A('participles','tenses','과거분사와 불규칙형','Le participe passé','원형과 과거분사, 현재형을 구별해요.',['과거분사','불규칙','vu','voir','eu','été','fait','pris','lu','regardé','fini','mangé'],['pcEr','pcIrregular','pcFini'],[
    S('과거분사는 시제의 재료예요','과거분사 하나만으로 완성된 과거 문장이 되는 것은 아니에요. 주어와 조동사를 붙여 복합과거를 만들어요.',[['voir → vu → J’ai vu ce film.','보다 → 과거분사 vu → 나는 이 영화를 봤어.']]),F('pcEr'),F('pcFini'),F('pcIrregular'),
    T('함께 익힐 불규칙형',['원형','과거분사'],[['boire','bu'],['vouloir','voulu'],['pouvoir','pu'],['savoir','su'],['venir','venu'],['écrire','écrit'],['mettre','mis'],['dire','dit']]),
    S('어미만으로 모두 만들 수 없어요','finir → fini이지만 venir → venu예요. voir의 현재형 je vois, 원형 voir, 과거분사 vu를 각각 구분해요. 과거분사의 성·수 변화는 어떤 조동사와 어떤 구조를 쓰는지에 달려 있어요.',[['Je vois ce film.','나는 이 영화를 보고 있어.'],['J’ai vu ce film.','나는 이 영화를 봤어.']])]),
  A('etre-past','tenses','être를 쓰는 과거와 일치','être + participe passé','이동 동사의 과거분사를 주어에 맞춰요.',['갔어','갔었다','allé','allée','arrivé','arrivée','parti','parties','être 과거'],['pcAlle','pcArrive','pcParti'],[
    S('주어에 맞춰 두 부분을 골라요','aller·arriver·partir는 이 뜻의 복합과거에서 être를 써요. être의 현재형을 고르고 과거분사를 주어의 성·수에 맞춰요.'),F('pcAlle'),F('pcArrive'),F('pcParti'),
    S('Je·nous·vous를 쓸 때','Je는 말하는 사람에 따라 allé·allée가 돼요. nous는 allés 또는 allées예요. 정중한 단수 vous라면 allé 또는 allée이고 여러 사람이라면 복수형이에요.'),
    S('이동이면 모두 être일까요?','marcher는 이동이어도 avoir를 써요. sortir 같은 동사는 목적어를 직접 받는지에 따라 조동사가 달라질 수 있어요. 대명동사의 과거 일치는 별도의 규칙도 있어요.',[['Elle est sortie.','그녀는 나갔어.'],['Elle a sorti son livre.','그녀는 자기 책을 꺼냈어.']])]),
  A('past-negation','tenses','과거 부정문과 아직·더 이상','ne … pas + participe passé','조동사와 과거분사 사이의 위치를 익혀요.',['과거 부정','pas encore','n’ai pas','n’est pas','아직','보지않았다'],['pcNegative','pcEncore','pcEtreNegative'],[
    S('조동사 앞뒤에 ne … pas','복합과거의 부정은 ne + 조동사 + pas + 과거분사예요. 모음 앞의 ne는 n’로 줄어요.'),F('pcNegative'),F('pcEtreNegative'),
    S('pas encore·plus·jamais','이 짧은 부정 표현들은 복합과거에서 보통 조동사 뒤, 과거분사 앞에 놓아요.',[['Je n’ai pas encore mangé.','나는 아직 먹지 않았어.'],['Je n’ai jamais vu ce film.','나는 이 영화를 한 번도 본 적 없어.'],['Je ne l’ai plus revu.','나는 그를 그 뒤로 다시 보지 못했어.']]),
    S('부정해도 일치는 유지해요','être와 쓰는 allée·parties의 e·s는 부정문에서도 유지해요. 부정 표현의 위치와 과거분사의 모양을 따로 확인해요.',[['Elles ne sont pas parties.','그녀들은 떠나지 않았어.']])]),
  A('imparfait','tenses','반과거','L’imparfait','지난 습관과 당시의 상태·진행을 표현해요.',['반과거','habitais','étais','avais','travaillions','lisais','하곤했다'],['imparfaitHabiter','imparfaitTravailler','imparfaitEtre','imparfaitLire','imparfaitAvoir'],[
    S('과거를 바라보는 방식','과거에 반복하던 습관, 당시의 상태, 진행 중이던 배경을 보여줘요. “긴 일은 무조건 반과거”라는 뜻은 아니에요.',[['Je lisais quand tu es arrivé.','네가 도착했을 때 나는 읽고 있었어. (남성 청자)']]),T('만드는 순서',['주어','반과거 어미'],[['je / tu','-ais'],['il / elle','-ait'],['nous','-ions'],['vous','-iez'],['ils / elles','-aient']]),
    T('현재 nous형에서 -ons 빼기',['출발 형태','반과거'],[['nous habitons → habit-','j’habitais'],['nous lisons → lis-','je lisais'],['nous travaillons → travaill-','nous travaillions'],['nous avons → av-','tu avais']]),F('imparfaitEtre'),
    S('철자와 예외','être는 예외적으로 ét-를 써요. manger는 je mangeais처럼 g 발음을 유지하기 위해 e가 필요하지만 nous mangions에서는 e를 쓰지 않아요.',[['Je mangeais ici tous les jours.','나는 매일 여기서 먹곤 했어.'],['Nous mangions ensemble.','우리는 함께 먹곤 했어.']])]),
  A('past-contrast','tenses','반과거와 복합과거 비교','Imparfait ou passé composé','배경과 사건을 구분해 이야기를 이어요.',['과거 시제','배경','사건','quand','dormais','cuisinais','pleuvait','그때'],['backgroundEvent','pastWeather'],[
    S('하던 일과 그때 일어난 일','반과거는 진행 중이던 배경을, 복합과거는 그때 발생한 사건을 표현할 수 있어요.',[['Je dormais quand le téléphone a sonné.','내가 자고 있을 때 전화가 울렸어.']]),F('backgroundEvent'),
    S('같은 동사도 관점에 따라','상황의 배경으로 보면 반과거, 경계가 있는 완료한 일로 보면 복합과거를 쓸 수 있어요.',[['Je travaillais ici à cette époque.','나는 그때 여기서 일하고 있었어.'],['J’ai travaillé ici pendant deux ans.','나는 여기서 2년 동안 일했어.']]),
    S('날씨도 배경이 될 수 있어요','날씨와 상태를 묘사할 때 반과거를 함께 쓸 수 있어요. 언제나 반과거여야 하는 것은 아니고, 사건의 경계와 관점이 중요해요.',[['Il pleuvait et j’étais à la maison.','비가 오고 있었고 나는 집에 있었어.'],['Il a plu toute la journée.','하루 종일 비가 왔어.']])]),
  A('future','tenses','단순미래','Le futur simple','미래 어간과 어미로 앞으로 할 일을 말해요.',['미래','aurai','irai','sera','ferons','viendrez','travaillerai','내일','할거야'],['futureTravailler','futureManger','futureAvoir','futureAller','futureEtre','futureVenir','futureFaire','futureRester','futureParler','futureNegative'],[
    S('어간 + 미래 어미','규칙적인 -er·-ir 동사는 원형에 어미를 붙여요. -re 동사는 마지막 e를 빼요. 불규칙 동사는 미래 어간을 따로 익혀요.'),T('주어별 어미',['주어','어미'],[['je / j’','-ai'],['tu','-as'],['il / elle','-a'],['nous','-ons'],['vous','-ez'],['ils / elles','-ont']]),T('자주 쓰는 미래 어간',['원형','어간 → je형'],[['avoir','aur- → j’aurai'],['être','ser- → je serai'],['aller','ir- → j’irai'],['faire','fer- → je ferai'],['venir','viendr- → je viendrai'],['pouvoir','pourr- → je pourrai'],['vouloir','voudr- → je voudrai'],['lire','lir- → je lirai']]),
    S('부정과 근접미래','ne … pas는 미래형 하나를 감싸요. aller 현재형 + 원형으로도 미래를 표현하지만 형태는 달라요.',[['Nous ne travaillerons pas demain.','우리는 내일 일하지 않을 거야.'],['Je vais partir. / Je partirai.','나는 떠날 거야. (근접미래 / 단순미래)']]),
    S('-ai와 -ais','je의 미래형은 -ai, 조건법 현재는 -ais예요. 이 차이를 보면 앞으로 할 일과 가정의 결과를 구별할 수 있어요.',[['J’irai demain.','나는 내일 갈 거야.'],['J’irais si j’avais le temps.','시간이 있다면 갈 텐데.']])]),
  A('conditions','tenses','가능한 조건','si + présent','조건이 맞으면 할 일을 이어 말해요.',['조건','si','s’il','만약','오면','비가오면','pleut'],['siPresent','siRain','siVenir','siWeather'],[
    S('가능한 앞일의 조건','si절은 현재형, 결과는 단순미래로 표현할 수 있어요. si절이 먼저 와도 나중에 와도 뜻의 관계는 같아요.',[['Si j’ai le temps, j’irai.','시간이 있으면 나는 갈 거야.'],['J’irai si j’ai le temps.','나는 시간이 있으면 갈 거야.']]),T('조건과 결과',['현재 조건','미래 결과'],[['Si tu viens','nous mangerons ensemble.'],['S’il pleut','je resterai à la maison.'],['S’il fait beau','nous marcherons.']]),
    S('si는 il·ils 앞에서 줄어요','si + il은 s’il, si + ils는 s’ils예요. 다른 모음 앞에서 무조건 줄이는 것은 아니에요.',[['S’il pleut…','비가 오면…'],['Si elle vient…','그녀가 오면…']]),
    S('결과가 언제나 미래는 아니에요','현재의 일반적인 결과나 명령을 이을 수도 있어요. “~인지”를 묻는 간접의문의 si는 조건의 si와 달라서 다른 시제도 가능해요.',[['Si tu veux, on commence.','네가 원하면 시작하자.'],['Je ne sais pas s’il viendra.','그가 올지 나는 모르겠어.']])]),
  A('conditional','tenses','가정과 조건법 현재','si + imparfait · conditionnel','상상하는 상황과 그 결과, 조언을 표현해요.',['조건법','가정','serais','irais','ferais','prendrais','lirais','내가너라면','할텐데'],['siImagined','siEtais','condLire','condEtre','condAller','condFaire','condPrendre'],[
    S('상상하는 조건과 결과','현재와 다른 상황이나 실현이 불확실한 상황을 상상할 때 si + 반과거, 결과에 조건법 현재를 쓸 수 있어요.',[['Si j’avais le temps, je voyagerais.','시간이 있다면 나는 여행할 텐데.']]),T('미래 어간 + 반과거 어미',['주어','어미'],[['je / tu','-ais'],['il / elle','-ait'],['nous','-ions'],['vous','-iez'],['ils / elles','-aient']]),F('condEtre'),F('condPrendre'),
    S('si절에 조건법을 넣지 않아요','이 조건 구문에서는 Si j’aurais가 아니라 Si j’avais예요. “내가 너라면”은 Si j’étais toi예요.',[['Si j’étais toi, je resterais ici.','내가 너라면 여기 머물 텐데.']]),
    S('조건법이 모두 가정문은 아니에요','Je voudrais 같은 정중한 요청에도 조건법 현재를 써요. 이름에 조건이 들어가도 si절이 항상 필요한 것은 아니에요.',[['Je voudrais un café.','커피 한 잔 주세요.']])]),
  A('object-pronouns','connections','목적어 대명사','le · la · les · l’','같은 대상을 반복하지 않고 받아요.',['목적어','대명사','le','la','les','l’','그것을','lire'],['directObject','objectInfinitive','objectNegative','objectElision'],[
    S('무엇을? 누구를?','전치사 없이 동사가 직접 받는 대상을 직접목적어라고 해요. 명사의 성·수에 따라 le·la·les로 바꿔요.'),F('directObject'),
    S('활용된 동사 앞, 원형 앞','단순한 문장에서는 활용된 동사 앞에 놓아요. veux·peux 뒤의 원형이 그 대상을 받으면 원형 앞에 놓아요.'),F('objectInfinitive'),F('objectNegative'),
    S('모음 앞 줄임과 간접목적어','le·la는 모음이나 무음 h 앞에서 l’로 줄지만 les는 그대로예요. “그에게·그녀에게”처럼 à와 연결된 목적어는 lui 등 다른 대명사를 쓸 수 있어요.',[['Je l’aime.','나는 그것을 좋아해.'],['Je lui parle.','나는 그에게·그녀에게 말해.']])]),
  A('y','connections','장소를 받는 y','Le pronom y','앞에 나온 장소나 à로 연결된 내용을 받아요.',['y','j’y','그곳에','그곳에서','장소대명사'],['yLocation','yInfinitive'],[
    S('앞서 나온 장소 받기','à Paris·à la maison·dans le sac 같은 장소를 y로 받을 수 있어요. y는 활용된 동사 앞에 놓아요.'),F('yLocation'),F('yInfinitive'),
    S('부정문과 다른 쓰임','부정문에서는 n’y로 연결해요. 장소 외에도 penser à quelque chose처럼 à로 연결된 사물을 받기도 해요.',[['Je n’y vais pas.','나는 그곳에 가지 않아.'],['Je pense à ce problème. → J’y pense.','나는 이 문제를 생각해. → 나는 그것을 생각해.']]),
    S('사람과 출발지는 따로 확인해요','à + 사람을 언제나 y로 바꾸는 것은 아니에요. 출발지를 나타내는 de + 장소는 en으로 받을 수 있어요.',[['Je parle à Marie. → Je lui parle.','나는 마리에게 말해. → 나는 그녀에게 말해.'],['Je viens de Paris. → J’en viens.','나는 파리에서 와. → 나는 그곳에서 와.']])]),
  A('en','connections','수량·부분량을 받는 en','Le pronom en','명사를 다시 쓰지 않고 수량이나 일부를 말해요.',['en','j’en','n’en','몇개','수량','부분량'],['enQuantity','enNegative','enPartitive'],[
    S('수량은 남겨요','두 개·세 개처럼 개수가 있는 명사를 en으로 받으면 숫자는 남겨요. 하나일 때 un·une는 받는 명사의 성에 맞춰요.'),F('enQuantity'),
    S('부분량과 de로 연결된 말','du thé·de l’eau 같은 부분량, avoir besoin de 같은 표현의 대상을 받을 수 있어요.',[['Je bois du thé. → J’en bois.','나는 차를 마셔. → 나는 그것을 마셔.'],['J’ai besoin de ce livre. → J’en ai besoin.','나는 이 책이 필요해. → 나는 그것이 필요해.']]),F('enNegative'),
    S('원형 앞에서도 써요','en이 동사원형의 대상을 받으면 그 원형 앞에 놓아요. 이미 정해진 대상 전체를 받는 le·la·les와는 의미를 구분해요.',[['Je veux en boire.','나는 그것을 좀 마시고 싶어.'],['Je le bois.','나는 그것을 마셔. (특정한 음료를)']])]),
  A('relatives','connections','명사를 설명하는 관계절','qui · que · qu’','주어와 목적어 역할로 관계대명사를 골라요.',['관계절','관계대명사','qui','que','qu’','어떤사람'],['relativeQui','relativeQue','relativeElision','quiNoElision'],[
    S('두 문장을 한 명사에 연결해요','관계절은 앞의 명사가 어떤 것인지 설명해요. 관계절 안에서 주어 역할이면 qui, 직접목적어 역할이면 que예요.'),T('역할로 비교하기',['역할','예문'],[['주어: 친구가 일한다','un ami qui travaille'],['목적어: 내가 그 책을 읽는다','le livre que je lis'],['목적어 + 모음','le livre qu’elle lit'],['주어 + 모음','la clé qui ouvre la porte']]),
    S('사람·사물의 차이가 아니에요','qui는 사람에게만 쓰는 말이 아니에요. 열쇠가 문을 여는 주체이면 la clé qui ouvre예요. 카페도 aimer의 대상이면 le café que j’aime예요.'),
    S('줄임과 중복','que는 모음 앞에서 qu’로 줄고 qui는 줄이지 않아요. qui 뒤에 같은 주어를 다시 넣거나 que로 받은 목적어를 다시 넣지 않아요.',[['J’ai un ami qui habite à Lyon.','나는 리옹에 사는 친구 한 명이 있어.']]),
    S('장소·de 관계는 다른 말로','장소·시간의 관계에는 où, de로 연결된 관계에는 dont도 써요. 명사가 장소라는 이유만으로 언제나 où를 고르지는 않아요.',[['la ville où j’habite','내가 사는 도시'],['le livre dont je parle','내가 이야기하는 책']])]),
  A('comparison','connections','비교와 meilleur·mieux','plus · moins · aussi … que','정도의 차이와 더 좋다·더 잘하다를 구분해요.',['비교','plus','moins','aussi','meilleur','meilleure','mieux','celle-là','더잘','더좋다'],['comparePlus','compareMoins','compareAussi','meilleur','mieux','celleLa'],[
    S('형용사를 비교하는 기본 틀','plus는 더, moins는 덜, aussi는 같은 정도예요. 형용사 뒤의 que 다음에 비교 대상을 놓아요.'),T('세 가지 비교',['뜻','표현'],[['더 크다','plus grand que'],['덜 비싸다','moins cher que'],['~만큼 크다','aussi grand que']]),F('meilleur'),
    S('bon과 bien의 비교급','형용사 bon의 비교급 meilleur는 성·수에 맞춰요. 동작을 꾸미는 bien의 비교급 mieux는 성·수에 따라 바뀌지 않아요.',[['Cette soupe est meilleure.','이 수프가 더 좋아.'],['Elle parle mieux français que moi.','그녀는 나보다 프랑스어를 더 잘해.']]),
    S('비교 대상을 짧게 받기','남성 명사를 받는 “저것”은 celui-là, 여성 명사를 받으면 celle-là예요. que는 모음 앞에서 qu’로 줄어요.',[['Cette chambre est plus calme que celle-là.','이 방은 저 방보다 더 조용해.'],['Je comprends mieux qu’avant.','나는 전보다 더 잘 이해해.']])]),
  A('connectors','connections','이유·결과·대조','parce que · donc · pourtant','두 문장이 어떤 관계인지 드러내요.',['parce que','parce qu’','donc','pourtant','이유','그래서','그런데도','왜냐하면'],['parceQue','donc','pourtant','apprendreReason'],[
    S('어떤 관계를 이어 주나요?','parce que는 이유, donc는 결과, pourtant는 예상과 다른 대조를 나타내요.'),T('같은 상황을 다르게 연결',['관계','예문'],[['이유','Je reste ici parce qu’il pleut.'],['결과','Il pleut, donc je reste ici.'],['대조','Il pleut, pourtant je sors.']]),
    S('parce que의 줄임과 순서','parce que는 il 앞에서 parce qu’il로 줄어요. 이유절을 앞에 둘 수도 있어요.',[['Parce qu’il pleut, je reste à la maison.','비가 오기 때문에 나는 집에 있어.'],['Je pratique tous les jours parce que j’apprends le français.','나는 프랑스어를 배우기 때문에 매일 연습해.']]),
    S('연결어만 바꾸면 뜻도 바뀌어요','따라오는 내용이 자연스러운 결과인지, 예상과 반대인지 확인해요. “비싸다, 그래서 안 산다”와 “비싸다, 그런데도 산다”는 다른 관계예요.',[['C’est cher, donc je ne l’achète pas.','비싸. 그래서 사지 않아.'],['C’est cher, pourtant je veux l’acheter.','비싸. 그런데도 사고 싶어.']])]),
  A('opinion','connections','생각과 판단','Je pense que…','내 생각을 하나의 문장으로 이어 말해요.',['pense','penser','raison','생각','의견','옳다'],['penseQue','avoirRaison'],[
    S('생각하는 내용을 que 뒤에','Je pense que 뒤에 주어와 동사가 있는 문장을 붙여요. 긍정문에서 사실로 생각하는 내용은 보통 직설법을 써요.',[['Je pense que c’est important.','나는 이게 중요하다고 생각해.'],['Je pense qu’il a raison.','나는 그가 옳다고 생각해.']]),F('avoirRaison'),
    S('모음 앞의 que','que는 il·elle 같은 모음 앞에서 qu’가 돼요. 주어 c’나 je 앞에서는 que를 유지해요.',[['Je pense qu’elle vient.','나는 그녀가 온다고 생각해.']]),
    S('부정·의문에서는 문맥을 봐요','Je ne pense pas que처럼 확신을 부정하면 접속법이 흔히 쓰여요. 질문·부정의 뜻과 확신 정도에 따라 법이 달라지므로 “penser 뒤는 항상 직설법”으로 외우지 않아요.',[['Je ne pense pas qu’il soit ici.','나는 그가 여기에 있다고 생각하지 않아.']])]),
  A('subjunctive','connections','필요와 바람의 접속법','Le subjonctif présent','필요하거나 바라는 일을 que 뒤에 표현해요.',['접속법','subjonctif','subjuntif','il faut','je veux que','sois','soit','viennes','fasses','aies','partions','해야해'],['subjVenir','subjEtre','subjFaire','subjPartir','subjAvoir'],[
    S('접속법을 쓰는 이유','접속법은 단순한 과거·미래 표시가 아니라 내용을 바라보는 방식이에요. Il faut que의 필요, Je veux que의 바람 뒤에서는 접속법 현재를 써요.',[['Il faut que tu viennes.','네가 와야 해.'],['Je veux qu’il vienne.','나는 그가 오기를 원해.']]),
    S('원형과 que절','내가 하고 싶은 일은 Je veux + 원형, 다른 사람이 하기를 바라는 일은 Je veux que + 주어 + 접속법으로 구분해요. Il faut + 원형은 필요한 행동을 일반적으로 말해요.',[['Je veux venir.','나는 오고 싶어.'],['Il faut partir.','떠나야 해.'],['Il faut que nous partions.','우리가 떠나야 해.']]),F('subjEtre'),F('subjAvoir'),F('subjFaire'),F('subjVenir'),F('subjPartir'),
    S('규칙적인 형태와 예외','많은 동사는 현재형 ils의 -ent를 뺀 어간에 -e·-es·-e·-ions·-iez·-ent를 붙여요. nous·vous에서 어간이 달라지는 동사와 être·avoir 같은 불규칙형은 표로 확인해요. que가 있다고 언제나 접속법은 아니에요.',[['Il faut que tu parles.','네가 말해야 해.'],['Je pense qu’il vient.','나는 그가 온다고 생각해. (직설법)']])])
];

// A reference outline independent of the currently available exercise courses.
export const grammarOutline={
  basics:['word-classes','sentence-elements','subject-pronouns','noun-expansion','articles','article-omission','gender-plural','compound-nouns','partitive-articles','possessive-adjectives','demonstrative-adjectives','agreement','adjective-irregular','colors','adjective-position','adverbs','quantity','indefinite-words','tout','numbers','ordinals-fractions','dates-time','infinitive','negation','questions','interrogatives','places','spatial-prepositions','countries-prepositions','time-prepositions','elision','homophones','punctuation','word-formation'],
  verbs:['verb-construction','present-regular','spelling-verbs','present-irregular','etre','avoir','aller','vouloir','pouvoir','aimer','common-verb-contrasts','verb-prepositions','adjective-prepositions','modal-verbs','pronominal-verbs','subject-agreement','participle-agreement','causative','perception','impersonal','presentatives','imperative','requests','need','avoir-states'],
  tenses:['tense-map','ongoing-present','recent-past','aspect','compound-past','participles','etre-past','past-negation','imparfait','past-contrast','pluperfect','future','future-perfect','conditions','conditional','conditional-past','past-subjunctive','infinitive-past','past-imperative','compound-participle','literary-past','passe-simple-forms','anterior-past','literary-subjunctive','double-compound'],
  connections:['object-pronouns','indirect-objects','pronoun-order','stressed-pronouns','y','en','possessive-pronouns','demonstrative-pronouns','relatives','relative-dont-ou','relative-compound','neutral-relatives','relative-meaning','comparison','quantity-comparison','superlative','advanced-negation','inversion','exclamation-emphasis','connectors','coordination','subordinating-conjunctions','completive','indirect-questions','cause','consequence','purpose','opposition','concession','condition-connectors','time-clauses','opinion','subjunctive','subjunctive-choice','gerund','present-participle','participial-clauses','passive','reported-speech','discourse-types','cohesion','enunciation']
};
export const referenceGrammarArticles=[...referenceBasics,...referenceVerbs,...referenceSyntax];
const allArticles=[...coreGrammarArticles.map(article=>({...article,term:existingArticleTerms[article.id]||''})),...extraGrammarArticles,...referenceGrammarArticles];
export const grammarArticles=Object.values(grammarOutline).flat().map(id=>allArticles.find(article=>article.id===id));
export const grammarById=id=>grammarArticles.find(article=>article.id===id);
export const miniLessonArticleIds=Object.fromEntries(grammarArticles.flatMap(article=>article.lessonIds.map(id=>[id,article.id])));
// New questions may link directly to reference entries, independently of mini lessons.
// Older question IDs keep their existing destinations and personal view counts.
export function grammarsForQuestion(question){
  const explicit=typeof question==='object'&&question?question.grammarIds??(question.grammarId?[question.grammarId]:[]):[];
  const articles=[...new Set(Array.isArray(explicit)?explicit:[])].map(grammarById).filter(Boolean);
  if(articles.length)return articles;
  const id=typeof question==='string'?question:question?.id;
  const fallback=grammarById(miniLessonArticleIds[questionLessonIds[id]]);
  return fallback?[fallback]:[];
}
export const grammarForQuestion=question=>grammarsForQuestion(question)[0];
