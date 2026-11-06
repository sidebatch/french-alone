// Authored beginner content. Order is intentional: model → retrieval → transfer.
const makePack = (meta, questions) => ({ ...meta, questions: questions.map((q, index) => ({
  id: `${meta.id}-${index + 1}`, packId: meta.id,
  phase: index < 2 ? '패턴 발견' : index < 8 ? '꺼내 보고 바꿔 보기' : '내 말로 완성',
  ...q
})) });

export const practicePacks = [
  makePack({ id: 'want', title: '오늘은 그냥 쉬고 싶어', subtitle: '하고 싶은 말에 Je veux 붙이기', pattern: 'Je veux + 동사원형', icon: 'sun', color: 'peach', promise: '하고 싶은 것과 하고 싶지 않은 것을 말해요.' }, [
    { kind: 'choice', ko: '자고 싶어.', cue: 'Je ___ dormir.', answer: 'veux', full: 'Je veux dormir.', choices: ['veux', 'peux', 'suis'], model: { fr: 'Je veux dormir.', ko: '자고 싶어.', tip: 'Je veux는 “나는 ~하고 싶어”, dormir는 “자다”예요.' }, hint: '“하고 싶어”의 중심 단어는 v로 시작해요.', note: 'Je veux 뒤에 동사원형을 붙이면 원하는 행동을 말할 수 있어요.' },
    { kind: 'input', ko: '먹고 싶어.', cue: 'Je ___ manger.', answer: 'veux', full: 'Je veux manger.', glossary: 'manger = 먹다', hint: '방금 쓴 “하고 싶어”를 떠올려 보세요. v로 시작해요.', note: 'dormir를 manger로 바꿨어요. Je veux는 그대로예요.' },
    { kind: 'input', ko: '자고 싶어.', cue: 'Je veux ___.', answer: 'dormir', full: 'Je veux dormir.', hint: '“자다”는 d로 시작하는 여섯 글자예요.', note: '이번에는 원하는 행동인 dormir를 직접 꺼냈어요.' },
    { kind: 'order', ko: '여기에 있고 싶어.', answer: 'Je veux rester ici.', full: 'Je veux rester ici.', tiles: ['Je', 'veux', 'rester', 'ici'], glossary: 'rester = 머무르다 · ici = 여기', hint: 'Je → veux → 원하는 행동 → 장소 순서예요.', note: 'Je veux 뒤에는 새로운 행동도 붙일 수 있어요. rester ici는 “여기에 머무르다”예요.' },
    { kind: 'choice', ko: '떠나고 싶지 않아.', cue: 'Je ne veux ___ partir.', answer: 'pas', full: 'Je ne veux pas partir.', choices: ['pas', 'ici', 'je'], model: { fr: 'Je ne veux pas partir.', ko: '떠나고 싶지 않아.', tip: 'ne와 pas가 veux를 감싸면 “하고 싶지 않아”가 돼요. partir는 “떠나다”예요.' }, hint: 'ne와 짝을 이루는 단어는 p로 시작해요.', note: 'Je ne veux pas + 동사원형. 부정문에서도 veux는 그대로예요.' },
    { kind: 'input', ko: '자고 싶지 않아.', cue: 'Je ne ___ pas dormir.', answer: 'veux', full: 'Je ne veux pas dormir.', hint: 'ne와 pas 사이에도 “원하다”를 뜻하는 v…가 들어가요.', note: '긍정문에서 썼던 veux를 ne … pas로 감쌌어요.' },
    { kind: 'order', ko: '먹고 싶지 않아.', answer: 'Je ne veux pas manger.', full: 'Je ne veux pas manger.', tiles: ['Je', 'ne', 'veux', 'pas', 'manger'], hint: 'Je → ne → veux → pas → 행동 순서예요.', note: 'ne … pas의 자리를 기억하면 다른 행동도 부정할 수 있어요.' },
    { kind: 'input', ko: '떠나고 싶지 않아.', cue: 'Je ___ veux pas partir.', answer: 'ne', full: 'Je ne veux pas partir.', hint: 'pas와 짝을 이루는 두 글자를 veux 앞에 넣어요.', note: '배우는 동안에는 ne … pas를 모두 써서 문장 구조를 익혀 봐요. 일상 구어에서는 ne를 생략하기도 해요.' },
    { kind: 'input', ko: '여기에 있고 싶어.', answer: 'Je veux rester ici.', full: 'Je veux rester ici.', hint: 'Je veux로 시작해요. “여기에 머무르다”는 rester ici예요.', note: '단어 카드 없이 Je veux와 rester ici를 직접 연결했어요.' },
    { kind: 'input', transfer: true, ko: '계속하고 싶어.', answer: 'Je veux continuer.', full: 'Je veux continuer.', glossary: '새 단어: continuer = 계속하다', hint: '배운 Je veux 뒤에 새 행동 continuer를 붙여 보세요.', note: '처음 보는 동사도 Je veux 뒤에 붙이면 내가 원하는 행동을 말할 수 있어요.' }
  ]),
  makePack({ id: 'can', title: '다시 해볼 수 있어', subtitle: '가능한 일에 Je peux 붙이기', pattern: 'Je peux + 동사원형', icon: 'sparkles', color: 'mint', promise: '할 수 있는 것과 지금 할 수 없는 것을 말해요.' }, [
    { kind: 'choice', ko: '기다릴 수 있어.', cue: 'Je ___ attendre.', answer: 'peux', full: 'Je peux attendre.', choices: ['peux', 'veux', 'suis'], model: { fr: 'Je peux attendre.', ko: '기다릴 수 있어.', tip: 'Je peux는 “나는 ~할 수 있어”, attendre는 “기다리다”예요.' }, hint: '“할 수 있어”의 중심 단어는 p로 시작해요.', note: 'Je peux 뒤에 동사원형을 붙이면 할 수 있는 일을 말할 수 있어요.' },
    { kind: 'input', ko: '말할 수 있어.', cue: 'Je ___ parler.', answer: 'peux', full: 'Je peux parler.', glossary: 'parler = 말하다', hint: 'p로 시작하는 “할 수 있어”를 넣어요.', note: 'attendre를 parler로 바꿨어요. Je peux는 그대로예요.' },
    { kind: 'input', ko: '기다릴 수 있어.', cue: 'Je peux ___.', answer: 'attendre', full: 'Je peux attendre.', hint: '“기다리다”는 a로 시작해요. a-t-t…를 떠올려 보세요.', note: '이번에는 기다리는 행동인 attendre를 직접 떠올렸어요.' },
    { kind: 'order', ko: '해볼 수 있어.', answer: 'Je peux essayer.', full: 'Je peux essayer.', tiles: ['Je', 'peux', 'essayer'], glossary: 'essayer = 시도하다, 해보다', hint: 'Je → peux → 해보고 싶은 행동 순서예요.', note: 'essayer는 “시도하다”예요. Je peux essayer는 “해볼 수 있어”가 돼요.' },
    { kind: 'choice', ko: '올 수 없어.', cue: 'Je ne peux ___ venir.', answer: 'pas', full: 'Je ne peux pas venir.', choices: ['pas', 'je', 'peux'], model: { fr: 'Je ne peux pas venir.', ko: '올 수 없어.', tip: 'ne와 pas가 peux를 감싸면 “할 수 없어”가 돼요. venir는 “오다”예요.' }, hint: 'ne와 짝을 이루는 p…를 넣어요.', note: 'Je ne peux pas + 동사원형으로 할 수 없는 일을 말해요.' },
    { kind: 'input', ko: '말할 수 없어.', cue: 'Je ne ___ pas parler.', answer: 'peux', full: 'Je ne peux pas parler.', hint: '“할 수 있어”에 썼던 p…가 그대로 들어가요.', note: 'ne … pas로 감싸도 peux의 철자는 바뀌지 않아요.' },
    { kind: 'order', ko: '기다릴 수 없어.', answer: 'Je ne peux pas attendre.', full: 'Je ne peux pas attendre.', tiles: ['Je', 'ne', 'peux', 'pas', 'attendre'], hint: 'Je → ne → peux → pas → 행동 순서예요.', note: '긍정문 Je peux attendre에 ne … pas를 붙여 뜻을 바꿨어요.' },
    { kind: 'input', ko: '올 수 없어.', cue: 'Je ___ peux pas venir.', answer: 'ne', full: 'Je ne peux pas venir.', hint: '부정문을 만드는 ne … pas의 앞부분을 넣어요.', note: '같은 ne … pas 구조를 veux와 peux에 모두 사용할 수 있어요.' },
    { kind: 'input', ko: '해볼 수 있어.', answer: 'Je peux essayer.', full: 'Je peux essayer.', hint: 'Je peux로 시작해요. “해보다”는 essayer예요.', note: '선택지 없이 가능한 행동을 직접 문장으로 만들었어요.' },
    { kind: 'input', transfer: true, ko: '다시 시작할 수 있어.', answer: 'Je peux recommencer.', full: 'Je peux recommencer.', glossary: '새 단어: recommencer = 다시 시작하다', hint: 'Je peux 뒤에 새 행동 recommencer를 붙여 보세요.', note: 'recommencer를 처음 봐도 배운 Je peux로 새 문장을 만들 수 있어요.' }
  ]),
  makePack({ id: 'like', title: '이건 내 취향이야', subtitle: '좋아하는 일에 J’aime 붙이기', pattern: 'J’aime + 동사원형', icon: 'heart', color: 'lavender', promise: '좋아하는 것과 좋아하지 않는 것을 말해요.' }, [
    { kind: 'choice', ko: '읽는 걸 좋아해.', cue: 'J’___ lire.', answer: 'aime', full: 'J’aime lire.', choices: ['aime', 'ai', 'aimes'], model: { fr: 'J’aime lire.', ko: '읽는 걸 좋아해.', tip: 'Je는 모음으로 시작하는 aime 앞에서 J’가 돼요. J’aime는 “나는 좋아해”, lire는 “읽다”예요.' }, hint: '“좋아해”는 a로 시작하는 네 글자예요.', note: 'J’aime 뒤에 동사원형을 붙이면 좋아하는 활동을 말할 수 있어요.' },
    { kind: 'input', ko: '요리하는 걸 좋아해.', cue: 'J’___ cuisiner.', answer: 'aime', full: 'J’aime cuisiner.', glossary: 'cuisiner = 요리하다', hint: 'J’ 뒤에 “좋아해”를 뜻하는 a…를 붙여요.', note: '좋아하는 행동만 cuisiner로 바꿨어요.' },
    { kind: 'input', ko: '읽는 걸 좋아해.', cue: 'J’aime ___.', answer: 'lire', full: 'J’aime lire.', hint: '“읽다”는 l로 시작하는 네 글자예요.', note: 'lire를 직접 떠올려 좋아하는 활동을 완성했어요.' },
    { kind: 'order', ko: '걷는 걸 아주 좋아해.', answer: 'J’aime beaucoup marcher.', full: 'J’aime beaucoup marcher.', tiles: ['J’aime', 'beaucoup', 'marcher'], glossary: 'beaucoup = 많이, 아주 · marcher = 걷다', hint: 'J’aime → 많이 → 좋아하는 행동 순서예요.', note: 'beaucoup를 aime 뒤에 넣으면 얼마나 좋아하는지도 말할 수 있어요.' },
    { kind: 'choice', ko: '기다리는 걸 좋아하지 않아.', cue: 'Je n’aime ___ attendre.', answer: 'pas', full: 'Je n’aime pas attendre.', choices: ['pas', 'beaucoup', 'je'], model: { fr: 'Je n’aime pas attendre.', ko: '기다리는 걸 좋아하지 않아.', tip: '부정문에서는 Je ne … pas를 써요. ne는 aime 앞에서 n’로 줄어들어 Je n’aime pas가 돼요. attendre는 “기다리다”예요.' }, hint: 'n’와 짝을 이루는 p…를 넣어요.', note: 'J’aime가 Je n’aime pas로 바뀌면 좋아하지 않는다는 뜻이에요.' },
    { kind: 'input', ko: '요리하는 걸 좋아하지 않아.', cue: 'Je n’___ pas cuisiner.', answer: 'aime', full: 'Je n’aime pas cuisiner.', hint: '“좋아해”에 사용한 a…를 그대로 넣어요.', note: '부정문에서도 aime는 그대로예요. n’ … pas가 뜻을 부정해요.' },
    { kind: 'order', ko: '읽는 걸 좋아하지 않아.', answer: 'Je n’aime pas lire.', full: 'Je n’aime pas lire.', tiles: ['Je', 'n’aime', 'pas', 'lire'], hint: 'Je → n’aime → pas → 좋아하지 않는 행동 순서예요.', note: '모음 앞에서는 ne를 n’로 줄여 써요. n’aime를 한 조각으로 기억해 보세요.' },
    { kind: 'input', ko: '걷는 걸 좋아하지 않아.', cue: 'Je n’aime ___ marcher.', answer: 'pas', full: 'Je n’aime pas marcher.', hint: '부정문 n’ … pas의 뒷부분이에요.', note: 'marcher에도 같은 부정 표현을 사용할 수 있어요.' },
    { kind: 'input', ko: '걷는 걸 좋아해.', answer: 'J’aime marcher.', accepted: ['J’aime bien marcher.'], full: 'J’aime marcher.', hint: 'J’aime로 시작해요. “걷다”는 marcher예요.', note: '아포스트로피를 잊지 마세요. Je aime는 J’aime로 줄여 써요.' },
    { kind: 'input', transfer: true, ko: '그림 그리는 걸 좋아해.', answer: 'J’aime dessiner.', full: 'J’aime dessiner.', glossary: '새 단어: dessiner = 그림을 그리다', hint: 'J’aime 뒤에 새 행동 dessiner를 붙여 보세요.', note: '새 동사를 알게 되면 J’aime 뒤에 붙여 더 많은 취향을 말할 수 있어요.' }
  ])
];
export const practiceQuestions = practicePacks.flatMap(pack => pack.questions);
export const questionById = id => practiceQuestions.find(q => q.id === id);
