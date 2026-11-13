const S=(title,text,examples=[])=>({title,paragraphs:Array.isArray(text)?text:[text],examples});
const T=(title,rows)=>({title,table:{headers:['형태·구분','규칙·예'],rows}});
const A=(id,title,term,summary,aliases,sections)=>({id,category:'connections',title,fr:term,term,summary,aliases,lessonIds:[],sections});
export const referenceSyntax=[
 A('neutral-relatives','ce qui·ce que·ce dont','relatifs à antécédent neutre','특정 명사 없이 “~하는 것”이나 앞 문장 전체를 받아요.',['ce qui','ce que','ce dont','ce à quoi','중성 관계대명사'],[
  T('뒤 문장의 빠진 자리',[['주어 자리','ce qui arrive · 일어나는 것'],['직접목적어 자리','ce que tu veux · 네가 원하는 것'],['de가 필요한 자리','ce dont tu as besoin · 네가 필요한 것'],['à가 필요한 자리','ce à quoi tu penses · 네가 생각하는 것']]),
  S('문장 전체를 받기','쉼표 뒤의 ce qui·ce que·ce dont는 앞의 상황 전체를 받을 수 있어요. 특정 사람·사물 명사를 받는 qui·que·dont와 구별해요.',[['Elle a réussi, ce qui me réjouit.','그녀가 성공했고, 그 사실이 나를 기쁘게 해.'],['Dis-moi ce que tu veux.','네가 원하는 것을 말해 줘.']]),
  S('de를 두 번 쓰지 않아요','avoir besoin de이므로 ce dont j’ai besoin예요. ce que j’ai besoin de나 ce dont j’en ai besoin처럼 겹치지 않아요. 여러 단어로 된 전치사 뒤에서는 quoi가 필요할 수 있어요.',[['Voilà ce dont je parle.','이게 내가 이야기하는 것이야.'],['C’est ce à quoi je tiens.','그것이 내가 소중히 여기는 것이야.']]),
  S('ce와 celui의 차이','ce que는 막연한 “것”, celui que는 이미 정해진 남성 단수 명사를 대신해요. 성·수를 가진 대상을 받으면 celui·celle·ceux·celles를 선택해요.')]),
 A('quantity-comparison','명사·동작의 수량 비교','comparaison de quantité et d’action','많이·적게·같은 만큼을 명사와 동사에 맞춰 말해요.',['수량 비교','autant de','plus de','moins de','autant que','davantage'],[
  T('비교하는 대상',[['명사','plus de / moins de / autant de + 명사 + que'],['동작','동사 + plus / moins / autant + que'],['형용사·부사','plus / moins / aussi + 형용사·부사 + que']]),
  S('aussi와 autant','성질·방식은 aussi, 행동량은 autant, 명사 수량은 autant de예요. “같다”라는 한국어 뜻만 보고 한 형태로 통일하지 않아요.',[['Elle est aussi rapide que moi.','그녀는 나만큼 빨라.'],['Elle travaille autant que moi.','그녀는 나만큼 일해.'],['Elle a autant de livres que moi.','그녀는 나만큼 책이 많아.']]),
  S('숫자 앞 de와 비교 que','plus de dix는 10보다 많은 수량이에요. plus que moi는 나와 비교해 더 많다는 뜻이에요. ne… que와 함께 쓰는 Il n’a que dix euros는 겨우 10유로만 있다는 제한이에요.',[['Il a plus de dix euros.','그는 10유로 넘게 가지고 있어.'],['Il a plus d’argent que moi.','그는 나보다 돈이 많아.']]),
  S('점차 변하는 비교','de plus en plus·de moins en moins로 증가·감소를 말해요. 명사 앞에서는 de를 더해 de plus en plus de livres처럼 써요. davantage는 더 많이, davantage de는 더 많은 양이에요.',[['Je lis de plus en plus.','나는 점점 더 많이 읽어.']]),
  S('비례하는 두 변화','plus… plus…·moins… moins…로 두 변화의 비례를 나타내요. 더 나은 방식에는 mieux를 써요. 각각의 절은 일반적인 주어+동사 순서를 유지해요.',[['Plus je lis, mieux je comprends.','더 많이 읽을수록 더 잘 이해해.'],['Moins tu dors, plus tu es fatigué.','덜 잘수록 더 피곤해.']])]),
 A('advanced-negation','부정·제한과 허사 ne','négation, restriction et ne explétif','부정의 범위와 부정하지 않는 ne를 구별해요.',['허사 ne','ne explétif','ni','guère','nulle part','ne que','부정 범위'],[
  T('기본 부정의 확장',[['ne… guère','별로 ~않다: Il ne sort guère.'],['ne… nulle part','어디에도 ~않다: Je ne vais nulle part.'],['ne… ni… ni…','~도 ~도 아니다: Je ne bois ni thé ni café.'],['ne… que','오직 ~만: Je ne lis que des romans.'],['ne… pas toujours','항상 ~인 것은 아니다'],['ne… plus jamais','이제 다시는 ~않다']]),
  S('personne·rien과 위치','주어이면 Personne ne vient·Rien ne bouge처럼 써요. 복합시제에서 rien은 보통 조동사 뒤, personne는 보통 과거분사 뒤에 와요. 같은 부정 뜻으로 pas를 추가하지 않아요.',[['Je n’ai rien vu.','나는 아무것도 못 봤어.'],['Je n’ai vu personne.','나는 아무도 못 봤어.']]),
  S('부정이 아닌 허사 ne','격식체에서 craindre que·avant que·à moins que 등 뒤의 ne는 부정하지 않을 수 있어요. Je crains qu’il ne vienne는 “그가 올까 봐 걱정한다”예요. pas가 붙으면 실제 부정이 돼요.',[['Je pars avant qu’il n’arrive.','나는 그가 도착하기 전에 떠나.'],['Je crains qu’il ne vienne pas.','나는 그가 오지 않을까 봐 걱정해.']]),
  S('ne만으로 부정하기','문어체의 oser·cesser·pouvoir·savoir 등은 문맥에 따라 pas 없이 ne로 부정할 수 있어요. Je ne peux vous répondre는 대답할 수 없다는 뜻이라 허사 ne와 달라요. sans que 뒤에는 보통 허사 ne를 넣지 않아요.'),
  S('oui·non·si와 동의','부정 질문을 긍정으로 뒤집을 때 si를 써요. 긍정에 “나도”는 moi aussi, 부정에 “나도 아니야”는 moi non plus예요.',[['Tu ne viens pas ? — Si, je viens.','너 안 와? — 아니, 갈 거야.'],['Je n’ai pas faim. — Moi non plus.','나는 배 안 고파. — 나도.']])]),
 A('inversion','의문문의 도치','inversion du sujet','격식 있는 질문에서 동사와 주어 대명사의 순서를 바꿔요.',['도치','inversion','a-t-il','est-ce que','puis-je'],[
  T('세 가지 질문 형태',[['억양·물음표','Tu viens ?'],['est-ce que','Est-ce que tu viens ?'],['대명사 도치','Viens-tu ?'],['명사 주어의 복합 도치','Paul vient-il ?'],['복합시제','A-t-elle compris ?']]),
  S('연결 t와 붙임표','동사가 모음으로 끝나고 il·elle·on이 이어지면 -t-를 넣어요. 이미 t·d로 끝나면 추가하지 않아요. est-ce que와 도치를 중복하지 않아요.',[['Parle-t-il français ?','그는 프랑스어를 하나요?'],['Prend-elle le train ?','그녀는 기차를 타나요?']]),
  S('의문사가 주어라면','Qui vient ?의 qui가 주어이므로 별도의 il을 덧붙이지 않아요. que가 목적어이면 Que lis-tu ?처럼 쓸 수 있어요. 문어체에서는 Où va Paul ?처럼 명사 주어가 뒤에 오기도 해요.',[['Qui a appelé ?','누가 전화했어?'],['Que veut Paul ?','폴은 무엇을 원해?']]),
  S('je와 도치','일반 대화에서는 Est-ce que je… ?가 편해요. Puis-je… ?·Ai-je… ?·Suis-je… ?는 널리 쓰이는 격식형이에요. 모든 동사에서 je 도치를 일상적으로 만들지는 않아요.'),
  S('질문이 아닌 도치','격식체에서 문두의 peut-être·sans doute·결과 뜻의 aussi 뒤에도 도치가 나타나요. 직접 인용을 끼우는 dit-il도 질문이 아니에요. 일상적으로는 Peut-être qu’il viendra처럼 풀어 쓸 수 있어요.',[['Peut-être viendra-t-il demain.','아마 그는 내일 올 거야.'],['« Je pars », dit-elle.','“나는 떠나”, 그녀가 말한다.']])]),
 A('exclamation-emphasis','감탄·강조·분리문','exclamation, mise en relief et dislocation','문장 중 특히 보여 주고 싶은 부분을 앞으로 꺼내요.',['감탄문','강조구문','분리문','c’est qui','c’est que','mise en relief'],[
  T('감탄하는 방법',[['quel + 명사','Quelle belle journée !'],['comme + 문장','Comme tu as grandi !'],['que + 문장','Que c’est beau !'],['명사·감탄사','Bravo ! / Quel dommage !']]),
  S('c’est… qui / que','강조 부분이 뒤 문장의 주어이면 qui, 그 밖의 성분이면 que를 써요. 주어를 강조한 qui 뒤의 동사는 그 인칭과 일치해요.',[['C’est moi qui ai appelé.','전화한 사람은 나야.'],['C’est ce livre que je cherche.','내가 찾는 건 이 책이야.'],['C’est demain que je pars.','내가 떠나는 건 내일이야.']]),
  S('문장 밖으로 꺼내고 대명사로 받기','구어에서는 대상을 먼저 꺼낸 뒤 문장 안에서 대명사로 다시 받을 수 있어요. 문법적 역할에 맞는 대명사를 써야 해요.',[['Ce livre, je l’ai lu.','이 책, 나는 읽었어.'],['Paul, je lui ai parlé.','폴, 나는 그에게 이야기했어.']]),
  S('ce que… c’est…','막연한 내용을 먼저 제시하고 뒤에서 구체화할 수도 있어요. ce qui·ce que·ce dont는 뒤 절에서의 역할에 맞춰요.',[['Ce dont j’ai besoin, c’est de repos.','내게 필요한 것은 휴식이야.']])]),
 A('completive','que절과 보충절','propositions subordonnées complétives','생각·감정·판단의 내용을 하나의 절로 넣어요.',['보충절','명사절','complétive','à ce que','de ce que'],[
  S('문장 안의 한 자리','que절 전체가 주어·목적어·형용사의 보충 내용이 될 수 있어요. que는 이때 관계대명사처럼 절 안의 목적어를 대신하지 않고 두 절을 이어 줘요.',[['Je sais qu’elle vient.','나는 그녀가 온다는 것을 알아.'],['Le livre que je lis est court.','내가 읽는 책은 짧아. (이 que는 관계대명사)']]),
  T('연결 구조',[['동사 + que','Je crois qu’il a raison.'],['형용사 + que','Je suis heureux que tu sois là.'],['à ce que','Je tiens à ce que tu viennes.'],['de ce que','Je me plains de ce qu’il arrive toujours en retard.'],['주어인 절','Qu’il refuse est possible.']]),
  S('법의 선택','절을 도입하는 동사·판단과 그 문맥이 법을 정해요. 확신·사실 전달은 직설법, 의지·감정·필요·의심은 접속법이 흔해요. que 자체만 보고 고르지 않아요.',[['Je constate qu’il est absent.','나는 그가 결석한 사실을 확인해.'],['Je regrette qu’il soit absent.','나는 그가 결석한 것이 유감이야.']]),
  S('원형으로 줄이기','같은 사람이 하는 행동이면 원형이 자연스러운 동사가 많아요. 하지만 어떤 동사든 자동으로 원형으로 바꿀 수 있는 것은 아니므로 결합 방식도 확인해요.',[['Je souhaite partir. / Je souhaite que tu partes.','나는 떠나고 싶어. / 나는 네가 떠나기를 바라.']])]),
 A('indirect-questions','간접의문문','interrogation indirecte','질문을 다른 문장 안에 넣어요.',['간접의문문','demander si','savoir si','ce qui se passe','ce que tu fais'],[
  T('직접 질문 → 간접 질문',[['Tu viens ?','Je demande si tu viens.'],['Où vas-tu ?','Je demande où tu vas.'],['Qu’est-ce que tu fais ?','Je demande ce que tu fais.'],['Qu’est-ce qui se passe ?','Je demande ce qui se passe.'],['À quoi penses-tu ?','Je demande à quoi tu penses.']]),
  S('보통 도치를 하지 않아요','간접의문절에서는 est-ce que를 빼고 주어+동사 순서를 써요. 전체 문장이 질문이 아니면 물음표를 붙이지 않아요. Qui vient ?처럼 의문사가 주어인 경우는 qui vient를 유지해요.',[['Je ne sais pas où elle habite.','나는 그녀가 어디 사는지 몰라.']]),
  S('si의 두 역할','간접 질문의 si는 “~인지”예요. 조건을 뜻하는 si와 달리 미래형·조건법이 올 수 있어요.',[['Je me demande s’il viendra.','나는 그가 올지 궁금해.'],['S’il vient, je serai content.','그가 오면 나는 기쁠 거야.']]),
  S('주절이 과거일 때','과거에 질문했던 내용을 전달하면 일반적인 간접화법의 시제 일치를 적용할 수 있어요. 지금도 유효한 내용인지에 따라 현재를 유지하는 경우도 있어요.',[['Elle a demandé où j’habitais.','그녀는 내가 어디 사는지 물었어.']])]),
 A('cause','원인과 이유','expression de la cause','새 이유를 설명하는지, 이미 아는 근거인지 구분해요.',['원인','이유','parce que','puisque','comme','grâce à','à cause de','faute de'],[
  T('절과 명사 연결',[['parce que + 직설법','질문에 대한 이유·새 설명'],['puisque + 직설법','이미 인정하거나 알고 있는 근거'],['comme + 직설법','보통 문장 앞에서 배경 이유'],['car','앞 발언에 설명을 덧붙이는 등위접속사'],['à cause de + 명사','대체로 부정적 원인'],['grâce à + 명사','대체로 긍정적 도움·원인'],['faute de + 명사·원형','~이 없어서 / ~하지 못해서']]),
  S('같은 사실도 제시 방식이 달라요','parce que는 왜인지 답해요. puisque는 상대도 알 법한 사실에서 결론을 이끌어요. 원인절이 실제 사실이면 보통 직설법이에요.',[['Je reste parce qu’il pleut.','비가 오기 때문에 나는 남아.'],['Puisque tu es là, aide-moi.','네가 여기 있으니 나를 도와줘.']]),
  S('이유를 부정할 때','non que·ce n’est pas que 뒤에서는 그 이유를 부정하므로 접속법을 써요. 실제 이유는 mais parce que 등으로 이어 설명해요.',[['Je reste, non que je sois fatigué, mais parce qu’il pleut.','나는 남아. 피곤해서가 아니라 비가 와서야.']]),
  S('명사·원형으로 줄이기','원인의 주체가 같으면 pour avoir + 과거분사 등도 가능해요. 명사와 절을 섞지 말고 à cause de la pluie / parce qu’il pleut처럼 구조를 구분해요.',[['Faute de temps, nous reportons la réunion.','시간이 없어서 우리는 회의를 미뤄.']])]),
 A('consequence','결과와 정도','expression de la conséquence','일어난 결과와 결과를 낳는 정도를 표현해요.',['결과','conséquence','si que','tellement','si bien que','de sorte que','trop pour'],[
  T('결과 구조',[['donc / alors / par conséquent','문장 사이 결과 연결'],['si + 형용사·부사 + que','Il est si fatigué qu’il dort.'],['tellement + 동사 또는 형용사 + que','Il travaille tellement qu’il est épuisé.'],['tant de + 명사 + que','Il a tant de livres qu’il manque de place.'],['si bien que + 직설법','실제로 일어난 결과'],['trop / assez… pour + 원형','~하기에 너무 / 충분히']]),
  S('실제 결과는 직설법','결과가 사실로 제시되면 보통 직설법을 써요. 정도의 si는 조건의 si와 달라요.',[['Il pleut, si bien que nous restons ici.','비가 와서 우리는 여기 머물러.'],['Elle parle assez fort pour être entendue.','그녀는 들릴 만큼 충분히 크게 말해.']]),
  S('다른 주어가 이어질 때','trop·assez… pour que 뒤에는 접속법을 써요. 그 결과가 가능한지·불가능한지 평가하는 구조예요.',[['Il parle trop vite pour que je comprenne.','그는 너무 빨리 말해서 내가 이해할 수 없어.']]),
  S('de sorte que의 두 뜻','이미 일어난 결과라면 직설법, 실현하려는 목적이라면 접속법을 써요. 연결어를 단어 하나로 암기하기보다 뒤 사건의 지위를 확인해요.',[['Il a tout expliqué, de sorte que nous avons compris.','그가 전부 설명해서 우리는 이해했어.']])]),
 A('purpose','목적을 나타내는 표현','expression du but','무엇을 이루기 위해 행동하는지 말해요.',['목적','but','pour que','afin de','de peur que','de façon à'],[
  T('주어에 따른 선택',[['같은 행동 주체','pour / afin de + 원형'],['별도 주어를 가진 절','pour que / afin que + 접속법'],['방식으로 목적 달성','de manière à / de façon à + 원형'],['피하려는 결과','de peur de + 원형 / de peur que + 접속법']]),
  S('행동하는 사람이 같은지 확인','Je travaille pour réussir에서는 일하는 사람과 성공할 사람이 같아요. 다른 사람이 목적 행동을 하면 que절로 주어를 밝혀요.',[['Je parle lentement pour que tu comprennes.','네가 이해하도록 나는 천천히 말해.'],['Je révise afin de réussir.','나는 합격하기 위해 복습해.']]),
  S('부정과 대명사 위치','원형 앞에 ne pas를 놓고 목적어 대명사도 원형 앞에 둬요. que절은 활용된 동사를 ne… pas로 감싸요.',[['Je note tout pour ne rien oublier.','아무것도 잊지 않으려고 나는 전부 적어.'],['Je l’appelle pour lui expliquer.','설명해 주려고 나는 그에게 전화해.']]),
  S('목적과 실제 결과','목적은 아직 실현 여부를 단정하지 않기 때문에 pour que 뒤에 접속법을 써요. de peur que 뒤의 ne는 허사일 수 있으므로 실제 부정인지 확인해요.')]),
 A('opposition','대조와 반대','expression de l’opposition','서로 다른 사실·선택을 나란히 보여 줘요.',['대조','반대','opposition','alors que','tandis que','au lieu de','contrairement'],[
  T('대조 구조',[['mais','두 내용을 간단히 대조'],['alors que / tandis que + 직설법','반대되는 사실 비교'],['en revanche / par contre','앞 내용과 다른 측면'],['contrairement à + 명사','~와 달리'],['au lieu de + 명사·원형','~ 대신에'],['plutôt que de + 원형','~하기보다는']]),
  S('사실과 사실의 차이','Léa aime le thé alors que Paul préfère le café는 두 취향의 차이예요. 기대와 반대의 결과를 말하는 양보와 구별할 수 있어요.',[['Je travaille tandis qu’il se repose.','나는 일하는 반면 그는 쉬어.']]),
  S('대조인지 시간인지','alors que·tandis que는 문맥에 따라 “~하는 동안”이라는 동시 시간도 나타내요. 두 사건의 차이를 강조하는지 함께 일어나는지를 읽어요.',[['Tandis que je lisais, le téléphone a sonné.','내가 읽고 있는 동안 전화가 울렸어.']]),
  S('원형의 주체','au lieu de partir의 주체는 보통 주절과 같아요. 다르면 절이나 명사로 분명히 표현해야 해요.',[['Elle a appelé au lieu d’écrire.','그녀는 글을 쓰는 대신 전화했어.']])]),
 A('concession','양보와 예상 밖의 결과','expression de la concession','장애가 있어도 결과가 달라지지 않음을 말해요.',['양보','concession','bien que','quoique','même si','avoir beau','quoi que','quel que'],[
  T('법과 구조',[['bien que / quoique','접속법'],['même si','직설법'],['malgré / en dépit de','명사구'],['pourtant / cependant / néanmoins','독립 문장 연결'],['avoir beau + 원형','아무리 ~해도'],['quoi que / qui que / où que','접속법: 무엇을 / 누구이든 / 어디이든']]),
  S('이미 사실이어도 접속법','bien que는 사실을 인정하면서 양보할 때도 접속법이에요. “현실이면 항상 직설법”으로 판단하지 않아요.',[['Bien qu’il soit fatigué, il continue.','그는 피곤하지만 계속해.'],['Même s’il est fatigué, il continue.','그는 피곤해도 계속해.']]),
  S('avoir beau의 활용','avoir만 시제와 인칭에 맞추고 beau는 그대로예요. 뒤에는 시도와 반대되는 결과가 자연스럽게 이어져요.',[['J’ai beau chercher, je ne trouve rien.','아무리 찾아도 아무것도 못 찾겠어.']]),
  S('quoique와 quoi que','quoique는 “비록 ~지만”인 한 단어, quoi que는 “무엇을 ~하든”인 두 단어예요. quel que는 뒤 주어의 성·수에 맞춰요.',[['Quoi que tu fasses, reste prudent.','무엇을 하든 조심해.'],['Quelle que soit la raison, écoute-le.','이유가 무엇이든 그의 말을 들어 봐.']])]),
 A('condition-connectors','조건·가정의 여러 연결법','condition et hypothèse hors de si','si 이외의 조건과 현실에 반하는 가정을 표현해요.',['조건 접속사','à condition que','pourvu que','au cas où','à moins que','sans toi'],[
  T('연결어별 법',[['à condition que / pourvu que','접속법'],['à moins que','접속법, 선택적인 허사 ne'],['en supposant que','접속법이 일반적'],['au cas où','조건법'],['à condition de','원형: 같은 행동 주체'],['sans + 명사 / avec + 명사','조건을 문맥으로 암시']]),
  S('au cas où는 접속법이 아니에요','“혹시 ~할 경우에 대비해서”는 조건법을 써요. pourvu que는 조건뿐 아니라 간절한 바람도 표현해요.',[['Prends un manteau au cas où il ferait froid.','추울 경우에 대비해 외투를 가져가.'],['Pourvu qu’il vienne !','그가 오면 좋겠어!']]),
  S('si와 혼합 가정','si + 대과거 뒤에 조건법 현재가 오면 과거 조건의 현재 결과예요. 간접 질문의 si 뒤에는 미래·조건법도 가능하므로 조건의 si와 구분해요.',[['Si j’avais étudié, je saurais répondre.','공부했더라면 지금 답할 줄 알 텐데.']]),
  S('조건을 짧게 제시하기','sans toi는 “네가 없으면 / 없었더라면” 같은 가정일 수 있어요. 동사의 시제가 어느 시간의 결과인지 보여 줘요.',[['Sans toi, je n’aurais pas réussi.','네가 없었더라면 나는 성공하지 못했을 거야.']])]),
 A('time-clauses','시간절과 사건 순서','subordonnées de temps','두 행동의 전후·동시·지속 관계를 연결해요.',['시간절','avant que','après que','dès que','jusqu’à ce que','depuis que','tant que'],[
  T('시간 관계와 법',[['quand / lorsque / pendant que','직설법: 시점·동시'],['dès que / aussitôt que / après que','직설법: 직전 완료 이후'],['avant que / jusqu’à ce que','접속법: 아직 이루어지지 않은 경계'],['depuis que','직설법: 시작 이후 지속'],['tant que','직설법: 그 상태가 지속되는 동안'],['en attendant que','접속법: ~하기를 기다리는 동안']]),
  S('미래에도 미래 시제를 써요','프랑스어의 quand·dès que 뒤에는 미래 사건에 미래형을 쓸 수 있어요. 영어식으로 항상 현재형으로 바꾸지 않아요. 먼저 완료될 일은 미래완료로 나타낼 수 있어요.',[['Quand tu arriveras, appelle-moi.','도착하면 전화해.'],['Dès que tu auras fini, nous partirons.','네가 다 끝내면 바로 우리는 떠날 거야.']]),
  S('avant que와 après que','avant que는 접속법이며 허사 ne가 들어갈 수 있어요. après que는 표준 규범에서 직설법이에요. 같은 주체라면 avant de + 원형, après + 원형 과거로 줄일 수 있어요.',[['Je range avant de partir.','떠나기 전에 나는 정리해.'],['Je me repose après avoir travaillé.','일한 뒤에 나는 쉬어.']]),
  S('depuis와 시제','현재까지 지속되는 일은 depuis que절과 주절의 의미를 함께 봐요. 시작 사건은 복합과거, 지속 상태는 현재로 나타낼 수 있어요.',[['Depuis que j’ai déménagé, je marche davantage.','이사한 뒤로 나는 더 많이 걸어.']])]),
 A('subjunctive-choice','접속법과 직설법의 선택','choix entre subjonctif et indicatif','의지·감정·확신과 문장 구조에 따라 법을 선택해요.',['접속법 용법','indicatif ou subjonctif','espérer','douter','le seul','chercher quelqu’un'],[
  T('대표적인 선택',[['의지·필요','vouloir que, exiger que, il faut que → 접속법'],['감정·평가','regretter que, être content que → 접속법'],['의심·가능성','douter que, il est possible que → 접속법'],['사실·확신','savoir que, constater que, il est certain que → 직설법'],['긍정의 바람','espérer que → 보통 직설법: 미래도 가능'],['확신 부정','ne pas penser que → 접속법이 흔함']]),
  S('부정과 질문은 문맥을 봐요','penser·croire가 부정·의문이라고 무조건 접속법인 것은 아니에요. 사실로 유지하는지 의심하는지에 따라 선택이 달라져요. 접속법도 실제로 일어난 일에 대한 감정에서 쓰여요.',[['Je suis heureux que tu sois venu.','네가 와 줘서 기뻐. (남성 상대, 실제 방문)'],['J’espère qu’il viendra.','나는 그가 오기를 바라.']]),
  S('찾는 대상의 존재 여부','관계절에서도 확실한 대상을 설명하면 직설법, 존재가 불확실한 대상을 바랄 때 접속법을 쓸 수 있어요. le seul·le meilleur 뒤에서도 평가·가능성의 접속법이 흔하지만 직설법이 불가능한 것은 아니에요.',[['Je cherche un guide qui parle coréen.','나는 한국어를 하는 가이드를 찾고 있어. (그런 능력을 사실로 제시)'],['Je cherche un guide qui puisse m’aider.','나는 나를 도와줄 수 있는 가이드를 찾고 있어. (희망 조건)']]),
  T('불규칙·두 어간 현재형',[['aller','aille, ailles, aille, allions, alliez, aillent'],['pouvoir','puisse, puisses, puisse, puissions, puissiez, puissent'],['savoir','sache, saches, sache, sachions, sachiez, sachent'],['vouloir','veuille, veuilles, veuille, voulions, vouliez, veuillent'],['prendre','prenne, prennes, prenne, prenions, preniez, prennent']]),
  S('시제 선택','현재·미래의 동시·후속 행동은 주로 접속법 현재, 앞선 완료는 접속법 과거로 구분해요. 현대 프랑스어는 주절이 과거여도 이 두 형태를 널리 써요.'),
  S('독립 문장에서의 바람·지시','주절 없이도 Que + 접속법으로 바람이나 제3자에 대한 지시를 할 수 있어요. Vive… !·Soit… 같은 굳어진 표현에도 접속법이 나타나요.',[['Qu’il entre !','그가 들어오게 해!'],['Vive la liberté !','자유 만세!']])]),
 A('participial-clauses','분사절과 원형절','propositions participiales et infinitives','활용 동사 없이 별도 행동을 문장에 넣어요.',['분사절','원형절','독립 분사구문','proposition participiale','absolue'],[
  S('자체 주어가 있는 분사절','Le repas terminé에서 le repas가 terminé의 주어예요. 주절과 다른 주어를 가지며 시간·이유·조건 같은 관계를 문맥으로 나타내요.',[['Le repas terminé, les invités partirent.','식사가 끝나자 손님들이 떠났다.']]),
  T('구조 비교',[['독립 분사절','La nuit tombant, nous rentrons.'],['주절 주어를 꾸미는 분사','Voyant la pluie, Léa rentre.'],['주어를 공유하는 제롱디프','Léa chante en marchant.'],['지각동사 뒤 원형절','J’entends les oiseaux chanter.']]),
  S('잘못 연결된 주어 피하기','En marchant, la pluie a commencé라고 하면 걷는 주체가 비인 것처럼 연결돼요. Quand je marchais, la pluie a commencé처럼 실제 주어를 밝히면 분명해요.',[['En marchant, j’ai entendu un bruit.','걷다가 나는 소리를 들었어.']]),
  S('수동·완료 분사','주어가 행동을 당하는 경우 과거분사나 étant + 과거분사를 써요. 현재분사 자체는 불변이지만 과거분사는 해당 명사와 일치할 수 있어요.',[['Les portes étant fermées, nous attendons.','문들이 닫혀 있어서 우리는 기다려.']])]),
 A('coordination','등위·병렬·종속 연결','coordination, juxtaposition et subordination','두 말을 같은 층위로 잇는지 한 문장 안에 넣는지 구분해요.',['등위접속','병렬','종속','coordination','juxtaposition','mais ou et donc or ni car'],[
  T('세 가지 연결',[['등위','Je lis et elle écrit.'],['병렬','Je lis ; elle écrit.'],['종속','Je lis pendant qu’elle écrit.']]),
  S('등위접속사','mais·ou·et·or·ni·car는 같은 문법적 층위의 말이나 절을 이어요. 전통 암기표의 donc는 현대 분석에서 연결 부사로 분류되기도 해요. or는 논증에서 새 사실을 제시하며 영어 or의 선택 뜻과 달라요.',[['Il voulait venir, mais il était malade.','그는 오고 싶었지만 아팠어.']]),
  S('같은 구조끼리 연결','단어와 절을 어색하게 섞지 말고 반복되는 구조를 맞춰요. à·de·en 등은 연결되는 대상 앞에서 반복해야 명확한 경우가 많아요.',[['Je parle à Paul et à Léa.','나는 폴과 레아에게 이야기해.'],['Elle aime lire et écrire.','그녀는 읽고 쓰는 것을 좋아해.']]),
  S('겹친 종속절','parce que… et que…처럼 같은 연결 관계를 que로 이어 받을 수 있어요. que가 어느 동사·접속어에 속하는지 찾으면 긴 문장을 읽기 쉬워져요.',[['Je reste parce qu’il pleut et que je suis fatigué.','비가 오고 내가 피곤해서 나는 남아.']])]),
 A('relative-meaning','관계절의 범위와 법','relatives déterminatives et explicatives','누구인지 좁히는 정보와 덧붙이는 정보를 구별해요.',['제한적 관계절','설명적 관계절','관계절 쉼표','antécédent','선행사'],[
  S('대상을 제한하기','Les élèves qui ont fini peuvent sortir에서 관계절은 끝낸 학생들로 범위를 좁혀요. 모든 학생이 끝냈다고 말하는 문장이 아니에요.',[['Les livres qui sont sur la table sont à moi.','탁자 위에 있는 책들은 내 것이야.']]),
  S('추가 설명하기','쉼표로 분리한 관계절은 이미 정해진 대상에 정보를 덧붙여요. 쉼표를 빼면 대상 범위와 의미가 달라질 수 있어요.',[['Les élèves, qui ont tous fini, peuvent sortir.','학생들은 모두 끝냈으므로 나가도 돼.']]),
  T('선행사와 절 안의 역할',[['선행사','관계대명사가 받는 명사·대명사·내용'],['qui','관계절 안의 주어'],['que','관계절 안의 직접목적어'],['dont','관계절 안의 de 결합'],['전치사 + lequel','성·수가 있는 대상을 전치사와 연결']]),
  S('대상을 모를 때 접속법','조건에 맞는 대상이 존재하는지 확실하지 않으면 접속법을 쓸 수 있어요. 알려진 사실이면 직설법이 자연스러워요. Je cherche quelqu’un qui sache…의 sache를 단순 오탈자로 보지 않아요.',[['Je cherche quelqu’un qui sache réparer cela.','나는 이것을 고칠 줄 아는 사람을 찾고 있어.']])]),
 A('cohesion','글의 연결과 지시 대상','cohésion du texte et reprises','같은 대상을 이어 받고 생각의 순서를 표시해요.',['글의 연결','응집성','cohésion','anaphore','d’abord','ce dernier'],[
  T('생각의 순서',[['시작·순서','d’abord, ensuite, enfin'],['추가','de plus, en outre'],['예시·바꾸어 말하기','par exemple, autrement dit'],['요약·결론','en somme, pour conclure'],['주제 전환','quant à, en ce qui concerne']]),
  S('대명사의 지시 대상','il·elle·le·lui가 무엇을 받는지 가까운 문장만으로 분명해야 해요. 같은 성의 사람이 둘 나오면 이름이나 명사를 다시 쓰는 편이 명확해요.',[['Paul parle à Marc. Marc sourit.','폴이 마르크에게 말해. 마르크가 웃어. (Il의 모호함을 피함)']]),
  S('명사로 다시 받기','동일 대상을 반복할 때 정관사·지시형용사·동의어·상위어로 이어 받을 수 있어요. 새로운 대상을 소개하는 un과 이미 알려진 대상을 받는 le의 차이가 글에서도 중요해요.',[['J’ai vu un chien. Cet animal semblait perdu.','나는 개 한 마리를 봤어. 그 동물은 길을 잃은 것 같았어.']]),
  S('논리와 시간은 달라요','ensuite는 시간·순서, donc는 결과, pourtant는 예상과 반대의 관계예요. 연결어가 많아도 관계가 맞지 않으면 글이 자연스럽지 않아요.')]),
 A('enunciation','발화 상황과 문체','énonciation, déictiques et registres','누가 언제 어디서 말하는지에 따라 표현이 달라져요.',['발화','문체','registre','déictique','ici','maintenant','담화'],[
  S('말하는 자리에서 정해지는 뜻','je·tu·ici·maintenant·demain은 말하는 사람·장소·시점을 알아야 해석할 수 있어요. 날짜·지명·이름으로 직접 정한 표현과 구분해요.',[['Je viendrai demain.','나는 내일 올게. (말한 날짜를 알아야 “내일”을 알 수 있음)']]),
  T('상황 기준이 바뀌면',[['ici → là','여기 → 거기'],['aujourd’hui → ce jour-là','오늘 → 그날'],['demain → le lendemain','내일 → 다음 날'],['hier → la veille','어제 → 전날'],['maintenant → à ce moment-là','지금 → 그때']]),
  S('문체에 맞추기','일상 구어에서는 on·ça·억양 질문·ne 생략이 흔해요. 정돈된 글에서는 nous·cela·완전한 부정과 문장 구조를 선택할 수 있어요. 구어가 모두 틀렸다는 뜻은 아니에요.',[['Je sais pas. → Je ne sais pas.','일상 구어의 ne 생략 → 정돈된 표기']]),
  S('확신과 거리 두기','peut-être·sans doute·probablement·selon 등으로 확신이나 출처를 표시해요. 보도에서 조건법은 확인되지 않은 정보를 전달하는 역할도 해요.',[['Selon lui, le train serait en retard.','그의 말에 따르면 기차가 지연된다고 해. (정보에 거리를 둠)']])]),
 A('discourse-types','직접·간접·자유간접화법','discours direct, indirect et indirect libre','말과 생각을 전달하는 세 방식을 비교해요.',['자유간접화법','discours indirect libre','인용','화법'],[
  T('같은 말을 옮기는 방법',[['직접화법','Léa dit : « Je partirai demain. »'],['간접화법','Léa dit qu’elle partira demain.'],['과거 기준 간접화법','Léa a dit qu’elle partirait le lendemain.'],['자유간접화법','Elle regarda sa valise. Elle partirait demain !']]),
  S('직접과 간접','직접화법은 말한 사람의 인칭·표현을 인용해요. 간접화법은 전달자의 관점으로 인칭·시간·장소를 조정해요. 전달 시점이 같다면 demain을 유지할 수도 있으므로 자동 치환은 아니에요.'),
  S('자유간접화법','소설에서 que나 따옴표 없이 인물의 생각을 서술자 문장 안에 섞어요. 3인칭·과거 서술을 유지하면서 감탄·질문·demain 같은 인물의 관점이 남을 수 있어요.',[['Il hésitait. Devait-il vraiment partir ?','그는 망설였다. 정말 떠나야 하는 걸까?']]),
  S('명령을 전달하기','명령은 demander·dire·ordonner à quelqu’un de + 원형으로 전달할 수 있어요. 동사에 따라 요청인지 지시인지 강도가 달라져요.',[['« Attends ! » → Elle me demande d’attendre.','“기다려!” → 그녀는 내게 기다려 달라고 해.']])])
];
