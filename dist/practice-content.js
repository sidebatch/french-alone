// Fixed, reviewed-in-repository exercises. No generated questions or paid APIs at runtime.
export const practiceUnits = [
  { id: 'thoughts', title: '내 생각 표현하기', description: '원하는 일 · 할 수 있는 일 · 좋아하는 일', packs: ['want', 'can', 'like'] },
  { id: 'everyday', title: '나의 일상 이야기', description: '지금 상태 · 가진 것 · 가려는 곳', packs: ['be', 'have', 'go'] },
  { id: 'outside', title: '밖에서 쓰는 한마디', description: '주문하기 · 도움 요청하기 · 위치 묻기', packs: ['order-food', 'need', 'where'] }
];

export const patternGuides = {
  want: { rule: 'Je veux 뒤에는 원하는 행동의 동사원형을 써요. 부정할 때는 veux 앞에 ne, 뒤에 pas를 놓아요.', caution: 'Je veux는 의지를 직접 표현해요. 가게에서 정중하게 주문할 때는 Je voudrais가 더 잘 어울려요.' },
  can: { rule: 'Je peux 뒤에 동사원형을 붙여 가능하거나 할 수 있는 행동을 표현해요. Je ne peux pas는 그 반대예요.', caution: 'Je에 맞는 형태는 peux예요. 뒤의 동사는 parler, attendre처럼 원형으로 둬요.' },
  like: { rule: '좋아하는 활동은 J’aime + 동사원형으로 써요. beaucoup는 aime 뒤에 놓아 좋아하는 정도를 더해요.', caution: 'Je aime는 J’aime로 줄여요. 부정문에서는 Je n’aime pas가 되며, Je를 따로 써요.' },
  be: { rule: 'Je suis는 “나는 ~이다 / ~에 있다”예요. 뒤에 상태를 나타내는 형용사나 장소 표현을 붙여요.', caution: '형용사는 사람에 따라 형태가 달라져요. prêt / prête, fatigué / fatiguée를 모두 정답으로 인정하는 문제는 성별을 지정하지 않아요.' },
  have: { rule: 'J’ai는 “나는 가지고 있다”예요. un은 남성 단수 명사, une는 여성 단수 명사 앞에 써요.', caution: '가진 것이 없다고 할 때 un / une는 보통 de로 바뀌어요: Je n’ai pas de sac. faim, soif는 관사 없이 avoir와 함께 써요.' },
  go: { rule: 'Je vais 뒤에 장소를 붙이면 “나는 ~에 간다”예요. à + le는 au가 되고, à la는 그대로 써요.', caution: '“집에 간다”는 Je vais à la maison이에요. Je vais + 동사원형은 앞으로 할 행동을 나타내는 다른 구조예요.' },
  'order-food': { rule: 'Je voudrais 뒤에 원하는 음식이나 음료를 붙이면 정중한 주문이 돼요. un / une는 명사의 성에 맞춰 골라요.', caution: 'Je voudrais에서 s를 빼지 않아요. s’il vous plaît를 덧붙일 수도 있지만, 없어도 정중한 문장이에요.' },
  need: { rule: 'J’ai besoin de 뒤에 필요한 것이나 해야 할 행동을 붙여요. 모음 앞에서는 de가 d’로 줄어들어요.', caution: '부정할 때는 Je n’ai pas besoin de예요. pas는 ai 뒤, besoin 앞에 놓고 de도 유지해요.' },
  where: { rule: 'Où est 뒤에 한 장소를 넣으면 “~은 어디에 있나요?”예요. 여러 개를 물을 때는 Où sont를 써요.', caution: '위치를 묻는 où에는 악센트가 있어요. ou는 “또는”이라는 다른 단어예요. toilettes는 프랑스어에서 복수로 써요.' }
};

