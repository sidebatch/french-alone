// Guided A2–B1 grammar practice, authored locally; not a complete CEFR course.
export const intermediateUnits = [
  {id:'past-stories',level:'intermediate',title:'지난 일을 이야기해요',description:'복합과거 · 이동과 일치 · 과거의 배경',packs:['past-events','past-movement','past-background']},
  {id:'plans-conditions',level:'intermediate',title:'앞일과 가정을 표현해요',description:'단순미래 · 가능한 조건 · 상상 속 상황',packs:['future-plans','real-conditions','imagined-conditions']},
  {id:'connected-sentences',level:'intermediate',title:'문장을 자연스럽게 이어요',description:'목적어 대명사 · y와 en · qui와 que',packs:['object-pronouns','place-quantity','relative-links']},
  {id:'opinions',level:'intermediate',title:'생각을 더 정확하게 전해요',description:'비교 · 이유와 대조 · 필요와 바람',packs:['comparisons','opinion-links','necessity']}
];
const choose=(ko,cue,answer,full,choices,hint,note,extra={})=>({kind:'choice',ko,cue,answer,full,choices,hint,note,...extra});
const blank=(ko,cue,answer,full,hint,note,extra={})=>({kind:'input',ko,cue,answer,full,hint,note,...extra});
const write=(ko,full,hint,note,extra={})=>({kind:'input',ko,answer:full,full,hint,note,...extra});
const arrange=(ko,full,tiles,hint,note,extra={})=>({kind:'order',ko,answer:full,full,tiles,hint,note,...extra});

const readingAtEight = [
  'Hier, à huit heures, je lisais un livre.',
  'Je lisais un livre hier à huit heures.',
  'Je lisais un livre à huit heures hier.',
  'À huit heures hier, je lisais un livre.',
  'Hier, je lisais un livre à huit heures.',
  'À huit heures, je lisais un livre hier.'
];
const readingVariants = readingAtEight.flatMap((sentence, i) => [
  ...(i ? [sentence] : []),
  ...['8 heures', '8 h', '8h'].map(time => sentence.replace('huit heures', time))
]);
const meta=(id,title,subtitle,pattern,icon,color,rule,caution)=>({id,level:'intermediate',title,subtitle,pattern,icon,color,promise:subtitle,guide:{rule,caution}});

