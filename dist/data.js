export const lessons = [
  { id: 'greetings', title: '반가워요, Bonjour!', subtitle: '인사하고 안부 묻기', icon: 'sun', color: 'peach', category: '첫걸음', tip: 'Bonjour는 낮에, Bonsoir는 저녁에 쓰는 인사예요. 처음 만난 사람에게는 정중한 vous를 써 보세요.', phrases: [
    ['Bonjour !', '안녕하세요!', '봉주르', '낮에 만났을 때 쓰는 인사예요. 처음 만난 사람이나 가게 직원에게도 사용할 수 있어요.'],
    ['Bonsoir !', '안녕하세요! (저녁 인사)', '봉수아르', '저녁에 만났을 때 쓰는 인사예요. 잠자리에 들며 하는 인사 Bonne nuit와 구분해요.'],
    ['Salut !', '안녕!', '살뤼', '친구나 가까운 사람에게 만날 때도, 헤어질 때도 써요. 정중한 상황에서는 Bonjour나 Au revoir가 좋아요.'],
    ['Comment allez-vous ?', '어떻게 지내세요?', '코망 탈레 부', 'allez는 aller의 vous 형태예요. vous는 한 사람에게 정중하게 말하거나 여러 사람을 가리킬 때 써요.'],
    ['Très bien, merci.', '아주 잘 지내요, 고마워요.', '트레 비앵, 메르시', 'Très bien은 “아주 잘”, merci는 “고마워요”예요. 안부를 묻는 질문에 답하는 짧은 표현이에요.'],
    ['Au revoir !', '안녕히 가세요!', '오 르부아르', '상대가 떠나거나 내가 떠날 때 모두 쓸 수 있어요. 한국어의 “안녕히 가세요 / 계세요”를 모두 표현해요.']
  ] },
  { id: 'introductions', title: '내 이름은…', subtitle: '나를 소개하는 첫 문장', icon: 'smile', color: 'lavender', category: '첫걸음', tip: 'Je m’appelle 다음에 자신의 이름을 넣어 보세요. Corée는 한국, français는 프랑스어를 뜻해요.', phrases: [
    ["Je m’appelle Minji.", '제 이름은 민지예요.', '쥬 마펠 민지', 'Je m’appelle는 “내 이름은 ~이다”예요. m’는 me가 모음 앞에서 줄어든 형태이고, 뒤에는 이름을 넣어요.'],
    ['Comment vous appelez-vous ?', '성함이 어떻게 되세요?', '코망 부 자플레 부', 'vous appelez를 질문 어순 appelez-vous로 바꾼 표현이에요. vous를 써서 이름을 정중하게 물어요.'],
    ['Je viens de Corée.', '저는 한국에서 왔어요.', '쥬 비앵 드 코레', 'Je viens de는 “나는 ~에서 왔다”예요. Corée 앞의 de는 출신을 나타내며 이 표현에서는 관사를 넣지 않아요.'],
    ['Je parle un peu français.', '저는 프랑스어를 조금 해요.', '쥬 파를 앙 푀 프랑세', 'un peu는 “조금”이에요. 언어를 말할 때 parler 뒤에는 보통 관사 없이 français를 써요.'],
    ['Et vous ?', '당신은요?', '에 부', 'Et는 “그리고”, vous는 정중한 “당신”이에요. 내 답 뒤에 붙이면 같은 질문을 상대에게 돌릴 수 있어요.'],
    ['Ravi de vous rencontrer.', '만나서 반갑습니다. (남성 화자)', '라비 드 부 랑콩트레', 'ravi는 말하는 사람이 남성일 때, ravie는 여성일 때 써요. 철자에서 e만 다르고 발음은 같아요.']
  ] },
  { id: 'politeness', title: '작은 말, 큰 친절', subtitle: '고마움과 부탁 표현하기', icon: 'heart', color: 'mint', category: '첫걸음', tip: 'S’il vous plaît는 정중한 부탁에 붙이는 표현이에요. 친한 사람 한 명에게는 S’il te plaît라고 해요.', phrases: [
    ['Merci beaucoup.', '정말 감사합니다.', '메르시 보쿠', 'beaucoup는 “많이”예요. Merci 뒤에 붙여 고마움을 더 강조해요.'],
    ['S’il vous plaît.', '부탁합니다.', '실 부 플레', '정중한 부탁에 붙이는 고정 표현이에요. 친한 사람 한 명에게는 vous 대신 te를 써서 s’il te plaît라고 해요.'],
    ['De rien.', '천만에요.', '드 리앵', '감사를 받았을 때 쓰는 “천만에요”예요. rien은 “아무것도”라는 말이지만 이 표현은 통째로 익혀요.'],
    ['Excusez-moi.', '실례합니다.', '엑스퀴제 무아', 'excuser의 정중한 명령형 Excusez에 moi를 연결했어요. 두 부분 사이에 하이픈을 써요.'],
    ['Pardon.', '미안합니다.', '파르동', '가벼운 사과뿐 아니라 사람들 사이를 지나갈 때 “잠시만요”라는 뜻으로도 써요.'],
    ['Ce n’est pas grave.', '괜찮아요. (큰일 아니에요)', '스 네 파 그라브', 'grave는 “심각한”이에요. Ce n’est pas grave는 심각한 일이 아니라며 상대를 안심시키는 표현이에요.']
  ] },
  { id: 'cafe', title: '파리의 작은 카페', subtitle: '커피와 크루아상 주문하기', icon: 'coffee', color: 'butter', category: '일상 회화', tip: 'Je voudrais는 ‘~을 원합니다’라는 정중한 주문 표현이에요. 원하는 메뉴를 뒤에 붙여 보세요.', phrases: [
    ['Un café, s’il vous plaît.', '커피 한 잔 주세요.', '앙 카페, 실 부 플레', '프랑스에서 un café는 보통 에스프레소예요'],
    ['Je voudrais un croissant.', '크루아상 하나 주세요.', '쥬 부드레 앙 크루아상', 'Je voudrais는 정중한 요청이에요. croissant은 남성 명사라 un croissant이라고 써요.'],
    ['Sur place ou à emporter ?', '드시고 가시나요, 포장하시나요?', '쉬르 플라스 우 아 앙포르테', 'sur place는 “매장에서”, à emporter는 “가지고 갈”이라는 뜻이에요. 가운데 ou는 “또는”이에요.'],
    ['À emporter, s’il vous plaît.', '포장해 주세요.', '아 앙포르테, 실 부 플레', 'à emporter는 포장 주문에 쓰는 표현이에요. 매장에서 먹으려면 Sur place, s’il vous plaît라고 해요.'],
    ['L’addition, s’il vous plaît.', '계산서 주세요.', '라디시옹, 실 부 플레', 'addition은 식사 계산서라는 여성 명사예요. 모음으로 시작하므로 la addition 대신 l’addition이라고 써요.'],
    ['C’est délicieux !', '정말 맛있어요!', '세 델리시외', 'C’est는 “이것은 ~이다”예요. délicieux를 붙여 음식이 맛있다고 표현해요.']
  ] },
  { id: 'numbers', title: '하나, 둘, trois', subtitle: '숫자와 가격 말하기', icon: 'hash', color: 'lavender', category: '일상 회화', tip: '프랑스어의 r, u, 비모음은 한국어로 정확히 옮기기 어려워요. 한글 표기는 참고하고 소리를 여러 번 들어 보세요.', phrases: [
    ['Un, deux, trois.', '하나, 둘, 셋.', '앙, 되, 트루아', '숫자 1, 2, 3'],
    ['Quatre, cinq, six.', '넷, 다섯, 여섯.', '카트르, 생크, 시스', '숫자 4, 5, 6'],
    ['Sept, huit, neuf, dix.', '일곱, 여덟, 아홉, 열.', '세트, 위트, 너프, 디스', '숫자 7, 8, 9, 10'],
    ['Combien ça coûte ?', '이거 얼마예요?', '콩비앵 사 쿠트', 'combien은 “얼마나”, ça coûte는 “그것은 값이 ~이다”예요. 일상에서 가격을 묻는 질문으로 써요.'],
    ['Ça coûte cinq euros.', '5유로예요.', '사 쿠트 생크 외로', 'Ça coûte 뒤에 금액을 붙여요. 5유로는 복수이므로 euros에 s를 써요.'],
    ['Je peux payer par carte ?', '카드로 결제할 수 있나요?', '쥬 푀 페예 파르 카르트', 'Je peux + 동사원형 payer에 결제 수단 par carte를 붙였어요. 물음표를 붙여 가능 여부를 물어요.']
  ] },
  { id: 'travel', title: '길 위의 프랑스어', subtitle: '길을 묻고 지하철 타기', icon: 'compass', color: 'mint', category: '여행 회화', tip: '길을 물을 때 Excusez-moi로 시작하면 더 자연스러워요. à droite는 오른쪽, à gauche는 왼쪽이에요.', phrases: [
    ['Où est la gare ?', '기차역이 어디에 있나요?', '우 에 라 가르', 'Où est 뒤에 찾는 장소를 붙여요. gare는 여성 명사라 la gare라고 써요. 위치의 où에는 악센트가 있어요.'],
    ['C’est à droite.', '오른쪽에 있어요.', '세 타 드루아트', 'à droite는 “오른쪽에”예요. C’est 뒤에 붙이면 오른쪽에 있다고 설명할 수 있어요.'],
    ['C’est à gauche.', '왼쪽에 있어요.', '세 타 고슈', 'à gauche는 “왼쪽에”예요. à droite와 같은 자리에 넣어 방향만 바꿔요.'],
    ['Tout droit.', '쭉 직진하세요.', '투 드루아', 'tout droit는 “똑바로 / 직진”이에요. 오른쪽을 뜻하는 à droite와 전치사, 마지막 e가 달라요.'],
    ['Un billet pour Paris, s’il vous plaît.', '파리행 표 한 장 주세요.', '앙 비예 푸르 파리, 실 부 플레', 'un billet은 표 한 장, pour Paris는 파리행이라는 뜻이에요. pour 뒤에 목적지를 넣어요.'],
    ['Je suis perdu.', '길을 잃었어요. (남성 화자)', '쥬 쉬 페르뒤', 'perdu는 남성형, perdue는 여성형이에요. Je suis 뒤의 형용사를 말하는 사람에 맞춰 쓰며 발음은 같아요.']
  ] },
  { id: 'shopping', title: '마음에 드는 발견', subtitle: '상점에서 원하는 것 찾기', icon: 'bag', color: 'peach', category: '여행 회화', tip: 'Je cherche는 ‘~을 찾고 있어요’예요. 원하는 물건을 뒤에 붙여 보세요.', phrases: [
    ['Je regarde, merci.', '그냥 둘러보고 있어요, 감사합니다.', '쥬 르가르드, 메르시', 'Je regarde는 “보고 있어요”예요. 가게에서는 merci와 함께 둘러보는 중이라고 알려주는 표현으로 써요.'],
    ['Je cherche un cadeau.', '선물을 찾고 있어요.', '쥬 셰르슈 앙 카도', 'Je cherche는 “나는 찾고 있다”예요. cadeau는 남성 명사이므로 un cadeau로 붙여요.'],
    ['Je peux essayer ?', '입어 봐도 될까요?', '쥬 푀 에세예', 'Je peux 뒤에 essayer를 원형으로 붙였어요. 문맥에 따라 입어 보기, 신어 보기, 시도해 보기를 뜻해요.'],
    ['C’est trop cher.', '너무 비싸요.', '세 트로 셰르', 'trop은 “너무”, cher는 “비싼”이에요. C’est 뒤에 trop cher를 붙여 가격에 대한 생각을 말해요.'],
    ['Je prends ça.', '이걸로 할게요.', '쥬 프랑 사', 'prends는 prendre의 Je 형태예요. ça는 가리키는 물건을 뜻하며, 가게에서 “이걸로 할게요”로 써요.'],
    ['Vous avez un sac ?', '봉투 있나요?', '부 자베 앙 삭', 'Vous avez는 “가지고 계세요”예요. 질문 억양과 물음표로 봉투가 있는지 물을 수 있어요.']
  ] },
  { id: 'essentials', title: '꼭 필요한 한마디', subtitle: '도움 요청하고 의사 표현하기', icon: 'sparkles', color: 'butter', category: '여행 회화', tip: '모르거나 못 들었다면 편하게 다시 물어보세요. 천천히 말해 달라는 표현만 알아도 대화가 훨씬 쉬워져요.', phrases: [
    ['Je ne comprends pas.', '이해하지 못하겠어요.', '쥬 느 콩프랑 파', 'comprends는 comprendre의 Je 형태예요. ne와 pas가 comprends를 감싸 이해하지 못한다는 뜻을 만들어요.'],
    ['Pouvez-vous répéter ?', '다시 말씀해 주시겠어요?', '푸베 부 레페테', 'pouvez-vous는 “해 주실 수 있나요”라는 정중한 질문이에요. 뒤에는 동사원형 répéter를 붙여요.'],
    ['Plus lentement, s’il vous plaît.', '좀 더 천천히 말씀해 주세요.', '플뤼 랑트망, 실 부 플레', 'plus lentement는 “더 천천히”예요. s’il vous plaît를 덧붙여 정중하게 말하는 속도를 요청해요.'],
    ['Parlez-vous anglais ?', '영어를 하시나요?', '파를레 부 앙글레', 'vous parlez의 순서를 parlez-vous로 바꾼 질문이에요. 영어라는 언어 이름 anglais 앞에는 여기서 관사를 쓰지 않아요.'],
    ['J’ai besoin d’aide.', '도움이 필요해요.', '제 브주앵 데드', 'J’ai besoin de는 “~이 필요하다”예요. 모음으로 시작하는 aide 앞에서 de는 d’로 줄어요.'],
    ['Où sont les toilettes ?', '화장실은 어디에 있나요?', '우 송 레 투알레트', '화장실은 les toilettes처럼 복수로 써요. 그래서 단수 est가 아니라 복수 sont로 위치를 물어요.']
  ] },
  { id: 'daily-life', title: '내 하루의 작은 이야기', subtitle: '사는 곳과 일상 이야기하기', icon: 'smile', color: 'mint', category: '일상 회화', tip: 'Je는 “나”예요. 동사마다 Je와 함께 쓰는 형태를 문장으로 익혀요. habiter처럼 무음 h로 시작하면 J’habite로 줄여요.', phrases: [
    ['J’habite à Séoul.', '저는 서울에 살아요.', '자비트 아 세울', 'habiter는 살다예요. 도시 앞에는 보통 à를 써서 à Séoul이라고 해요.'],
    ['Je travaille ici.', '저는 여기서 일해요.', '쥬 트라바이 이시', 'travailler의 Je 형태는 travaille예요. ici는 “여기”라는 장소 부사예요.'],
    ['J’étudie le français.', '저는 프랑스어를 공부해요.', '제튀디 르 프랑세', 'étudier 앞에서 Je는 J’가 돼요. 공부하는 언어 이름 앞에는 le를 써요.'],
    ['Je rentre à la maison.', '저는 집으로 돌아가요.', '쥬 랑트르 아 라 메종', 'rentrer는 돌아가다예요. à la maison은 “집에”라는 장소 표현이에요.'],
    ['Je suis à la maison.', '저는 집에 있어요.', '쥬 쉬 아 라 메종', 'suis는 être의 Je 형태예요. 이동이 아니라 현재 있는 장소를 알려줘요.'],
    ['À demain !', '내일 봐요!', '아 드맹', 'demain은 내일이에요. À demain은 내일 다시 만날 때 쓰는 인사예요.']
  ] },
  { id: 'weather', title: '날씨로 시작하는 대화', subtitle: '날씨와 몸 상태 표현하기', icon: 'sun', color: 'butter', category: '일상 회화', tip: '날씨에는 Il fait, 내가 느끼는 더위·추위에는 J’ai를 써요. Il fait froid와 J’ai froid의 주어와 동사를 함께 비교해요.', phrases: [
    ['Il fait beau.', '날씨가 좋아요.', '일 페 보', '날씨를 말하는 il은 특정 사람을 가리키지 않아요. Il fait beau를 통째로 익혀요.'],
    ['Il fait chaud.', '날씨가 더워요.', '일 페 쇼', 'chaud는 덥다는 뜻이에요. 바깥 날씨는 Il fait chaud로 표현해요.'],
    ['Il fait froid.', '날씨가 추워요.', '일 페 프루아', 'Il fait chaud의 chaud를 froid로 바꾸면 추운 날씨를 말할 수 있어요.'],
    ['Il pleut.', '비가 와요.', '일 플뢰', '비가 오다는 pleuvoir를 써서 Il pleut라고 해요. fait를 끼워 넣지 않아요.'],
    ['J’ai froid.', '저는 추워요.', '제 프루아', '내가 추위를 느낄 때는 avoir froid를 써요. 날씨를 말하는 Il fait froid와 구분해요.'],
    ['J’ai chaud.', '저는 더워요.', '제 쇼', '내가 더위를 느낄 때는 J’ai chaud예요. 상태를 직역해서 Je suis chaud라고 하지 않아요.']
  ] },
  { id: 'time', title: '몇 시에 만날까요', subtitle: '시간을 묻고 약속하기', icon: 'clock', color: 'lavender', category: '일상 회화', tip: '현재 시각은 Il est, 어떤 일이 일어나는 시간은 à를 써요. 한 시는 une heure, 두 시부터는 heures로 복수형을 써요.', phrases: [
    ['Quelle heure est-il ?', '몇 시인가요?', '켈 외르 에 틸', 'heure는 여성 명사라 quelle을 써요. est-il처럼 동사와 주어 사이에 하이픈이 있어요.'],
    ['Il est une heure.', '한 시예요.', '일 에 튄 외르', '한 시는 une heure예요. heure가 여성 명사이므로 un이 아니라 une를 써요.'],
    ['Il est deux heures.', '두 시예요.', '일 에 되 죄르', '두 시부터는 heures에 s를 붙여요. 숫자가 여러 개여도 문장의 시작은 Il est예요.'],
    ['À quelle heure ?', '몇 시에요?', '아 켈 외르', '행사나 약속이 몇 시에 있는지 물을 때는 앞에 À를 붙여요.'],
    ['À trois heures.', '세 시에요.', '아 트루아 죄르', '시간을 약속할 때 à trois heures라고 해요. 지금 세 시라는 뜻은 Il est trois heures예요.'],
    ['À bientôt !', '곧 또 봐요!', '아 비앵토', '정확한 날짜를 정하지 않고 다시 만나기를 바라며 하는 인사예요. bientôt의 ô를 확인해요.']
  ] },
  { id: 'hotel', title: '편안하게 체크인', subtitle: '숙소에서 필요한 것 요청하기', icon: 'bag', color: 'peach', category: '여행 회화', tip: '숙소에서는 정중한 vous를 사용해요. J’ai une réservation은 예약이 있다는 뜻이고, Je voudrais는 원하는 것을 부탁하는 표현이에요.', phrases: [
    ['J’ai une réservation.', '예약했어요.', '제 윈 레제르바시옹', '직역하면 “예약 하나가 있어요”예요. réservation은 여성 명사라 une를 써요.'],
    ['À quel nom ?', '어느 성함으로 예약하셨나요?', '아 켈 농', '직원이 예약자의 이름을 확인할 때 하는 짧은 질문이에요. nom은 남성 명사라 quel을 써요.'],
    ['Au nom de Kim.', '김이라는 이름으로 예약했어요.', '오 농 드 김', 'au nom de 뒤에 예약한 이름을 넣어요. au는 à와 le가 합쳐진 형태예요.'],
    ['Où est ma chambre ?', '제 방은 어디에 있나요?', '우 에 마 샹브르', 'chambre는 여성 명사라 “나의”를 ma로 써요. 주인의 성별이 아니라 명사에 맞춰요.'],
    ['Le petit déjeuner est inclus ?', '아침 식사가 포함되어 있나요?', '르 프티 데죄네 에 탱클뤼', '평서문 어순에 물음표를 붙인 질문이에요. petit déjeuner는 아침 식사예요.'],
    ['Je voudrais une serviette.', '수건 한 장 주세요.', '쥬 부드레 윈 세르비에트', 'serviette는 여성 명사라 une를 써요. Je voudrais 뒤에 필요한 물건을 붙여 부탁해요.']
  ] }
];
export const phrases = lessons.flatMap(lesson => lesson.phrases.map((p, i) => ({ id: `${lesson.id}-${i}`, fr: p[0], ko: p[1], pronunciation: p[2], note: p[3], lessonId: lesson.id, category: lesson.category })));
export const getPhrases = id => phrases.filter(p => p.lessonId === id);