const blank = (ko, cue, answer, full, hint, note, extra = {}) => ({ kind: 'input', ko, cue, answer, full, hint, note, ...extra });
const write = (ko, full, hint, note, extra = {}) => ({ kind: 'input', ko, answer: full, full, hint, note, ...extra });
const arrange = (ko, full, tiles, hint, note, extra = {}) => ({ kind: 'order', ko, answer: full, full, tiles, hint, note, ...extra });
const choose = (ko, cue, answer, full, choices, tip, note) => ({ kind: 'choice', ko, cue, answer, full, choices, hint: tip, note, model: { fr: full, ko, tip } });

export const extraPackSpecs = [
  [{ id: 'be', title: '지금의 나를 소개해요', subtitle: '상태와 장소를 Je suis로 표현하기', pattern: 'Je suis + 상태 / 장소', icon: 'smile', color: 'lavender', promise: '지금 어떤 상태인지, 어디에 있는지 쓸 수 있어요.' }, [
    choose('나는 여기에 있어.', 'Je ___ ici.', 'suis', 'Je suis ici.', ['suis', 'ai', 'vais'], 'Je suis는 “나는 ~이다 / ~에 있다”, ici는 “여기”예요.', 'Je + suis + ici. suis는 être가 주어 Je에 맞게 바뀐 형태예요.'),
    blank('나는 집에 있어.', 'Je ___ à la maison.', 'suis', 'Je suis à la maison.', '“나는 ~에 있다”의 suis를 넣어요.', 'à la maison은 “집에”예요. suis 뒤에 장소를 붙였어요.', { glossary: 'à la maison = 집에' }),
    write('여기', 'ici', 'i로 시작하는 세 글자예요.', 'ici는 “여기”라는 장소 부사예요. Je suis ici처럼 문장 끝에 붙일 수 있어요.', { mode: 'word' }),
    arrange('나는 집에 있어.', 'Je suis à la maison.', ['Je', 'suis', 'à', 'la', 'maison'], 'Je → suis → à la maison 순서예요.', '집을 뜻하는 maison은 여성 명사예요. 이 장소 표현에서는 à la를 함께 써요.'),
    choose('나는 여기에 있지 않아.', 'Je ne suis ___ ici.', 'pas', 'Je ne suis pas ici.', ['pas', 'de', 'à'], 'ne와 pas가 suis를 감싸면 “~이 아니다 / ~에 있지 않다”가 돼요.', 'Je ne suis pas ici. ne와 pas 사이에는 suis가 있어요.'),
    blank('나는 집에 있지 않아.', 'Je ne ___ pas à la maison.', 'suis', 'Je ne suis pas à la maison.', 'Je와 쓰는 être의 형태는 suis예요.', '장소 표현 à la maison은 그대로 두고 suis를 ne … pas로 감싸요.'),
    arrange('나는 여기에 있지 않아.', 'Je ne suis pas ici.', ['Je', 'ne', 'suis', 'pas', 'ici'], 'Je → ne → suis → pas → ici 순서예요.', 'pas는 suis 바로 뒤에 써요. ici 앞에 ne를 놓지 않아요.'),
    blank('나는 준비됐어.', 'Je suis ___.', 'prêt', 'Je suis prêt.', '남성형 prêt, 여성형 prête 중 하나를 써요.', 'prêt / prête는 “준비된”이에요. 이 문제에서는 두 형태 모두 맞아요.', { accepted: ['prête', 'Je suis prête.'], glossary: 'prêt / prête = 준비된' }),
    write('나는 집에 있어.', 'Je suis à la maison.', 'Je suis로 시작하고 à la maison을 붙여요.', 'Je suis + à la maison. 장소를 뜻하는 à에는 악센트를 써요.'),
    write('나는 피곤해.', 'Je suis fatigué.', 'Je suis 뒤에 fatigué 또는 fatiguée를 붙여요.', 'fatigué는 남성형, fatiguée는 여성형이에요. 성별을 지정하지 않았으므로 둘 다 정답이에요.', { transfer: true, glossary: '새 단어: fatigué / fatiguée = 피곤한', accepted: ['Je suis fatiguée.'] })
  ]],
  [{ id: 'have', title: '가진 것과 필요한 휴식', subtitle: '소유와 몸 상태를 J’ai로 표현하기', pattern: 'J’ai + 명사', icon: 'bag', color: 'peach', promise: '가진 물건과 배고픔·목마름을 표현해요.' }, [
    choose('나는 가방 하나가 있어.', 'J’___ un sac.', 'ai', 'J’ai un sac.', ['ai', 'suis', 'a'], 'J’ai는 “나는 가지고 있다”예요. sac은 남성 명사라 un sac이라고 써요.', 'Je는 ai 앞에서 J’로 줄어요. Je ai라고 쓰지 않아요.'),
    blank('나는 책 한 권이 있어.', 'J’___ un livre.', 'ai', 'J’ai un livre.', 'J’ 뒤에는 avoir의 ai가 들어가요.', 'livre는 여기서 “책”이라는 남성 명사예요. un livre로 써요.', { glossary: 'un livre = 책 한 권' }),
    write('가방', 'sac', 's로 시작하는 세 글자예요.', 'sac은 남성 명사예요. 단어만 쓰는 문제이므로 관사 없이 sac을 써요.', { mode: 'word' }),
    arrange('나는 질문 하나가 있어.', 'J’ai une question.', ['J’ai', 'une', 'question'], 'J’ai → une → question 순서예요.', 'question은 여성 명사예요. un이 아니라 une를 붙여요.', { glossary: 'une question = 질문 하나' }),
    choose('나는 가방이 없어.', 'Je n’ai pas ___ sac.', 'de', 'Je n’ai pas de sac.', ['de', 'un', 'une'], '가진 물건이 없다고 할 때 un / une는 보통 de로 바뀌어요.', 'J’ai un sac → Je n’ai pas de sac. n’는 모음 앞에서 줄어든 ne예요.'),
    blank('나는 책이 없어.', 'Je n’ai pas ___ livre.', 'de', 'Je n’ai pas de livre.', '“하나도 없다”에서는 un 대신 de를 써요.', 'Je n’ai pas de livre. pas 다음의 de를 빼지 않아요.'),
    arrange('나는 가방이 없어.', 'Je n’ai pas de sac.', ['Je', 'n’ai', 'pas', 'de', 'sac'], 'Je → n’ai → pas → de → sac 순서예요.', 'n’ai는 ne와 ai가 연결된 형태예요. 부정문에서는 Je를 별도로 써요.'),
    blank('나는 배고파.', 'J’ai ___.', 'faim', 'J’ai faim.', 'f로 시작하는 faim을 넣어요.', '프랑스어에서는 배고픔을 avoir faim으로 표현해요. faim 앞에 un을 붙이지 않아요.', { glossary: 'avoir faim = 배고프다' }),
    write('나는 책 한 권이 있어.', 'J’ai un livre.', 'J’ai 뒤에 un livre를 붙여요.', 'J’ai + un livre. 아포스트로피로 J’와 ai를 연결해요.'),
    write('나는 목말라.', 'J’ai soif.', 'J’ai 뒤에 soif를 붙여요.', 'avoir soif는 “목마르다”예요. avoir faim처럼 관사 없이 써요.', { transfer: true, glossary: '새 단어: avoir soif = 목마르다' })
  ]],
  [{ id: 'go', title: '오늘은 어디로 갈까요', subtitle: 'Je vais로 목적지 정하기', pattern: 'Je vais + 장소', icon: 'compass', color: 'mint', promise: '어디로 가는지 목적지를 써요.' }, [
    choose('나는 파리에 가.', 'Je ___ à Paris.', 'vais', 'Je vais à Paris.', ['vais', 'va', 'suis'], 'Je vais는 “나는 간다”예요. 도시 이름 앞에는 보통 à를 써요.', 'aller는 Je와 함께 vais로 바뀌어요. Je va라고 쓰지 않아요.'),
    blank('나는 집에 가.', 'Je ___ à la maison.', 'vais', 'Je vais à la maison.', 'Je와 쓰는 “간다”는 vais예요.', '도시 이름에는 à, 집이라는 장소 표현에는 à la maison을 써요.', { glossary: 'la maison = 집 · à la maison = 집에' }),
    write('집', 'maison', 'm으로 시작하는 여섯 글자예요.', 'maison은 여성 명사예요. “집에”는 à la maison이라고 해요.', { mode: 'word' }),
    arrange('나는 집에 가.', 'Je vais à la maison.', ['Je', 'vais', 'à', 'la', 'maison'], 'Je → vais → à la maison 순서예요.', '집에 있는 상태는 Je suis à la maison, 집으로 가는 이동은 Je vais à la maison이에요.'),
    choose('나는 카페에 가.', 'Je vais ___ café.', 'au', 'Je vais au café.', ['au', 'à le', 'à la'], 'café는 남성 명사예요. à와 le가 합쳐져 au가 돼요.', 'à + le café → au café. à le café라고 따로 쓰지 않아요.'),
    blank('나는 기차역에 가.', 'Je vais ___ gare.', 'à la', 'Je vais à la gare.', 'gare는 여성 명사라 à la를 써요.', 'à와 la는 합쳐지지 않아요. Je vais à la gare로 써요.', { glossary: 'la gare = 기차역' }),
    arrange('나는 카페에 가.', 'Je vais au café.', ['Je', 'vais', 'au', 'café'], 'Je → vais → au → café 순서예요.', 'au에는 à와 le의 뜻이 함께 들어 있어요.'),
    blank('나는 파리에 가지 않아.', 'Je ne vais ___ à Paris.', 'pas', 'Je ne vais pas à Paris.', 'ne와 짝인 pas를 넣어요.', 'ne … pas는 vais를 감싸요. 목적지 à Paris는 그 뒤에 그대로 붙여요.'),
    write('나는 기차역에 가.', 'Je vais à la gare.', 'Je vais 뒤에 à la gare를 붙여요.', 'gare는 여성 명사이므로 au gare가 아니라 à la gare예요.'),
    write('나는 시장에 가.', 'Je vais au marché.', 'Je vais 뒤에 au marché를 붙여요.', 'marché는 남성 명사예요. à + le marché가 au marché가 돼요.', { transfer: true, glossary: '새 단어: le marché = 시장' })
  ]],
  [{ id: 'order-food', title: '카페에서 내 주문은', subtitle: 'Je voudrais로 정중하게 주문하기', pattern: 'Je voudrais + 원하는 것', icon: 'coffee', color: 'butter', promise: '음료와 간식을 정중하게 주문해요.' }, [
    choose('커피 한 잔 주세요.', 'Je ___ un café.', 'voudrais', 'Je voudrais un café.', ['voudrais', 'suis', 'peux'], 'Je voudrais는 원하는 것을 정중하게 요청하는 표현이에요.', 'Je veux보다 부드러운 요청이에요. 주문할 메뉴를 뒤에 붙여요.'),
    blank('차 한 잔 주세요.', 'Je ___ un thé.', 'voudrais', 'Je voudrais un thé.', 'v로 시작하는 voudrais를 넣어요.', 'thé는 차라는 남성 명사예요. un thé는 차 한 잔이에요.', { glossary: 'un thé = 차 한 잔' }),
    write('커피', 'café', 'c-a-f 뒤에 é를 붙여요.', 'café의 마지막 글자는 é예요. 아래 악센트 버튼으로 입력할 수 있어요.', { mode: 'word' }),
    arrange('크루아상 하나 주세요.', 'Je voudrais un croissant.', ['Je', 'voudrais', 'un', 'croissant'], 'Je → voudrais → un → croissant 순서예요.', 'croissant은 남성 명사이므로 un을 붙여요.', { glossary: 'un croissant = 크루아상 하나' }),
    choose('샐러드 하나 주세요.', 'Je voudrais ___ salade.', 'une', 'Je voudrais une salade.', ['une', 'un', 'de'], 'salade는 여성 명사라 une salade라고 해요.', '주문하는 메뉴가 여성 명사이면 une, 남성 명사이면 un을 써요.'),
    blank('차 한 잔 주세요.', 'Je voudrais un ___.', 'thé', 'Je voudrais un thé.', '차는 t-h-é예요.', 'thé는 음료인 “차”예요. 마지막의 é를 확인해요.'),
    arrange('샐러드 하나 주세요.', 'Je voudrais une salade.', ['Je', 'voudrais', 'une', 'salade'], 'Je → voudrais → une → salade 순서예요.', 'une salade를 한 덩어리로 기억하면 관사도 함께 떠올리기 쉬워요.'),
    blank('커피 한 잔 주세요.', 'Je voudrais ___ café.', 'un', 'Je voudrais un café.', 'café는 남성 명사예요.', '이 주문에서 un은 남성 단수 명사 café에 맞춘 관사예요.'),
    write('차 한 잔 주세요.', 'Je voudrais un thé.', 'Je voudrais 뒤에 un thé를 붙여요.', 'voudrais의 마지막 s와 thé의 é를 확인해요.', { accepted: ['Je voudrais un thé, s’il vous plaît.'] }),
    write('샌드위치 하나 주세요.', 'Je voudrais un sandwich.', 'Je voudrais 뒤에 un sandwich를 붙여요.', 'sandwich는 남성 명사예요. 새 메뉴도 같은 주문 틀에 넣을 수 있어요.', { transfer: true, glossary: '새 단어: un sandwich = 샌드위치 하나', accepted: ['Je voudrais un sandwich, s’il vous plaît.'] })
  ]],
  [{ id: 'need', title: '도움이 필요할 때', subtitle: 'J’ai besoin de로 필요 표현하기', pattern: 'J’ai besoin de + 명사 / 동사원형', icon: 'heart', color: 'peach', promise: '필요한 것과 해야 할 일을 써요.' }, [
    choose('나는 도움이 필요해.', 'J’ai ___ d’aide.', 'besoin', 'J’ai besoin d’aide.', ['besoin', 'faim', 'suis'], 'avoir besoin de는 “~이 필요하다”예요. aide 앞에서 de는 d’가 돼요.', 'J’ai + besoin + d’aide. besoin 뒤의 de도 표현의 일부예요.'),
    blank('나는 휴식이 필요해.', 'J’ai ___ de repos.', 'besoin', 'J’ai besoin de repos.', 'b로 시작하는 besoin을 넣어요.', 'repos는 “휴식”이에요. 자음으로 시작하므로 de repos라고 써요.', { glossary: 'le repos = 휴식' }),
    write('도움', 'aide', 'a로 시작하는 네 글자예요.', 'aide는 도움을 뜻하는 여성 명사예요. “도움이 필요해”에서는 d’aide로 연결해요.', { mode: 'word' }),
    arrange('나는 도움이 필요해.', 'J’ai besoin d’aide.', ['J’ai', 'besoin', 'd’aide'], 'J’ai → besoin → d’aide 순서예요.', 'de aide는 d’aide로 줄여요. d’aide는 한 카드로 연결되어 있어요.'),
    choose('나는 도움이 필요하지 않아.', 'Je n’ai ___ besoin d’aide.', 'pas', 'Je n’ai pas besoin d’aide.', ['pas', 'de', 'ne'], '부정문에서는 ne … pas가 ai를 감싸요. ne는 ai 앞에서 n’가 돼요.', 'pas는 ai와 besoin 사이에 써요. besoin d’aide의 형태는 그대로예요.'),
    blank('나는 휴식이 필요하지 않아.', 'Je n’ai pas besoin ___ repos.', 'de', 'Je n’ai pas besoin de repos.', 'besoin과 필요한 것을 잇는 말은 de예요.', '부정문에서도 avoir besoin de의 de는 사라지지 않아요.'),
    arrange('나는 도움이 필요하지 않아.', 'Je n’ai pas besoin d’aide.', ['Je', 'n’ai', 'pas', 'besoin', 'd’aide'], 'Je → n’ai → pas → besoin → d’aide 순서예요.', '긍정문의 J’ai가 Je n’ai pas로 바뀌어요.'),
    blank('나는 잘 필요가 있어.', 'J’ai besoin de ___.', 'dormir', 'J’ai besoin de dormir.', '“자다”의 동사원형은 dormir예요.', '필요한 행동은 de 뒤에 동사원형을 붙여 표현해요.', { glossary: 'dormir = 자다' }),
    write('나는 휴식이 필요해.', 'J’ai besoin de repos.', 'J’ai besoin de 뒤에 repos를 붙여요.', 'J’ai besoin de는 한 덩어리로 기억하고, 뒤의 필요한 것만 바꿔요.'),
    write('나는 먹을 필요가 있어.', 'J’ai besoin de manger.', 'J’ai besoin de 뒤에 manger를 붙여요.', 'manger는 “먹다”예요. Je veux manger는 바람, J’ai besoin de manger는 필요를 표현해요.', { transfer: true, glossary: '이번에 넣을 행동: manger = 먹다' })
  ]],
  [{ id: 'where', title: '어디에 있는지 물어요', subtitle: 'Où est와 Où sont로 위치 묻기', pattern: 'Où est / Où sont + 장소', icon: 'compass', color: 'mint', promise: '기차역·호텔·화장실의 위치를 물어요.' }, [
    choose('기차역은 어디에 있나요?', 'Où ___ la gare ?', 'est', 'Où est la gare ?', ['est', 'sont', 'suis'], '한 장소의 위치를 물을 때 Où est를 써요. gare는 기차역이에요.', 'Où + est + la gare. où의 ù는 위치를 묻는 말임을 구분해 줘요.'),
    blank('카페는 어디에 있나요?', 'Où ___ le café ?', 'est', 'Où est le café ?', '카페 한 곳을 물으므로 est예요.', 'café는 남성 명사라 le café예요. Où est의 형태는 그대로예요.'),
    write('기차역', 'gare', 'g로 시작하는 네 글자예요.', 'gare는 여성 명사예요. 문장에서는 la gare라고 써요.', { mode: 'word' }),
    arrange('기차역은 어디에 있나요?', 'Où est la gare ?', ['Où', 'est', 'la', 'gare'], 'Où → est → la → gare 순서예요.', '질문에서는 Où est 뒤에 찾는 장소를 넣어요. 물음표 유무는 채점에 영향을 주지 않아요.'),
    choose('화장실은 어디에 있나요?', 'Où ___ les toilettes ?', 'sont', 'Où sont les toilettes ?', ['sont', 'est', 'suis'], '화장실은 les toilettes처럼 복수로 표현하므로 sont를 써요.', '한국어로 화장실 한 곳을 찾아도 프랑스어 표현 les toilettes는 복수예요.'),
    blank('화장실은 어디에 있나요?', 'Où sont ___ toilettes ?', 'les', 'Où sont les toilettes ?', '복수 명사 앞의 정관사는 les예요.', 'les와 sont를 함께 기억해요: Où sont les toilettes ?'),
    arrange('화장실은 어디에 있나요?', 'Où sont les toilettes ?', ['Où', 'sont', 'les', 'toilettes'], 'Où → sont → les → toilettes 순서예요.', 'toilettes의 끝 s와 복수형 sont를 확인해요.'),
    blank('호텔은 어디에 있나요?', 'Où est l’___ ?', 'hôtel', 'Où est l’hôtel ?', 'h-ô-t-e-l을 써요.', 'hôtel의 h는 무음이에요. le hôtel 대신 l’hôtel로 줄여 써요.', { glossary: 'l’hôtel = 호텔' }),
    write('카페는 어디에 있나요?', 'Où est le café ?', 'Où est 뒤에 le café를 붙여요.', '위치의 Où에는 ù, café에는 é가 있어요. 악센트 버튼을 이용해도 돼요.'),
    write('박물관은 어디에 있나요?', 'Où est le musée ?', 'Où est 뒤에 le musée를 붙여요.', 'musée는 ée로 끝나지만 남성 명사예요. la가 아니라 le를 써요.', { transfer: true, glossary: '새 단어: le musée = 박물관' })
  ]]
];