export const intermediatePackSpecs = [
  [meta('past-events','어제 무엇을 했나요','완료한 일을 복합과거로 이야기하기','avoir 현재형 + 과거분사','clock','peach',
    '복합과거는 avoir 또는 être의 현재형과 과거분사로 만들어요. 여기서는 avoir와 쓰는 동사를 연습해요.',
    '부정문에서는 ne … pas가 조동사를 감싸요. regarder → regardé, finir → fini, voir → vu처럼 과거분사 형태를 확인해요.'),[
    choose('나는 어제 일했어.','Hier, j’___ travaillé.','ai','Hier, j’ai travaillé.',['ai','suis','avais'],'j’ai + travaillé로 완료한 일을 말해요.','travailler의 과거분사는 travaillé예요. hier는 “어제”예요.'),
    blank('나는 어제 영화를 봤어.','Hier, j’ai ___ un film.','regardé','Hier, j’ai regardé un film.','-er를 -é로 바꿔요.','regarder → regardé. 조동사 ai 뒤에 동사원형을 쓰지 않아요.',{glossary:'regarder un film = 영화를 보다'}),
    write('voir(보다)의 과거분사를 써요.','vu','v로 시작하는 두 글자예요.','voir의 과거분사는 불규칙형 vu예요. J’ai vu ce film처럼 써요.',{mode:'word'}),
    arrange('나는 내 일을 끝냈어.','J’ai fini mon travail.',['J’ai','fini','mon','travail'],'J’ai → fini → mon travail 순서예요.','finir의 과거분사는 fini예요. mon travail은 “내 일”이에요.',{glossary:'finir = 끝내다 · mon travail = 내 일'}),
    choose('나는 이 영화를 보지 않았어.','Je n’ai ___ vu ce film.','pas','Je n’ai pas vu ce film.',['pas','ne','plus'],'ne … pas가 ai를 감싸요.','n’ai pas 뒤에 과거분사 vu를 놓아요. ce film은 “이 영화”예요.'),
    blank('나는 아직 먹지 않았어.','Je n’ai pas encore ___.','mangé','Je n’ai pas encore mangé.','manger의 과거분사는 mangé예요.','pas encore는 “아직 ~하지 않았다”예요. mangé 앞에 놓아요.',{glossary:'manger = 먹다 · pas encore = 아직 ~않다'}),
    arrange('우리는 이 영화를 봤어.','Nous avons vu ce film.',['Nous','avons','vu','ce','film'],'Nous에 맞는 조동사는 avons예요.','주어가 nous로 바뀌면 ai가 avons가 돼요. vu는 그대로예요.'),
    blank('너는 네 일을 끝냈어.','Tu ___ fini ton travail.','as','Tu as fini ton travail.','Tu와 쓰는 avoir는 as예요.','Tu as + fini. ton travail은 “네 일”이에요.'),
    write('나는 어제 영화를 봤어.','Hier, j’ai regardé un film.','regarder의 과거분사를 avoir와 함께 써요.','완료한 일을 j’ai regardé로 표현하고 hier로 시점을 밝혀요.',{accepted:['J’ai regardé un film hier.']}),
    write('우리는 어제 식당에서 먹었어.','Nous avons mangé au restaurant hier.','Nous avons + mangé 뒤에 장소와 시간을 붙여요.','nous의 조동사는 avons예요. au restaurant은 “식당에서”예요.',{transfer:true,glossary:'manger = 먹다 · au restaurant = 식당에서 · hier = 어제',accepted:['Hier, nous avons mangé au restaurant.','Nous avons mangé hier au restaurant.']})
  ]],
  [meta('past-movement','어디에 다녀왔나요','être를 쓰는 과거와 성·수 일치','être 현재형 + 과거분사','compass','mint',
    'aller, arriver, partir 같은 동사는 이 용법의 복합과거에서 être를 써요. 과거분사는 주어의 성과 수에 맞춰요.',
    'elle est allée, ils sont allés, elles sont allées처럼 어미가 달라져요. 모든 이동 동사가 être를 쓰는 것은 아니에요.'),[
    choose('그녀는 파리에 갔어.','Elle ___ allée à Paris.','est','Elle est allée à Paris.',['est','a','va'],'aller의 복합과거에는 être를 써요.','elle에 맞는 조동사는 est, 여성 단수 과거분사는 allée예요.'),
    blank('그는 파리에 갔어.','Il est ___ à Paris.','allé','Il est allé à Paris.','남성 단수인 il에는 allé를 써요.','allé는 남성 단수형이에요. elle일 때 붙었던 e를 붙이지 않아요.'),
    write('arriver(도착하다)의 여성 단수 과거분사를 써요.','arrivée','arrivé에 e를 붙여요.','être와 쓰는 과거분사는 여성 단수 주어에 맞춰 arrivée가 돼요.',{mode:'word'}),
    arrange('그녀는 어제 도착했어.','Elle est arrivée hier.',['Elle','est','arrivée','hier'],'elle에 맞게 arrivée의 끝을 확인해요.','arriver도 이 문장에서 être와 쓰며, arrivée는 elle와 일치해요.',{accepted:['Hier, elle est arrivée.']}),
    choose('그 여자들은 떠났어.','Elles sont ___.','parties','Elles sont parties.',['parties','parti','partis'],'여성 여러 명을 가리키는 elles에 맞춰 과거분사 parti에 -es를 붙여요.','partir의 과거분사 parti에 여성형 e와 복수형 s가 붙어요.'),
    blank('그 남자들은 떠났어.','Ils ___ partis.','sont','Ils sont partis.','ils와 쓰는 être의 현재형이에요.','Ils sont partis. 남성 복수형 과거분사는 partis예요.'),
    arrange('그녀는 파리에 가지 않았어.','Elle n’est pas allée à Paris.',['Elle','n’est','pas','allée','à','Paris'],'ne … pas로 est를 감싸요.','부정문에서도 allée의 여성형 e는 유지해요.'),
    blank('그녀들은 제시간에 도착했어.','Elles sont ___ à l’heure.','arrivées','Elles sont arrivées à l’heure.','여성 복수이므로 arrivée에 s를 붙여요.','à l’heure는 “제시간에”예요. arrivées는 elles와 일치해요.',{glossary:'à l’heure = 제시간에'}),
    write('나는 어제 파리에 갔어.','Je suis allé à Paris hier.','Je suis 뒤에 allé 또는 allée를 써요.','남성 화자는 Je suis allé, 여성 화자는 Je suis allée라고 해요. être 뒤의 과거분사를 주어에 맞춰요.',{accepted:['Je suis allée à Paris hier.','Hier, je suis allé à Paris.','Hier, je suis allée à Paris.']}),
    write('그녀는 어젯밤 떠났어.','Elle est partie hier soir.','Elle est 뒤에 partir의 여성형 과거분사를 써요.','partie는 여성 단수형이에요. hier soir는 “어젯밤”이에요.',{transfer:true,glossary:'partir = 떠나다 · hier soir = 어젯밤',accepted:['Hier soir, elle est partie.']})
  ]],
  [meta('past-background','그때는 무슨 일이 있었나요','반과거로 배경을 그리고 사건 연결하기','반과거 배경 + 복합과거 사건','book','lavender',
    '반과거는 과거의 습관이나 진행 중이던 배경을 보여줘요. 복합과거는 이야기를 진행시키는 완료된 사건을 표현할 때 써요.',
    '시간이 길면 반과거, 짧으면 복합과거라는 절대 규칙은 아니에요. 여기서는 주어진 “하곤 했다 / 하는 중이었다”의 관점을 따라 써요.'),[
    choose('나는 그때 파리에 살고 있었어.','À cette époque, j’___ à Paris.','habitais','À cette époque, j’habitais à Paris.',['habitais','habiterai','habite'],'과거의 거주 상태를 반과거로 표현해요.','habiter의 je 반과거는 habitais예요. 과거 배경을 설명하고 있어요.'),
    blank('우리는 그때 매일 일하곤 했어.','À cette époque, nous ___ tous les jours.','travaillions','À cette époque, nous travaillions tous les jours.','반과거의 nous 어미는 -ions예요.','travaill-에 -ions를 붙여 travaillions로 써요.',{glossary:'travailler = 일하다 · tous les jours = 매일'}),
    write('être의 je 반과거 형태를 써요.','étais','ét-에 -ais를 붙여요.','être는 반과거 어간이 ét-예요. j’étais, tu étais로 써요.',{mode:'word'}),
    arrange('어제 여덟 시에 책을 읽고 있었어.',readingAtEight[0],['Hier','à','huit','heures','je','lisais','un','livre'],'lire를 그때 하던 일에 맞는 반과거로 써 봐요.','je lisais는 그때 책을 읽는 중이었다는 뜻이에요. Hier, à huit heures를 앞에 놓으면 시간을 먼저 알려 줘요.',{glossary:'lire un livre = 책을 읽다 · à huit heures = 여덟 시에',accepted:readingVariants}),
    choose('내가 읽고 있을 때 전화가 울렸어.','Je lisais quand le téléphone ___ sonné.','a','Je lisais quand le téléphone a sonné.',['a','est','avait'],'배경은 lisais, 새 사건은 a sonné예요.','책을 읽던 상황은 반과거 lisais로, 그때 전화가 울린 일은 복합과거 a sonné로 표현해요.'),
    blank('내가 요리하고 있을 때 전화가 울렸어.','Je ___ quand le téléphone a sonné.','cuisinais','Je cuisinais quand le téléphone a sonné.','cuisiner를 je의 반과거로 바꿔요.','cuisinais는 진행 중이던 요리, a sonné는 발생한 사건이에요.',{glossary:'cuisiner = 요리하다'}),
    arrange('비가 오고 있었고, 나는 집에 있었어.','Il pleuvait et j’étais à la maison.',['Il','pleuvait','et','j’étais','à','la','maison'],'날씨와 당시 상태를 et로 연결해요.','pleuvait와 étais는 모두 과거 배경을 나타내는 반과거예요.',{glossary:'il pleuvait = 비가 오고 있었다',accepted:['J’étais à la maison et il pleuvait.']}),
    blank('너는 그때 시간이 있었어.','À cette époque, tu ___ du temps.','avais','À cette époque, tu avais du temps.','avoir의 tu 반과거는 avais예요.','avoir du temps는 “시간이 있다”예요. 여기서는 과거 상태를 말해요.'),
    write('나는 그때 파리에 살고 있었어.','À cette époque, j’habitais à Paris.','À cette époque와 j’habitais를 연결해요.','과거의 거주 배경을 반과거 habitais로 써요.',{accepted:['J’habitais à Paris à cette époque.']}),
    write('내가 자고 있을 때 전화가 울렸어.','Je dormais quand le téléphone a sonné.','진행 중이던 잠은 반과거 dormais로 써요.','배경인 dormais와 사건인 a sonné를 quand로 연결해요.',{transfer:true,glossary:'dormir = 자다 · quand = ~할 때 · sonner = 울리다',accepted:['Quand le téléphone a sonné, je dormais.']})
  ]],
  [meta('future-plans','앞으로 할 일을 약속해요','단순미래로 계획과 약속 쓰기','단순미래: -ai / -as / -a / -ons / -ez / -ont','sun','butter',
    '단순미래는 미래의 일을 표현해요. 동사 어간에 주어에 맞는 미래 어미를 붙이고, aller는 ir-, être는 ser-를 써요.',
    'je의 미래 어미 -ai와 조건법 어미 -ais를 구분해요. 이 코스는 단순미래 형태를 쓰는 연습이에요.'),[
    choose('나는 내일 일할 거야.','Demain, je ___.','travaillerai','Demain, je travaillerai.',['travaillerai','travaillerais','travaillais'],'travailler에 je의 미래 어미 -ai를 붙여요.','travaillerai는 미래예요. travaillerais는 조건법 현재예요.'),
    blank('우리는 내일 먹을 거야.','Demain, nous ___.','mangerons','Demain, nous mangerons.','manger 뒤에 -ons를 붙여요.','nous의 단순미래 어미는 -ons예요. mangerons로 써요.',{glossary:'manger = 먹다'}),
    write('avoir의 je 단순미래 형태를 써요.','aurai','불규칙 어간 aur-에 -ai를 붙여요.','avoir는 미래에서 aur-를 써요. j’aurai는 “나는 가질 것이다”예요.',{mode:'word'}),
    arrange('너는 내일 시간이 있을 거야.','Tu auras du temps demain.',['Tu','auras','du','temps','demain'],'avoir를 tu에 맞는 단순미래로 바꿔요.','avoir의 미래 어간 aur-에 tu의 어미 -as를 붙여요.',{accepted:['Demain, tu auras du temps.']}),
    choose('나는 내일 파리에 갈 거야.','Demain, j’___ à Paris.','irai','Demain, j’irai à Paris.',['irai','irais','allais'],'aller의 미래 어간은 ir-예요.','j’irai는 단순미래예요. vais aller는 근접미래라는 다른 형태예요.'),
    blank('그녀는 내일 여기에 있을 거야.','Elle ___ ici demain.','sera','Elle sera ici demain.','être의 미래 어간 ser-에 -a를 붙여요.','elle에 맞는 단순미래 형태는 sera예요. serai는 je의 형태예요.'),
    arrange('우리는 내일 일하지 않을 거야.','Nous ne travaillerons pas demain.',['Nous','ne','travaillerons','pas','demain'],'ne … pas가 travaillerons를 감싸요.','단순미래는 한 동사 형태예요. 그 앞뒤에 ne와 pas를 놓아요.',{accepted:['Demain, nous ne travaillerons pas.']}),
    blank('내일 오실 거예요.','Vous ___ demain.','viendrez','Vous viendrez demain.','venir의 미래 어간 viendr-에 -ez를 붙여요.','venir는 불규칙 어간 viendr-를 써요. vous의 어미는 -ez예요.',{glossary:'venir = 오다'}),
    write('나는 내일 파리에 갈 거야.','J’irai à Paris demain.','J’irai 뒤에 장소와 시간을 붙여요.','aller의 단순미래 j’irai를 사용해 계획을 말해요.',{accepted:['Demain, j’irai à Paris.']}),
    write('우리는 내일 이 일을 할 거야.','Nous ferons ce travail demain.','faire의 미래 어간 fer-에 -ons를 붙여요.','nous ferons는 “우리는 할 것이다”예요. ce travail은 “이 일”이에요.',{transfer:true,glossary:'faire = 하다 · 미래 어간 fer- · ce travail = 이 일',accepted:['Demain, nous ferons ce travail.']})
  ]],
  [meta('real-conditions','조건이 맞으면 할 거예요','si + 현재와 미래 결과 연결하기','Si + 현재, 단순미래','compass','mint',
    '앞으로 가능한 조건은 si + 현재형으로, 그때 일어날 결과는 단순미래로 표현할 수 있어요.',
    '이 조건절에서는 si 뒤에 미래형을 쓰지 않아요. 조건과 결과의 순서는 바꿀 수 있어요.'),[
    choose('시간이 있으면 나는 갈 거야.','Si j’___ le temps, j’irai.','ai','Si j’ai le temps, j’irai.',['ai','aurai','aurais'],'si 뒤에는 현재형 ai를 써요.','조건은 j’ai, 미래 결과는 j’irai예요. 시제를 서로 다르게 써요.'),
    blank('비가 오면 우리는 집에 있을 거야.','S’il ___, nous resterons à la maison.','pleut','S’il pleut, nous resterons à la maison.','pleuvoir의 현재형은 il pleut예요.','si는 il 앞에서 s’il로 줄어요. 조건절의 동사는 현재형이에요.',{glossary:'pleuvoir = 비가 오다 · rester = 머무르다'}),
    write('rester의 nous 단순미래 형태를 써요.','resterons','rester에 -ons를 붙여요.','nous resterons는 “우리는 머무를 것이다”예요. 조건의 결과에 쓸 수 있어요.',{mode:'word'}),
    arrange('시간이 있으면 나는 일할 거야.','Si j’ai le temps, je travaillerai.',['Si','j’ai','le','temps','je','travaillerai'],'시간이 있다는 조건은 현재형, 일하겠다는 결과는 단순미래예요.','si절의 현재형 ai와 결과의 미래형 travaillerai를 구분해요.',{accepted:['Je travaillerai si j’ai le temps.']}),
    choose('네가 오면 우리는 함께 먹을 거야.','Si tu viens, nous ___ ensemble.','mangerons','Si tu viens, nous mangerons ensemble.',['mangerons','mangerions','mangions'],'결과 부분은 단순미래로 써요.','조건은 현재형 viens예요. mangerons는 미래 결과를 나타내요.'),
    blank('네가 오면 우리는 함께 먹을 거야.','Si tu ___, nous mangerons ensemble.','viens','Si tu viens, nous mangerons ensemble.','venir의 tu 현재형을 넣어요.','viens는 현재형이에요. viendras는 이 조건절에 쓰지 않아요.',{glossary:'venir = 오다 · ensemble = 함께'}),
    arrange('비가 오면 나는 외출하지 않을 거야.','S’il pleut, je ne sortirai pas.',['S’il','pleut','je','ne','sortirai','pas'],'결과의 sortirai를 ne … pas로 감싸요.','부정문에서도 미래형 sortirai를 유지해요.',{glossary:'sortir = 외출하다',accepted:['Je ne sortirai pas s’il pleut.']}),
    blank('네가 시간이 있으면 우리는 이야기할 거야.','Si tu as le temps, nous ___.','parlerons','Si tu as le temps, nous parlerons.','parler를 nous의 단순미래로 바꿔요.','tu as는 현재 조건, nous parlerons는 미래 결과예요.',{glossary:'parler = 이야기하다'}),
    write('시간이 있으면 나는 갈 거야.','Si j’ai le temps, j’irai.','Si j’ai le temps와 j’irai를 연결해요.','앞일의 조건이지만 si 뒤에는 현재형 ai를 써요.',{accepted:['J’irai si j’ai le temps.']}),
    write('날씨가 좋으면 우리는 걸을 거야.','S’il fait beau, nous marcherons.','날씨 조건 뒤에 marcher의 미래형을 붙여요.','il fait beau는 “날씨가 좋다”예요. 결과는 nous marcherons로 써요.',{transfer:true,glossary:'il fait beau = 날씨가 좋다 · marcher = 걷다',accepted:['Nous marcherons s’il fait beau.']})
  ]],
  [meta('imagined-conditions','만약 그럴 수 있다면','반과거와 조건법으로 상상하기','Si + 반과거, 조건법 현재','sparkles','lavender',
    '현재와 다른 상황을 상상할 때 si + 반과거와 조건법 현재를 연결해요. 조건법은 미래 어간에 -ais, -ait, -ions 등의 어미를 붙여요.',
    '조건을 나타내는 이 si절에는 조건법을 쓰지 않아요. Si j’avais …, je voyagerais …처럼 구분해요.'),[
    choose('시간이 있다면 나는 여행할 텐데.','Si j’___ le temps, je voyagerais.','avais','Si j’avais le temps, je voyagerais.',['avais','aurais','aurai'],'상상하는 조건에는 반과거 avais를 써요.','조건은 avais, 가정의 결과는 조건법 voyagerais예요.'),
    blank('시간이 있다면 나는 더 읽을 텐데.','Si j’avais le temps, je ___ plus.','lirais','Si j’avais le temps, je lirais plus.','lire의 조건법 어간 lir-에 -ais를 붙여요.','조건법 현재 lirais는 “읽을 텐데”라는 가정의 결과예요.',{glossary:'lire = 읽다 · plus = 더'}),
    write('être의 je 조건법 현재 형태를 써요.','serais','ser-에 -ais를 붙여요.','serais는 조건법, serai는 단순미래예요. 마지막 s를 확인해요.',{mode:'word'}),
    arrange('내가 부자라면 여행할 텐데.','Si j’étais riche, je voyagerais.',['Si','j’étais','riche','je','voyagerais'],'부자라는 가정은 반과거, 여행할 거라는 결과는 조건법이에요.','être의 반과거 étais와 voyager의 조건법 voyagerais를 연결해요.',{glossary:'riche = 부유한 · voyager = 여행하다',accepted:['Je voyagerais si j’étais riche.']}),
    choose('시간이 있다면 우리는 갈 텐데.','Si nous avions le temps, nous ___.','irions','Si nous avions le temps, nous irions.',['irions','irons','allons'],'aller의 조건법 어간 ir-에 -ions를 붙여요.','nous irions는 조건법이에요. nous irons는 단순미래예요.'),
    blank('시간이 있다면 우리는 더 읽을 텐데.','Si nous ___ le temps, nous lirions plus.','avions','Si nous avions le temps, nous lirions plus.','avoir의 nous 반과거는 avions예요.','가정하는 조건에는 avions를, 결과에는 lirions를 써요.'),
    arrange('내가 너라면 여기 머물 텐데.','Si j’étais toi, je resterais ici.',['Si','j’étais','toi','je','resterais','ici'],'“내가 너라면”이라는 조건을 조언과 연결해요.','“내가 너라면”은 Si j’étais toi예요. resterais는 조건법이에요.',{glossary:'rester = 머무르다',accepted:['Je resterais ici si j’étais toi.']}),
    blank('시간이 있다면 나는 그것을 할 텐데.','Si j’avais le temps, je le ___.','ferais','Si j’avais le temps, je le ferais.','faire의 조건법 어간 fer-에 -ais를 붙여요.','le는 “그것을”이에요. 조건법 ferais 앞에 놓아요.',{glossary:'faire = 하다 · le = 그것을'}),
    write('시간이 있다면 나는 여행할 텐데.','Si j’avais le temps, je voyagerais.','Si j’avais와 je voyagerais를 연결해요.','조건절은 반과거, 결과절은 조건법 현재로 써요.',{accepted:['Je voyagerais si j’avais le temps.']}),
    write('내가 너라면 좀 쉴 텐데.','Si j’étais toi, je prendrais un peu de repos.','Si j’étais toi 뒤에 prendrais를 써요.','prendre의 조건법 어간은 prendr-예요. prendre un peu de repos는 ‘조금 쉬다’라는 뜻이에요.',{transfer:true,glossary:'prendre un peu de repos = 조금 쉬다 · 조건법 어간 prendr-',accepted:['Je prendrais un peu de repos si j’étais toi.','Si j’étais toi, je ferais une pause.','Je ferais une pause si j’étais toi.','Si j’étais toi, je prendrais une pause.','Je prendrais une pause si j’étais toi.']})
  ]],
  [meta('object-pronouns','같은 말을 반복하지 않아요','le·la·les로 목적어 바꾸기','le / la / les + 동사','cards','peach',
    '직접목적어를 le, la, les로 바꾸면 같은 명사를 반복하지 않아도 돼요. 이 대명사는 활용된 동사 앞에 놓아요.',
    '뒤에 동사원형이 있으면 그 대명사가 어느 동사의 목적어인지 확인해요. Je veux le lire에서는 lire 앞이에요.'),[
    choose('이 책을 읽고 있어. “그것을”로 바꿔요.','Je ___ lis.','le','Je le lis.',['le','lui','y'],'남성 단수 le livre를 le로 받아요.','le는 lire의 직접목적어예요. lis 앞에 놓아 “그것을 읽는다”가 돼요.'),
    blank('그 편지를 읽고 있어. “그것을”로 바꿔요.','Je ___ lis.','la','Je la lis.','여성 단수 la lettre를 la로 받아요.','la lettre는 여성 명사예요. 대명사 la를 동사 앞에 써요.',{glossary:'lettre = 편지 (여성 명사)'}),
    write('여러 권의 책을 가리키는 직접목적어 대명사를 써요.','les','복수 명사는 les로 받아요.','직접목적어가 복수이면 성에 관계없이 les를 사용할 수 있어요.',{mode:'word'}),
    arrange('그 책들을 읽어. (대명사로)','Je les lis.',['Je','les','lis'],'주어 뒤, 동사 앞에 les를 놓아요.','les는 여러 책을 받아요. lis는 주어 je에 맞춘 동사예요.'),
    choose('이 책을 읽고 싶어. “그것을”로 바꿔요.','Je veux ___ lire.','le','Je veux le lire.',['le','lui','en'],'그 책은 lire의 목적어예요.','le를 lire 바로 앞에 놓아요. Je le veux lire라고 하지 않아요.'),
    blank('그 편지를 읽고 싶어. (대명사로)','Je veux ___ lire.','la','Je veux la lire.','편지 la lettre를 la로 받아요.','la는 lire의 목적어이므로 veux 뒤, lire 앞에 놓아요.'),
    arrange('이 책을 읽지 않아. (대명사로)','Je ne le lis pas.',['Je','ne','le','lis','pas'],'Je → ne → le → lis → pas 순서예요.','목적어 대명사 le도 ne와 동사 사이에 들어가요.'),
    blank('이 책을 좋아해. “그것을”로 바꿔요.','Je ___ aime.','l’','Je l’aime.','le는 모음 앞에서 l’로 줄어요.','aime가 모음으로 시작하므로 le 또는 la는 l’가 돼요.'),
    write('이 책을 읽고 싶어. “그것을”로 바꿔요.','Je veux le lire.','Je veux 뒤에 le lire를 붙여요.','직접목적어 le는 그 목적어를 요구하는 동사원형 lire 앞에 놓아요.'),
    write('그 편지를 이해할 수 있어. (대명사로)','Je peux la comprendre.','편지 la lettre를 la로 받아 comprendre 앞에 놓아요.','peux 뒤에는 동사원형을 써요. la는 comprendre의 목적어예요.',{transfer:true,glossary:'la lettre = 편지 · comprendre = 이해하다'})
  ]],
  [meta('place-quantity','장소와 수량을 짧게 말해요','y와 en으로 이미 나온 말 받기','y = 그곳에 · en = 그것의 일부 / 수량','bag','butter',
    'y는 이미 나온 장소 등을, en은 de와 연결된 말이나 수량을 나타내는 명사 등을 받아요. 이 코스에서는 장소와 개수·부분량을 연습해요.',
    'J’en ai deux처럼 구체적인 수량은 남겨요. 부정문에서는 Je n’en ai pas가 돼요.'),[
    choose('나는 파리에 가. “그곳에”로 바꿔요.','J’___ vais.','y','J’y vais.',['y','en','le'],'목적지 à Paris를 y로 받아요.','y를 활용된 동사 vais 앞에 놓아요. Je는 y 앞에서 J’로 줄어요.'),
    blank('나는 집에 있어. “그곳에”로 바꿔요.','J’___ suis.','y','J’y suis.','장소 à la maison을 y로 받아요.','J’y suis는 “나는 그곳에 있다”예요. y는 장소를 대신해요.'),
    write('“사과 세 개가 있어”에서 사과를 대신할 대명사를 써요.','en','수량과 함께 명사를 받는 en이에요.','J’en ai trois처럼 en으로 명사를 받고 trois라는 개수는 남겨요.',{mode:'word'}),
    arrange('나는 그곳에 가고 싶어.','Je veux y aller.',['Je','veux','y','aller'],'y는 aller가 나타내는 목적지예요.','동사원형 aller의 장소를 받으므로 y를 aller 바로 앞에 놓아요.'),
    choose('나는 사과가 두 개 있어. (대명사로)','J’___ ai deux.','en','J’en ai deux.',['en','y','les'],'사과라는 명사는 en으로 받고 deux는 남겨요.','en은 수량을 가진 명사를 대신해요. “두 개”라는 정보는 deux로 유지해요.'),
    blank('나는 사과가 세 개 있어. (대명사로)','J’en ai ___.','trois','J’en ai trois.','세 개라는 수량은 trois예요.','en을 써도 숫자는 없어지지 않아요. ai 뒤에 trois를 놓아요.'),
    arrange('사과는 하나도 없어. (대명사로)','Je n’en ai pas.',['Je','n’en','ai','pas'],'Je → n’en → ai → pas 순서예요.','ne는 en 앞에서 n’로 줄어요. en은 동사 ai 앞에 놓아요.'),
    blank('차를 마셔. “차를” 대신 대명사를 써요.','J’___ bois.','en','J’en bois.','부분량 du thé를 en으로 받아요.','Je bois du thé에서 du thé를 en으로 바꿔 J’en bois라고 해요.',{glossary:'boire du thé = 차를 마시다'}),
    write('나는 그곳에 가고 싶어.','Je veux y aller.','Je veux 뒤에 y aller를 붙여요.','장소 대명사 y를 동사원형 aller 앞에 놓아요.'),
    write('그녀는 그곳에서 일해. (이미 나온 장소)','Elle y travaille.','Elle 뒤에 y, 그다음 travaille를 써요.','장소를 다시 말하는 대신 y로 받아 짧게 표현해요.',{transfer:true,glossary:'travailler = 일하다 · elle travaille = 그녀는 일한다'})
  ]],
  [meta('relative-links','어떤 사람인지 설명해요','qui와 que로 명사에 설명 붙이기','명사 + qui / que + 설명','book','mint',
    '관계절 안에서 주어 역할을 하면 qui, 직접목적어 역할을 하면 que를 써요. 사람인지 사물인지로 고르는 것이 아니에요.',
    'que는 모음 앞에서 qu’로 줄지만 qui는 그대로예요. 여기서는 현재형 관계절을 연습해요.'),[
    choose('나는 여기서 일하는 친구 한 명이 있어.','J’ai un ami ___ travaille ici.','qui','J’ai un ami qui travaille ici.',['qui','que','où'],'일하는 주체가 앞의 un ami예요.','qui가 travaille의 주어 역할을 해요. 주어를 다시 넣지 않아요.'),
    blank('이건 내가 좋아하는 책이야.','C’est un livre ___ j’aime.','que','C’est un livre que j’aime.','aime의 주어는 j’, 좋아하는 대상은 livre예요.','관계절의 직접목적어가 앞의 책이므로 que를 써요.'),
    write('que가 모음 앞에서 줄어든 형태를 써요.','qu’','que의 e 대신 아포스트로피를 써요.','qu’il, qu’elle처럼 줄여요. qui는 모음 앞에서도 줄이지 않아요.',{mode:'word'}),
    arrange('이건 내가 읽고 있는 책이야.','C’est le livre que je lis.',['C’est','le','livre','que','je','lis'],'le livre 뒤에 que je lis를 붙여요.','lis의 주어는 je, 직접목적어는 앞의 le livre예요.'),
    choose('이건 그녀가 읽고 있는 책이야.','C’est le livre ___ elle lit.','qu’','C’est le livre qu’elle lit.',['qu’','qui','où'],'que는 elle 앞에서 qu’로 줄어요.','lit의 주어는 elle예요. 그 책은 읽는 대상이므로 que가 필요해요.'),
    blank('나는 프랑스어를 하는 친구 한 명이 있어.','J’ai un ami ___ parle français.','qui','J’ai un ami qui parle français.','parle의 주어 역할을 하는 관계대명사를 써요.','프랑스어를 하는 주체가 un ami이므로 qui를 써요.'),
    arrange('이건 내가 좋아하는 카페야.','C’est le café que j’aime.',['C’est','le','café','que','j’aime'],'le café 뒤에 que j’aime를 붙여요.','카페는 장소지만 여기서는 aime의 목적어예요. 그래서 que를 써요.'),
    blank('이건 문을 여는 열쇠야.','C’est la clé ___ ouvre la porte.','qui','C’est la clé qui ouvre la porte.','문을 여는 주체가 열쇠예요.','qui는 ouvre가 모음으로 시작해도 줄이지 않아요.',{glossary:'la clé = 열쇠 · ouvrir = 열다 · la porte = 문'}),
    write('이건 내가 읽고 있는 책이야.','C’est le livre que je lis.','C’est le livre 뒤에 que je lis를 붙여요.','관계절의 주어 je와 목적어를 받는 que를 구분해요.'),
    write('나는 리옹에 사는 친구 한 명이 있어.','J’ai un ami qui habite à Lyon.','un ami 뒤에 qui habite à Lyon을 붙여요.','qui는 habite의 주어예요. 모음 앞에서도 qui를 그대로 써요.',{transfer:true,glossary:'un ami / une amie = 친구 한 명 · habiter = 살다 · Lyon = 리옹',accepted:['J’ai une amie qui habite à Lyon.']})
  ]],
  [meta('comparisons','더 나은 선택을 설명해요','비교급과 meilleur·mieux 구분하기','plus / moins / aussi … que','hash','butter',
    '형용사를 비교할 때 plus … que(더), moins … que(덜), aussi … que(만큼)를 써요. bon의 비교급은 meilleur, bien의 비교급은 mieux예요.',
    'meilleur는 명사의 성·수에 맞춰 meilleure, meilleurs, meilleures로 바뀌어요. 부사 mieux는 그렇게 바뀌지 않아요.'),[
    choose('이 가방은 저 가방보다 더 커.','Ce sac est ___ grand que celui-là.','plus','Ce sac est plus grand que celui-là.',['plus','aussi','moins'],'“더 ~한”은 plus + 형용사 + que예요.','plus grand que는 “~보다 더 큰”이에요. celui-là는 저 가방을 받아요.'),
    blank('이 가방은 저 가방보다 덜 비싸.','Ce sac est ___ cher que celui-là.','moins','Ce sac est moins cher que celui-là.','“덜”은 moins예요.','moins cher que는 “~보다 덜 비싼”이라는 비교예요.',{glossary:'cher = 비싼'}),
    write('bon의 남성 단수 비교급을 써요.','meilleur','m으로 시작하는 meilleur예요.','bon의 비교급은 plus bon이 아니라 meilleur예요.',{mode:'word'}),
    arrange('이 가방은 저 가방만큼 커.','Ce sac est aussi grand que celui-là.',['Ce','sac','est','aussi','grand','que','celui-là'],'같은 정도는 aussi … que로 나타내요.','aussi grand que는 크기가 같은 정도라는 뜻이에요.'),
    choose('그녀는 나보다 프랑스어를 더 잘해.','Elle parle ___ français que moi.','mieux','Elle parle mieux français que moi.',['mieux','meilleure','meilleur'],'parler라는 행동을 “더 잘” 한다는 뜻이에요.','동사를 꾸미는 bien의 비교급은 mieux예요. 여성형으로 바꾸지 않아요.'),
    blank('이 수프가 더 맛있어.','Cette soupe est ___.','meilleure','Cette soupe est meilleure.','여성 명사 soupe에 맞춰 meilleur에 e를 붙여요.','meilleure는 여성 단수형이에요. 수프의 맛이나 품질을 비교해요.',{glossary:'la soupe = 수프'}),
    arrange('나는 전보다 더 잘 이해해.','Je comprends mieux qu’avant.',['Je','comprends','mieux','qu’avant'],'comprendre를 꾸미는 비교급은 mieux예요.','que는 avant 앞에서 qu’로 줄어요. qu’avant는 “전보다”예요.',{glossary:'comprendre = 이해하다 · avant = 이전에'}),
    blank('이 책들은 더 좋아.','Ces livres sont ___.','meilleurs','Ces livres sont meilleurs.','남성 복수 livres에 맞춰 s를 붙여요.','meilleurs는 남성 복수형이에요. mieux는 명사의 성·수에 맞추는 형용사가 아니에요.'),
    write('이 가방은 저 가방보다 덜 비싸.','Ce sac est moins cher que celui-là.','Ce sac est 뒤에 moins cher que celui-là를 붙여요.','정도가 덜함을 moins … que로 표현해요.'),
    write('이 방은 저 방보다 더 조용해.','Cette chambre est plus calme que celle-là.','여성 명사 chambre를 celle-là로 받아요.','calme는 여기서 여성형도 형태가 같아요. plus … que로 비교해요.',{transfer:true,glossary:'la chambre = 방 · calme = 조용한 · celle-là = 저것(여성)'})
  ]],
  [meta('opinion-links','왜 그렇게 생각하나요','이유·결과·대조를 연결해 의견 쓰기','parce que / donc / pourtant','heart','peach',
    'parce que는 이유, donc는 결과, pourtant는 예상과 다른 대조를 이어줘요. Je pense que 뒤에 생각하는 내용을 붙일 수도 있어요.',
    '긍정형 Je pense que 뒤에서는 생각하는 내용을 직설법으로 말해요. parce que는 il 앞에서 parce qu’il로 줄어요.'),[
    choose('비가 와서 집에 머물러.','Je reste à la maison ___ il pleut.','parce qu’','Je reste à la maison parce qu’il pleut.',['parce qu’','donc','pourtant'],'이유를 잇는 parce que는 il 앞에서 줄어요.','비가 오는 것이 집에 머무르는 이유이므로 parce qu’il pleut라고 해요.'),
    blank('시간이 없기 때문에 나는 갈 수 없어.','Je ne peux pas venir ___ je n’ai pas le temps.','parce que','Je ne peux pas venir parce que je n’ai pas le temps.','이유를 설명하는 parce que를 써요.','je는 자음으로 시작하므로 parce que를 줄이지 않아요.',{glossary:'venir = 오다 / 상대가 있는 곳에 가다'}),
    write('결과를 이어주는 “그래서”에 해당하는 연결어를 써요.','donc','d로 시작하는 네 글자예요.','donc는 앞 내용의 결과나 결론을 이어줄 때 쓰는 말이에요.',{mode:'word'}),
    arrange('비가 와. 그래서 나는 집에 있어.','Il pleut, donc je reste à la maison.',['Il','pleut','donc','je','reste','à','la','maison'],'원인 뒤에 donc로 결과를 이어줘요.','parce que로 이유를 뒤에 붙일 때와 달리, 여기서는 원인을 먼저 말해요.'),
    choose('비가 와. 그런데도 나는 외출해.','Il pleut, ___ je sors.','pourtant','Il pleut, pourtant je sors.',['pourtant','donc','parce que'],'예상과 다른 결과를 pourtant로 이어줘요.','비가 오는데도 외출하므로 대조를 나타내는 pourtant가 어울려요.'),
    blank('나는 이게 중요하다고 생각해.','Je pense ___ c’est important.','que','Je pense que c’est important.','생각의 내용을 que로 연결해요.','긍정문의 Je pense que 뒤에서 사실로 생각하는 내용을 직설법으로 말해요.',{glossary:'important = 중요한'}),
    arrange('이건 비싸. 그런데도 나는 그것을 사고 싶어.','C’est cher, pourtant je veux l’acheter.',['C’est','cher','pourtant','je','veux','l’acheter'],'대조를 pourtant로, 구매 대상은 l’로 받아요.','비싸지만 사고 싶은 마음이 있다는 대조예요. l’는 acheter 앞에 놓아요.',{glossary:'acheter = 사다'}),
    blank('나는 그가 옳다고 생각해.','Je pense qu’il ___ raison.','a','Je pense qu’il a raison.','avoir raison은 “옳다”라는 표현이에요.','긍정형 Je pense que에서 판단 내용을 직설법 a로 써요.',{glossary:'avoir raison = 옳다 / 맞다'}),
    write('비가 와서 집에 머물러.','Je reste à la maison parce qu’il pleut.','Je reste à la maison 뒤에 parce qu’il pleut를 붙여요.','이유를 연결하는 parce que는 il 앞에서 parce qu’로 줄어요.',{accepted:['Parce qu’il pleut, je reste à la maison.']}),
    write('프랑스어를 배우고 있어서 매일 연습해.','Je m’entraîne tous les jours parce que j’apprends le français.','‘연습해’는 je m’entraîne예요. parce que 뒤에 연습하는 이유를 붙여 보세요.','je m’entraîne은 ‘나는 연습해’, j’apprends는 ‘나는 배워’예요. 이 문장에서는 parce que가 연습하는 이유를 이어요.',{transfer:true,glossary:'s’entraîner = 연습하다 · tous les jours = 매일 · apprendre le français = 프랑스어를 배우다',accepted:['Parce que j’apprends le français, je m’entraîne tous les jours.','Je m’entraine tous les jours parce que j’apprends le français.','Parce que j’apprends le français, je m’entraine tous les jours.','Je pratique tous les jours parce que j’apprends le français.','Parce que j’apprends le français, je pratique tous les jours.']})
  ]],
  [meta('necessity','필요와 바람을 전해요','접속법 현재를 쓰는 짧은 문장','Il faut que / Je veux que + 접속법','sparkles','lavender',
    'Il faut que 뒤에는 해야 할 일을, Je veux que 뒤에는 상대가 해 주길 바라는 일을 말해요. 두 표현 모두 que 뒤의 동사를 접속법으로 써요.',
    'tu viens → que tu viennes, tu es → que tu sois처럼 형태가 달라져요. “내가 하고 싶다”는 Je veux + 동사원형을 써요.'),[
    choose('네가 와야 해.','Il faut que tu ___.','viennes','Il faut que tu viennes.',['viennes','viens','viendras'],'Il faut que 뒤에 venir의 접속법을 써요.','tu viens는 직설법, que tu viennes는 접속법 현재예요.'),
    blank('네가 여기에 있어야 해.','Il faut que tu ___ ici.','sois','Il faut que tu sois ici.','être의 tu 접속법은 sois예요.','Il faut que 뒤에서는 tu es가 아니라 tu sois를 써요.'),
    write('faire의 tu 접속법 현재 형태를 써요.','fasses','fass-에 -es를 붙여요.','tu fais는 직설법이에요. 접속법에서는 que tu fasses로 써요.',{mode:'word'}),
    arrange('네가 이 일을 해야 해.','Il faut que tu fasses ce travail.',['Il','faut','que','tu','fasses','ce','travail'],'Il faut que 뒤에 tu fasses를 써요.','필요한 행동을 접속법 fasses로 말해요. ce travail은 “이 일”이에요.'),
    choose('나는 네가 오기를 원해.','Je veux que tu ___.','viennes','Je veux que tu viennes.',['viennes','viens','venir'],'원하는 사람은 je, 오는 사람은 tu예요.','다른 주어의 행동을 바라므로 que tu viennes로 연결해요.'),
    blank('나는 그가 오기를 원해.','Je veux qu’il ___.','vienne','Je veux qu’il vienne.','venir의 il 접속법 형태는 vienne예요.','que는 il 앞에서 qu’로 줄어요. vienne에는 tu형의 s를 붙이지 않아요.'),
    arrange('그녀가 준비되어 있어야 해.','Il faut qu’elle soit prête.',['Il','faut','qu’elle','soit','prête'],'être의 elle 접속법은 soit예요.','soit는 접속법, prête는 여성 주어 elle에 맞춘 형용사예요.',{glossary:'prêt / prête = 준비된'}),
    blank('우리가 떠나야 해.','Il faut que nous ___.','partions','Il faut que nous partions.','partir의 nous 접속법 어미는 -ions예요.','Il faut que가 있으므로 여기의 partions는 접속법 현재예요.',{glossary:'partir = 떠나다'}),
    write('네가 여기에 있어야 해.','Il faut que tu sois ici.','Il faut que 뒤에 tu sois ici를 붙여요.','être의 tu 접속법 sois를 써서 필요한 상태를 표현해요.'),
    write('네게 시간이 좀 있으면 좋겠어.','Je veux que tu aies du temps.','avoir의 tu 접속법은 aies예요.','avoir는 불규칙 접속법을 써요. tu as 대신 que tu aies가 돼요.',{transfer:true,glossary:'avoir du temps = 시간이 있다'})
  ]]
];
