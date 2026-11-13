# v1.7.0 설명 전수 점검표

문장 연습 210문제와 기초 표현 72개를 대상으로 문제·답·해설의 주제 일치를 검토했습니다. 이 표는 현재 코드의 연결을 재현하기 위한 목록입니다. 자동 검사는 누락·연결·렌더링·회귀를 확인하며, 언어 감수를 대체하지 않습니다.

## 바꾼 내용

- 모든 문장 문제에서 코스 공통 설명을 제거하고, 문제 ID별로 짧은 레슨을 지정했습니다. 같은 학습 목표의 문제만 레슨을 공유합니다.
- 114개 레슨에 핵심 설명, 형태·비교표, 번역이 있는 예문, 흔한 혼동을 넣었습니다.
- voir → vu에는 불규칙 과거분사, ne … pas에는 조동사 위치, arrivée에는 성·수 일치를 설명합니다.
- 단어 문제에는 해당 단어·활용형을, 대명사·관계절·비교·접속법에는 해당 문장의 역할과 형태를 설명합니다.
- 기초 표현의 공통 팁을 개별 표현 해설에서 제외했습니다. 숫자·커피 설명을 보강하고, 일부 문장 해설에서 입력 도구·채점 안내를 학습 내용으로 바꿨습니다.
- 문제 ID, 정답, 허용 답, 학습 점수·기존 기록은 유지했습니다. 레슨은 요청할 때 펼치며 열람 자체에 XP를 주지 않습니다.

## QA 기록

- Node: 전 문제 연결과 레슨 구성, 대표 불규칙 활용표, 210문제 전체의 정답 후 펼치기, 기본 접힘, 점수·이어하기·복습·오프라인 회귀를 검사합니다.
- Chrome: 210문제를 실제로 완료하며 각 설명을 펼쳤습니다. 320px·390px에서 표와 설명의 가로 넘침을 검사했습니다. 기초 표현 72개의 개별 해설도 열어 확인했습니다.
- 오답 상태에서도 올바른 레슨을 표시하는지, 설명 열람이 점수를 바꾸지 않는지, 오프라인에서 새 레슨 모듈과 불규칙 표를 여는지 확인했습니다.
- 실제 iOS/Android 기기를 직접 조작한 결과나 전문 원어민 감수로 표시하지 않습니다.

## 형태·용법 확인 자료

- [Académie française · voir 활용](https://www.dictionnaire-academie.fr/conjuguer/A9V1094)
- [Larousse · faire 활용](https://www.larousse.fr/conjugaison/francais/faire/4599)
- [Larousse · venir 활용](https://www.larousse.fr/conjugaison/francais/venir/9299)
- [Larousse · avoir 활용](https://www.larousse.com/conjugaison/francais/avoir/749)
- [Larousse · aller 활용](https://www.larousse.fr/conjugaison/francais/aller/314)
- [OQLF · 복합과거](https://vitrinelinguistique.oqlf.gouv.qc.ca/24218/la-grammaire/le-verbe/temps-grammaticaux/passe/generalites-sur-le-passe-compose)
- [OQLF · être와 과거분사 일치](https://vitrinelinguistique.oqlf.gouv.qc.ca/24222/la-grammaire/le-verbe/accord-du-participe-passe/avec-lauxiliaire-etre/synthese-des-regles-daccord-du-participe-passe-employe-avec-etre)
- [OQLF · 가정문과 조건법](https://vitrinelinguistique.oqlf.gouv.qc.ca/24140/la-grammaire/le-verbe/temps-grammaticaux/conditionnel/conditionnel-dans-les-phrases-hypothetiques)

## 문장 연습: 문제별 설명 연결

### 오늘은 그냥 쉬고 싶어 · want

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| want-1 | 자고 싶어. | veux | veux는 vouloir가 바뀐 형태예요 |
| want-2 | 먹고 싶어. | veux | veux는 vouloir가 바뀐 형태예요 |
| want-3 | 자고 싶어. | dormir | dormir와 dors는 언제 쓰나요? |
| want-4 | 여기에 있고 싶어. | Je veux rester ici. | rester ici를 한 덩어리로 |
| want-5 | 떠나고 싶지 않아. | pas | 하고 싶지 않다: ne veux pas |
| want-6 | 자고 싶지 않아. | veux | 하고 싶지 않다: ne veux pas |
| want-7 | 먹고 싶지 않아. | Je ne veux pas manger. | 하고 싶지 않다: ne veux pas |
| want-8 | 떠나고 싶지 않아. | ne | 하고 싶지 않다: ne veux pas |
| want-9 | 여기에 있고 싶어. | Je veux rester ici. | rester ici를 한 덩어리로 |
| want-10 | 계속하고 싶어. | Je veux continuer. | continuer로 행동만 바꿔요 |

### 다시 해볼 수 있어 · can

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| can-1 | 기다릴 수 있어. | peux | peux는 pouvoir의 현재형 |
| can-2 | 말할 수 있어. | peux | peux는 pouvoir의 현재형 |
| can-3 | 기다릴 수 있어. | attendre | attendre: 기다리다 |
| can-4 | 해볼 수 있어. | Je peux essayer. | essayer: 해보다, 시도하다 |
| can-5 | 올 수 없어. | pas | 할 수 없다: ne peux pas |
| can-6 | 말할 수 없어. | peux | 할 수 없다: ne peux pas |
| can-7 | 기다릴 수 없어. | Je ne peux pas attendre. | 할 수 없다: ne peux pas |
| can-8 | 올 수 없어. | ne | 할 수 없다: ne peux pas |
| can-9 | 해볼 수 있어. | Je peux essayer. | essayer: 해보다, 시도하다 |
| can-10 | 다시 시작할 수 있어. | Je peux recommencer. | recommencer: 다시 시작하다 |

### 이건 내 취향이야 · like

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| like-1 | 읽는 걸 좋아해. | aime | J’aime 뒤에 좋아하는 활동 |
| like-2 | 요리하는 걸 좋아해. | aime | J’aime 뒤에 좋아하는 활동 |
| like-3 | 읽는 걸 좋아해. | lire | lire는 원형, lis는 현재형 |
| like-4 | 걷는 걸 아주 좋아해. | J’aime beaucoup marcher. | beaucoup는 얼마나 좋아하는지 |
| like-5 | 기다리는 걸 좋아하지 않아. | pas | J’aime → Je n’aime pas |
| like-6 | 요리하는 걸 좋아하지 않아. | aime | J’aime → Je n’aime pas |
| like-7 | 읽는 걸 좋아하지 않아. | Je n’aime pas lire. | J’aime → Je n’aime pas |
| like-8 | 걷는 걸 좋아하지 않아. | pas | J’aime → Je n’aime pas |
| like-9 | 걷는 걸 좋아해. | J’aime marcher. | J’aime 뒤에 좋아하는 활동 |
| like-10 | 그림 그리는 걸 좋아해. | J’aime dessiner. | dessiner로 좋아하는 활동 바꾸기 |

### 지금의 나를 소개해요 · be

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| be-1 | 나는 여기에 있어. | suis | suis는 être의 현재형 |
| be-2 | 나는 집에 있어. | suis | suis는 être의 현재형 |
| be-3 | 여기 | ici | ici는 관사 없이 써요 |
| be-4 | 나는 집에 있어. | Je suis à la maison. | 집에 있다: être à la maison |
| be-5 | 나는 여기에 있지 않아. | pas | 상태·장소를 부정하는 ne suis pas |
| be-6 | 나는 집에 있지 않아. | suis | 상태·장소를 부정하는 ne suis pas |
| be-7 | 나는 여기에 있지 않아. | Je ne suis pas ici. | 상태·장소를 부정하는 ne suis pas |
| be-8 | 나는 준비됐어. | prêt | prêt와 prête: 준비된 사람에 맞춰요 |
| be-9 | 나는 집에 있어. | Je suis à la maison. | 집에 있다: être à la maison |
| be-10 | 나는 피곤해. | Je suis fatigué. | fatigué와 fatiguée |

### 가진 것과 필요한 휴식 · have

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| have-1 | 나는 가방 하나가 있어. | ai | J’ai와 avoir의 현재형 |
| have-2 | 나는 책 한 권이 있어. | ai | J’ai와 avoir의 현재형 |
| have-3 | 가방 | sac | sac은 남성 명사예요 |
| have-4 | 나는 질문 하나가 있어. | J’ai une question. | un·une는 명사의 성에 맞춰요 |
| have-5 | 나는 가방이 없어. | de | 하나도 없다: pas de |
| have-6 | 나는 책이 없어. | de | 하나도 없다: pas de |
| have-7 | 나는 가방이 없어. | Je n’ai pas de sac. | 하나도 없다: pas de |
| have-8 | 나는 배고파. | faim | 배고프다: avoir faim |
| have-9 | 나는 책 한 권이 있어. | J’ai un livre. | un·une는 명사의 성에 맞춰요 |
| have-10 | 나는 목말라. | J’ai soif. | 목마르다: avoir soif |

### 오늘은 어디로 갈까요 · go

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| go-1 | 나는 파리에 가. | vais | vais는 aller의 현재형 |
| go-2 | 나는 집에 가. | vais | vais는 aller의 현재형 |
| go-3 | 집 | maison | maison은 집, à la maison은 집에 |
| go-4 | 나는 집에 가. | Je vais à la maison. | maison은 집, à la maison은 집에 |
| go-5 | 나는 카페에 가. | au | à le는 au, à la는 그대로 |
| go-6 | 나는 기차역에 가. | à la | à le는 au, à la는 그대로 |
| go-7 | 나는 카페에 가. | Je vais au café. | à le는 au, à la는 그대로 |
| go-8 | 나는 파리에 가지 않아. | pas | 가지 않는다: ne vais pas |
| go-9 | 나는 기차역에 가. | Je vais à la gare. | à le는 au, à la는 그대로 |
| go-10 | 나는 시장에 가. | Je vais au marché. | à le는 au, à la는 그대로 |

### 카페에서 내 주문은 · order-food

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| order-food-1 | 커피 한 잔 주세요. | voudrais | voudrais: 부드럽게 부탁하는 형태 |
| order-food-2 | 차 한 잔 주세요. | voudrais | voudrais: 부드럽게 부탁하는 형태 |
| order-food-3 | 커피 | café | café: 커피와 카페 |
| order-food-4 | 크루아상 하나 주세요. | Je voudrais un croissant. | 메뉴도 un·une와 함께 |
| order-food-5 | 샐러드 하나 주세요. | une | 메뉴도 un·une와 함께 |
| order-food-6 | 차 한 잔 주세요. | thé | thé: 차 한 잔을 말해요 |
| order-food-7 | 샐러드 하나 주세요. | Je voudrais une salade. | 메뉴도 un·une와 함께 |
| order-food-8 | 커피 한 잔 주세요. | un | 메뉴도 un·une와 함께 |
| order-food-9 | 차 한 잔 주세요. | Je voudrais un thé. | voudrais: 부드럽게 부탁하는 형태 |
| order-food-10 | 샌드위치 하나 주세요. | Je voudrais un sandwich. | 메뉴도 un·une와 함께 |

### 도움이 필요할 때 · need

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| need-1 | 나는 도움이 필요해. | besoin | avoir besoin de는 필요한 것을 이어요 |
| need-2 | 나는 휴식이 필요해. | besoin | avoir besoin de는 필요한 것을 이어요 |
| need-3 | 도움 | aide | aide와 d’aide의 차이 |
| need-4 | 나는 도움이 필요해. | J’ai besoin d’aide. | aide와 d’aide의 차이 |
| need-5 | 나는 도움이 필요하지 않아. | pas | 필요하지 않다: n’ai pas besoin de |
| need-6 | 나는 휴식이 필요하지 않아. | de | 필요하지 않다: n’ai pas besoin de |
| need-7 | 나는 도움이 필요하지 않아. | Je n’ai pas besoin d’aide. | 필요하지 않다: n’ai pas besoin de |
| need-8 | 나는 잘 필요가 있어. | dormir | 필요한 행동에는 de + 동사원형 |
| need-9 | 나는 휴식이 필요해. | J’ai besoin de repos. | avoir besoin de는 필요한 것을 이어요 |
| need-10 | 나는 먹을 필요가 있어. | J’ai besoin de manger. | 필요한 행동에는 de + 동사원형 |

### 어디에 있는지 물어요 · where

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| where-1 | 기차역은 어디에 있나요? | est | 한 장소를 물을 때 Où est |
| where-2 | 카페는 어디에 있나요? | est | 한 장소를 물을 때 Où est |
| where-3 | 기차역 | gare | gare는 기차역이라는 여성 명사 |
| where-4 | 기차역은 어디에 있나요? | Où est la gare ? | 한 장소를 물을 때 Où est |
| where-5 | 화장실은 어디에 있나요? | sont | les toilettes는 복수 표현이에요 |
| where-6 | 화장실은 어디에 있나요? | les | les toilettes는 복수 표현이에요 |
| where-7 | 화장실은 어디에 있나요? | Où sont les toilettes ? | les toilettes는 복수 표현이에요 |
| where-8 | 호텔은 어디에 있나요? | hôtel | 무음 h 앞에서는 l’hôtel |
| where-9 | 카페는 어디에 있나요? | Où est le café ? | 한 장소를 물을 때 Où est |
| where-10 | 박물관은 어디에 있나요? | Où est le musée ? | musée는 남성 명사예요 |

### 어제 무엇을 했나요 · past-events

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| past-events-1 | 나는 어제 일했어. | ai | 복합과거: avoir 현재형 + 과거분사 |
| past-events-2 | 나는 어제 영화를 봤어. (regarder) | regardé | -er 동사는 -é로 바꿔요 |
| past-events-3 | voir(보다)의 과거분사를 써요. | vu | voir → vu: 불규칙 과거분사 |
| past-events-4 | 나는 내 일을 끝냈어. | J’ai fini mon travail. | finir → fini: 끝낸 일을 말해요 |
| past-events-5 | 나는 이 영화를 보지 않았어. | pas | 과거 부정문은 조동사를 감싸요 |
| past-events-6 | 나는 아직 먹지 않았어. | mangé | 아직 안 했다: pas encore |
| past-events-7 | 우리는 이 영화를 봤어. | Nous avons vu ce film. | 주어가 바뀌어도 이 vu는 그대로 |
| past-events-8 | 너는 네 일을 끝냈어. | as | 복합과거: avoir 현재형 + 과거분사 |
| past-events-9 | 나는 어제 영화를 봤어. (regarder) | Hier, j’ai regardé un film. | -er 동사는 -é로 바꿔요 |
| past-events-10 | 우리는 어제 식당에서 먹었어. | Nous avons mangé au restaurant hier. | 우리가 먹었다: nous avons mangé |

### 어디에 다녀왔나요 · past-movement

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| past-movement-1 | 그녀는 파리에 갔어. | est | aller → allé, être와 성·수 일치 |
| past-movement-2 | 그는 파리에 갔어. | allé | aller → allé, être와 성·수 일치 |
| past-movement-3 | arriver(도착하다)의 여성 단수 과거분사를 써요. | arrivée | arriver → arrivé → arrivée |
| past-movement-4 | 그녀는 어제 도착했어. | Elle est arrivée hier. | arriver → arrivé → arrivée |
| past-movement-5 | 그 여자들은 떠났어. | parties | partir → parti, 여성 복수는 parties |
| past-movement-6 | 그 남자들은 떠났어. | sont | partir → parti, 여성 복수는 parties |
| past-movement-7 | 그녀는 파리에 가지 않았어. | Elle n’est pas allée à Paris. | être를 쓰는 과거 부정문 |
| past-movement-8 | 그녀들은 제시간에 도착했어. | arrivées | arriver → arrivé → arrivée |
| past-movement-9 | 나는 어제 파리에 갔어. | Je suis allé à Paris hier. | aller → allé, être와 성·수 일치 |
| past-movement-10 | 그녀는 어젯밤 떠났어. | Elle est partie hier soir. | partir → parti, 여성 복수는 parties |

### 그때는 무슨 일이 있었나요 · past-background

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| past-background-1 | 나는 그때 파리에 살고 있었어. | habitais | habiter → habitais: 과거의 배경 |
| past-background-2 | 우리는 그때 매일 일하곤 했어. | travaillions | nous의 반과거 어미는 -ions |
| past-background-3 | être의 je 반과거 형태를 써요. | étais | être의 반과거는 ét-에서 시작해요 |
| past-background-4 | 어제 8시에 나는 읽고 있었어. | Hier, à huit heures, je lisais. | lire의 반과거: lisais |
| past-background-5 | 내가 읽고 있을 때 전화가 울렸어. | a | 진행 중인 배경과 새로 생긴 사건 |
| past-background-6 | 내가 요리하고 있을 때 전화가 울렸어. | cuisinais | 진행 중인 배경과 새로 생긴 사건 |
| past-background-7 | 비가 오고 있었고, 나는 집에 있었어. | Il pleuvait et j’étais à la maison. | 날씨와 상태를 반과거로 |
| past-background-8 | 너는 그때 시간이 있었어. | avais | avoir의 반과거: avais·avions |
| past-background-9 | 나는 그때 파리에 살고 있었어. | À cette époque, j’habitais à Paris. | habiter → habitais: 과거의 배경 |
| past-background-10 | 내가 자고 있을 때 전화가 울렸어. | Je dormais quand le téléphone a sonné. | 진행 중인 배경과 새로 생긴 사건 |

### 앞으로 할 일을 약속해요 · future-plans

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| future-plans-1 | 나는 내일 일할 거야. (단순미래) | travaillerai | travailler의 단순미래: travailler- |
| future-plans-2 | 우리는 내일 먹을 거야. (단순미래) | mangerons | manger의 단순미래: manger- |
| future-plans-3 | avoir의 je 단순미래 형태를 써요. | aurai | avoir의 단순미래: aur- |
| future-plans-4 | 너는 내일 시간이 있을 거야. | Tu auras du temps demain. | avoir의 단순미래: aur- |
| future-plans-5 | 나는 내일 파리에 갈 거야. (단순미래) | irai | aller의 단순미래: ir- |
| future-plans-6 | 그녀는 내일 여기에 있을 거야. (단순미래) | sera | être의 단순미래: ser- |
| future-plans-7 | 우리는 내일 일하지 않을 거야. | Nous ne travaillerons pas demain. | 미래를 부정해도 동사는 한 덩어리 |
| future-plans-8 | 당신은 내일 올 거예요. (단순미래) | viendrez | venir의 단순미래: viendr- |
| future-plans-9 | 나는 내일 파리에 갈 거야. (단순미래) | J’irai à Paris demain. | aller의 단순미래: ir- |
| future-plans-10 | 우리는 내일 이 일을 할 거야. (단순미래) | Nous ferons ce travail demain. | faire의 단순미래: fer- |

### 조건이 맞으면 할 거예요 · real-conditions

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| real-conditions-1 | 시간이 있으면 나는 갈 거야. | ai | 가능한 조건: si + 현재, 결과는 미래 |
| real-conditions-2 | 비가 오면 우리는 집에 있을 거야. | pleut | 비가 오면: si + il → s’il |
| real-conditions-3 | rester의 nous 단순미래 형태를 써요. | resterons | rester의 단순미래: rester- |
| real-conditions-4 | 시간이 있으면 나는 일할 거야. | Si j’ai le temps, je travaillerai. | 가능한 조건: si + 현재, 결과는 미래 |
| real-conditions-5 | 네가 오면 우리는 함께 먹을 거야. | mangerons | 네가 오면: si tu viens |
| real-conditions-6 | 네가 오면 우리는 함께 먹을 거야. | viens | 네가 오면: si tu viens |
| real-conditions-7 | 비가 오면 나는 외출하지 않을 거야. | S’il pleut, je ne sortirai pas. | 비가 오면: si + il → s’il |
| real-conditions-8 | 네가 시간이 있으면 우리는 이야기할 거야. | parlerons | parler의 단순미래: parler- |
| real-conditions-9 | 시간이 있으면 나는 갈 거야. | Si j’ai le temps, j’irai. | 가능한 조건: si + 현재, 결과는 미래 |
| real-conditions-10 | 날씨가 좋으면 우리는 걸을 거야. | S’il fait beau, nous marcherons. | 날씨가 좋으면: s’il fait beau |

### 만약 그럴 수 있다면 · imagined-conditions

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| imagined-conditions-1 | 시간이 있다면 나는 여행할 텐데. | avais | 상상하는 조건: avais·avions |
| imagined-conditions-2 | 시간이 있다면 나는 더 읽을 텐데. | lirais | lire의 조건법: lir- + 반과거 어미 |
| imagined-conditions-3 | être의 je 조건법 현재 형태를 써요. | serais | être의 조건법: ser- + 반과거 어미 |
| imagined-conditions-4 | 내가 부자라면 여행할 텐데. | Si j’étais riche, je voyagerais. | 내가 ~라면: si j’étais |
| imagined-conditions-5 | 시간이 있다면 우리는 갈 텐데. | irions | aller의 조건법: ir- + 반과거 어미 |
| imagined-conditions-6 | 시간이 있다면 우리는 더 읽을 텐데. | avions | 상상하는 조건: avais·avions |
| imagined-conditions-7 | 내가 너라면 여기 머물 텐데. | Si j’étais toi, je resterais ici. | 내가 ~라면: si j’étais |
| imagined-conditions-8 | 시간이 있다면 나는 그것을 할 텐데. | ferais | faire의 조건법: fer- + 반과거 어미 |
| imagined-conditions-9 | 시간이 있다면 나는 여행할 텐데. | Si j’avais le temps, je voyagerais. | 상상하는 조건: avais·avions |
| imagined-conditions-10 | 내가 너라면 휴식을 취할 텐데. | Si j’étais toi, je prendrais une pause. | prendre의 조건법: prendr- + 반과거 어미 |

### 같은 말을 반복하지 않아요 · object-pronouns

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| object-pronouns-1 | 이 책을 읽고 있어. “그것을”로 바꿔요. | le | 목적어를 le·la·les로 바꾸기 |
| object-pronouns-2 | 그 편지를 읽고 있어. “그것을”로 바꿔요. | la | 목적어를 le·la·les로 바꾸기 |
| object-pronouns-3 | les livres를 받는 직접목적어 대명사를 써요. | les | 목적어를 le·la·les로 바꾸기 |
| object-pronouns-4 | 그 책들을 읽어. (대명사로) | Je les lis. | 목적어를 le·la·les로 바꾸기 |
| object-pronouns-5 | 이 책을 읽고 싶어. “그것을”로 바꿔요. | le | 어느 동사의 목적어인지 먼저 봐요 |
| object-pronouns-6 | 그 편지를 읽고 싶어. (대명사로) | la | 어느 동사의 목적어인지 먼저 봐요 |
| object-pronouns-7 | 이 책을 읽지 않아. (대명사로) | Je ne le lis pas. | ne → 대명사 → 동사 → pas |
| object-pronouns-8 | 이 책을 좋아해. “그것을”로 바꿔요. | l’ | le·la + 모음 → l’ |
| object-pronouns-9 | 이 책을 읽고 싶어. “그것을”로 바꿔요. | Je veux le lire. | 어느 동사의 목적어인지 먼저 봐요 |
| object-pronouns-10 | 그 편지를 이해할 수 있어. (대명사로) | Je peux la comprendre. | 어느 동사의 목적어인지 먼저 봐요 |

### 장소와 수량을 짧게 말해요 · place-quantity

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| place-quantity-1 | 나는 파리에 가. “그곳에”로 바꿔요. | y | 이미 나온 장소를 y로 받아요 |
| place-quantity-2 | 나는 집에 있어. “그곳에”로 바꿔요. | y | 이미 나온 장소를 y로 받아요 |
| place-quantity-3 | “사과 세 개가 있어”에서 사과를 대신할 대명사를 써요. | en | en으로 명사를 받고 숫자는 남겨요 |
| place-quantity-4 | 나는 그곳에 가고 싶어. | Je veux y aller. | 가고 싶은 곳: y aller |
| place-quantity-5 | 나는 사과가 두 개 있어. (대명사로) | en | en으로 명사를 받고 숫자는 남겨요 |
| place-quantity-6 | 나는 사과가 세 개 있어. (대명사로) | trois | en으로 명사를 받고 숫자는 남겨요 |
| place-quantity-7 | 사과는 하나도 없어. (대명사로) | Je n’en ai pas. | 하나도 없다: Je n’en ai pas |
| place-quantity-8 | 차를 마셔. “차를” 대신 대명사를 써요. | en | du thé도 en으로 받을 수 있어요 |
| place-quantity-9 | 나는 그곳에 가고 싶어. | Je veux y aller. | 가고 싶은 곳: y aller |
| place-quantity-10 | 그녀는 그곳에서 일해. (이미 나온 장소) | Elle y travaille. | 이미 나온 장소를 y로 받아요 |

### 어떤 사람인지 설명해요 · relative-links

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| relative-links-1 | 나는 여기서 일하는 친구 한 명이 있어. | qui | 관계절의 주어 역할은 qui |
| relative-links-2 | 이건 내가 좋아하는 책이야. | que | 관계절의 목적어 역할은 que |
| relative-links-3 | que가 모음 앞에서 줄어든 형태를 써요. | qu’ | que + elle → qu’elle |
| relative-links-4 | 이건 내가 읽고 있는 책이야. | C’est le livre que je lis. | 관계절의 목적어 역할은 que |
| relative-links-5 | 이건 그녀가 읽고 있는 책이야. | qu’ | que + elle → qu’elle |
| relative-links-6 | 나는 프랑스어를 하는 친구 한 명이 있어. | qui | 관계절의 주어 역할은 qui |
| relative-links-7 | 이건 내가 좋아하는 카페야. | C’est le café que j’aime. | 관계절의 목적어 역할은 que |
| relative-links-8 | 이건 문을 여는 열쇠야. | qui | qui는 모음 앞에서도 그대로 |
| relative-links-9 | 이건 내가 읽고 있는 책이야. | C’est le livre que je lis. | 관계절의 목적어 역할은 que |
| relative-links-10 | 나는 리옹에 사는 친구 한 명이 있어. | J’ai un ami qui habite à Lyon. | 관계절의 주어 역할은 qui |

### 더 나은 선택을 설명해요 · comparisons

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| comparisons-1 | 이 가방은 저 가방보다 더 커. | plus | 더 ~하다: plus + 형용사 + que |
| comparisons-2 | 이 가방은 저 가방보다 덜 비싸. | moins | 덜 ~하다: moins + 형용사 + que |
| comparisons-3 | bon의 남성 단수 비교급을 써요. | meilleur | bon의 비교급: meilleur |
| comparisons-4 | 이 가방은 저 가방만큼 커. | Ce sac est aussi grand que celui-là. | 같은 정도: aussi + 형용사 + que |
| comparisons-5 | 그녀는 나보다 프랑스어를 더 잘해. | mieux | 행동을 더 잘한다면 mieux |
| comparisons-6 | 이 수프가 더 좋아. (맛·품질) | meilleure | bon의 비교급: meilleur |
| comparisons-7 | 나는 전보다 더 잘 이해해. | Je comprends mieux qu’avant. | 행동을 더 잘한다면 mieux |
| comparisons-8 | 이 책들은 더 좋아. | meilleurs | bon의 비교급: meilleur |
| comparisons-9 | 이 가방은 저 가방보다 덜 비싸. | Ce sac est moins cher que celui-là. | 덜 ~하다: moins + 형용사 + que |
| comparisons-10 | 이 방은 저 방보다 더 조용해. | Cette chambre est plus calme que celle-là. | celle-là는 여성 명사를 받아요 |

### 왜 그렇게 생각하나요 · opinion-links

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| opinion-links-1 | 비가 오기 때문에 나는 집에 있어. | parce qu’ | 이유를 붙이는 parce que |
| opinion-links-2 | 시간이 없기 때문에 나는 갈 수 없어. | parce que | 이유를 붙이는 parce que |
| opinion-links-3 | 결과를 이어주는 “그래서”에 해당하는 연결어를 써요. | donc | 원인 다음의 결과를 donc로 |
| opinion-links-4 | 비가 와. 그래서 나는 집에 있어. | Il pleut, donc je reste à la maison. | 원인 다음의 결과를 donc로 |
| opinion-links-5 | 비가 와. 그런데도 나는 외출해. | pourtant | 예상과 다른 결과는 pourtant |
| opinion-links-6 | 나는 이게 중요하다고 생각해. | que | Je pense que 뒤에 생각을 붙여요 |
| opinion-links-7 | 이건 비싸. 그런데도 나는 그것을 사고 싶어. | C’est cher, pourtant je veux l’acheter. | 예상과 다른 결과는 pourtant |
| opinion-links-8 | 나는 그가 옳다고 생각해. | a | 옳다: avoir raison |
| opinion-links-9 | 비가 오기 때문에 나는 집에 있어. (parce que) | Je reste à la maison parce qu’il pleut. | 이유를 붙이는 parce que |
| opinion-links-10 | 나는 프랑스어를 배우기 때문에 매일 연습해. (parce que) | Je pratique tous les jours parce que j’apprends le français. | 배우는 이유와 연습을 연결해요 |

### 필요와 바람을 전해요 · necessity

| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |
| --- | --- | --- | --- |
| necessity-1 | 네가 와야 해. | viennes | venir의 접속법: vienne·viennes |
| necessity-2 | 네가 여기에 있어야 해. | sois | être의 접속법: sois·soit |
| necessity-3 | faire의 tu 접속법 현재 형태를 써요. | fasses | faire의 접속법은 fass- |
| necessity-4 | 네가 이 일을 해야 해. | Il faut que tu fasses ce travail. | faire의 접속법은 fass- |
| necessity-5 | 나는 네가 오기를 원해. | viennes | venir의 접속법: vienne·viennes |
| necessity-6 | 나는 그가 오기를 원해. | vienne | venir의 접속법: vienne·viennes |
| necessity-7 | 그녀가 준비되어 있어야 해. | Il faut qu’elle soit prête. | être의 접속법: sois·soit |
| necessity-8 | 우리가 떠나야 해. | partions | partir의 nous 접속법: partions |
| necessity-9 | 네가 여기에 있어야 해. | Il faut que tu sois ici. | être의 접속법: sois·soit |
| necessity-10 | 나는 네가 시간이 있기를 바라. (Je veux que) | Je veux que tu aies du temps. | avoir의 접속법: aie·aies·ait |

## 기초 표현: 개별 해설

코스 공통 팁은 이 해설에 덧붙이지 않습니다.

### 반가워요, Bonjour!

| 표현 | 개별 해설 |
| --- | --- |
| Bonjour ! | 낮에 만났을 때 쓰는 인사예요. 처음 만난 사람이나 가게 직원에게도 사용할 수 있어요. |
| Bonsoir ! | 저녁에 만났을 때 쓰는 인사예요. 잠자리에 들며 하는 인사 Bonne nuit와 구분해요. |
| Salut ! | 친구나 가까운 사람에게 만날 때도, 헤어질 때도 써요. 정중한 상황에서는 Bonjour나 Au revoir가 좋아요. |
| Comment allez-vous ? | allez는 aller의 vous 형태예요. vous는 한 사람에게 정중하게 말하거나 여러 사람을 가리킬 때 써요. |
| Très bien, merci. | Très bien은 “아주 잘”, merci는 “고마워요”예요. 안부를 묻는 질문에 답하는 짧은 표현이에요. |
| Au revoir ! | 상대가 떠나거나 내가 떠날 때 모두 쓸 수 있어요. 한국어의 “안녕히 가세요 / 계세요”를 모두 표현해요. |

### 내 이름은…

| 표현 | 개별 해설 |
| --- | --- |
| Je m’appelle Minji. | Je m’appelle는 “내 이름은 ~이다”예요. m’는 me가 모음 앞에서 줄어든 형태이고, 뒤에는 이름을 넣어요. |
| Comment vous appelez-vous ? | vous appelez를 질문 어순 appelez-vous로 바꾼 표현이에요. vous를 써서 이름을 정중하게 물어요. |
| Je viens de Corée. | Je viens de는 “나는 ~에서 왔다”예요. Corée 앞의 de는 출신을 나타내며 이 표현에서는 관사를 넣지 않아요. |
| Je parle un peu français. | un peu는 “조금”이에요. 언어를 말할 때 parler 뒤에는 보통 관사 없이 français를 써요. |
| Et vous ? | Et는 “그리고”, vous는 정중한 “당신”이에요. 내 답 뒤에 붙이면 같은 질문을 상대에게 돌릴 수 있어요. |
| Ravi de vous rencontrer. | ravi는 말하는 사람이 남성일 때, ravie는 여성일 때 써요. 철자에서 e만 다르고 발음은 같아요. |

### 작은 말, 큰 친절

| 표현 | 개별 해설 |
| --- | --- |
| Merci beaucoup. | beaucoup는 “많이”예요. Merci 뒤에 붙여 고마움을 더 강조해요. |
| S’il vous plaît. | 정중한 부탁에 붙이는 고정 표현이에요. 친한 사람 한 명에게는 vous 대신 te를 써서 s’il te plaît라고 해요. |
| De rien. | 감사를 받았을 때 쓰는 “천만에요”예요. rien은 “아무것도”라는 말이지만 이 표현은 통째로 익혀요. |
| Excusez-moi. | excuser의 정중한 명령형 Excusez에 moi를 연결했어요. 두 부분 사이에 하이픈을 써요. |
| Pardon. | 가벼운 사과뿐 아니라 사람들 사이를 지나갈 때 “잠시만요”라는 뜻으로도 써요. |
| Ce n’est pas grave. | grave는 “심각한”이에요. Ce n’est pas grave는 심각한 일이 아니라며 상대를 안심시키는 표현이에요. |

### 파리의 작은 카페

| 표현 | 개별 해설 |
| --- | --- |
| Un café, s’il vous plaît. | café는 남성 명사라 한 잔을 un café라고 해요. s’il vous plaît를 뒤에 붙이면 짧은 메뉴 이름만으로도 정중하게 주문할 수 있어요. |
| Je voudrais un croissant. | Je voudrais는 정중한 요청이에요. croissant은 남성 명사라 un croissant이라고 써요. |
| Sur place ou à emporter ? | sur place는 “매장에서”, à emporter는 “가지고 갈”이라는 뜻이에요. 가운데 ou는 “또는”이에요. |
| À emporter, s’il vous plaît. | à emporter는 포장 주문에 쓰는 표현이에요. 매장에서 먹으려면 Sur place, s’il vous plaît라고 해요. |
| L’addition, s’il vous plaît. | addition은 식사 계산서라는 여성 명사예요. 모음으로 시작하므로 la addition 대신 l’addition이라고 써요. |
| C’est délicieux ! | C’est는 “이것은 ~이다”예요. délicieux를 붙여 음식이 맛있다고 표현해요. |

### 하나, 둘, trois

| 표현 | 개별 해설 |
| --- | --- |
| Un, deux, trois. | 1은 un, 2는 deux, 3은 trois예요. 물건 수를 말하면 un livre, deux livres처럼 숫자를 명사 앞에 놓아요. 여성 명사 하나는 une question처럼 une를 써요. |
| Quatre, cinq, six. | 4는 quatre, 5는 cinq, 6은 six예요. cinq euros는 “5유로”예요. 숫자 cinq는 그대로 두고 뒤의 euro를 복수 euros로 써요. |
| Sept, huit, neuf, dix. | 7은 sept, 8은 huit, 9는 neuf, 10은 dix예요. 뒤에 명사를 붙여 huit livres(책 여덟 권), dix euros(10유로)처럼 수량을 말해요. |
| Combien ça coûte ? | combien은 “얼마나”, ça coûte는 “그것은 값이 ~이다”예요. 일상에서 가격을 묻는 질문으로 써요. |
| Ça coûte cinq euros. | Ça coûte 뒤에 금액을 붙여요. 5유로는 복수이므로 euros에 s를 써요. |
| Je peux payer par carte ? | Je peux + 동사원형 payer에 결제 수단 par carte를 붙였어요. 물음표를 붙여 가능 여부를 물어요. |

### 길 위의 프랑스어

| 표현 | 개별 해설 |
| --- | --- |
| Où est la gare ? | Où est 뒤에 찾는 장소를 붙여요. gare는 여성 명사라 la gare라고 써요. 위치의 où에는 악센트가 있어요. |
| C’est à droite. | à droite는 “오른쪽에”예요. C’est 뒤에 붙이면 오른쪽에 있다고 설명할 수 있어요. |
| C’est à gauche. | à gauche는 “왼쪽에”예요. à droite와 같은 자리에 넣어 방향만 바꿔요. |
| Tout droit. | tout droit는 “똑바로 / 직진”이에요. 오른쪽을 뜻하는 à droite와 전치사, 마지막 e가 달라요. |
| Un billet pour Paris, s’il vous plaît. | un billet은 표 한 장, pour Paris는 파리행이라는 뜻이에요. pour 뒤에 목적지를 넣어요. |
| Je suis perdu. | perdu는 남성형, perdue는 여성형이에요. Je suis 뒤의 형용사를 말하는 사람에 맞춰 쓰며 발음은 같아요. |

### 마음에 드는 발견

| 표현 | 개별 해설 |
| --- | --- |
| Je regarde, merci. | Je regarde는 “보고 있어요”예요. 가게에서는 merci와 함께 둘러보는 중이라고 알려주는 표현으로 써요. |
| Je cherche un cadeau. | Je cherche는 “나는 찾고 있다”예요. cadeau는 남성 명사이므로 un cadeau로 붙여요. |
| Je peux essayer ? | Je peux 뒤에 essayer를 원형으로 붙였어요. 문맥에 따라 입어 보기, 신어 보기, 시도해 보기를 뜻해요. |
| C’est trop cher. | trop은 “너무”, cher는 “비싼”이에요. C’est 뒤에 trop cher를 붙여 가격에 대한 생각을 말해요. |
| Je prends ça. | prends는 prendre의 Je 형태예요. ça는 가리키는 물건을 뜻하며, 가게에서 “이걸로 할게요”로 써요. |
| Vous avez un sac ? | Vous avez는 “가지고 계세요”예요. 질문 억양과 물음표로 봉투가 있는지 물을 수 있어요. |

### 꼭 필요한 한마디

| 표현 | 개별 해설 |
| --- | --- |
| Je ne comprends pas. | comprends는 comprendre의 Je 형태예요. ne와 pas가 comprends를 감싸 이해하지 못한다는 뜻을 만들어요. |
| Pouvez-vous répéter ? | pouvez-vous는 “해 주실 수 있나요”라는 정중한 질문이에요. 뒤에는 동사원형 répéter를 붙여요. |
| Plus lentement, s’il vous plaît. | plus lentement는 “더 천천히”예요. s’il vous plaît를 덧붙여 정중하게 말하는 속도를 요청해요. |
| Parlez-vous anglais ? | vous parlez의 순서를 parlez-vous로 바꾼 질문이에요. 영어라는 언어 이름 anglais 앞에는 여기서 관사를 쓰지 않아요. |
| J’ai besoin d’aide. | J’ai besoin de는 “~이 필요하다”예요. 모음으로 시작하는 aide 앞에서 de는 d’로 줄어요. |
| Où sont les toilettes ? | 화장실은 les toilettes처럼 복수로 써요. 그래서 단수 est가 아니라 복수 sont로 위치를 물어요. |

### 내 하루의 작은 이야기

| 표현 | 개별 해설 |
| --- | --- |
| J’habite à Séoul. | habiter는 살다예요. 도시 앞에는 보통 à를 써서 à Séoul이라고 해요. |
| Je travaille ici. | travailler의 Je 형태는 travaille예요. ici는 “여기”라는 장소 부사예요. |
| J’étudie le français. | étudier 앞에서 Je는 J’가 돼요. 공부하는 언어 이름 앞에는 le를 써요. |
| Je rentre à la maison. | rentrer는 돌아가다예요. à la maison은 “집에”라는 장소 표현이에요. |
| Je suis à la maison. | suis는 être의 Je 형태예요. 이동이 아니라 현재 있는 장소를 알려줘요. |
| À demain ! | demain은 내일이에요. À demain은 내일 다시 만날 때 쓰는 인사예요. |

### 날씨로 시작하는 대화

| 표현 | 개별 해설 |
| --- | --- |
| Il fait beau. | 날씨를 말하는 il은 특정 사람을 가리키지 않아요. Il fait beau를 통째로 익혀요. |
| Il fait chaud. | chaud는 덥다는 뜻이에요. 바깥 날씨는 Il fait chaud로 표현해요. |
| Il fait froid. | Il fait chaud의 chaud를 froid로 바꾸면 추운 날씨를 말할 수 있어요. |
| Il pleut. | 비가 오다는 pleuvoir를 써서 Il pleut라고 해요. fait를 끼워 넣지 않아요. |
| J’ai froid. | 내가 추위를 느낄 때는 avoir froid를 써요. 날씨를 말하는 Il fait froid와 구분해요. |
| J’ai chaud. | 내가 더위를 느낄 때는 J’ai chaud예요. 상태를 직역해서 Je suis chaud라고 하지 않아요. |

### 몇 시에 만날까요

| 표현 | 개별 해설 |
| --- | --- |
| Quelle heure est-il ? | heure는 여성 명사라 quelle을 써요. est-il처럼 동사와 주어 사이에 하이픈이 있어요. |
| Il est une heure. | 한 시는 une heure예요. heure가 여성 명사이므로 un이 아니라 une를 써요. |
| Il est deux heures. | 두 시부터는 heures에 s를 붙여요. 숫자가 여러 개여도 문장의 시작은 Il est예요. |
| À quelle heure ? | 행사나 약속이 몇 시에 있는지 물을 때는 앞에 À를 붙여요. |
| À trois heures. | 시간을 약속할 때 à trois heures라고 해요. 지금 세 시라는 뜻은 Il est trois heures예요. |
| À bientôt ! | 정확한 날짜를 정하지 않고 다시 만나기를 바라며 하는 인사예요. bientôt의 ô를 확인해요. |

### 편안하게 체크인

| 표현 | 개별 해설 |
| --- | --- |
| J’ai une réservation. | 직역하면 “예약 하나가 있어요”예요. réservation은 여성 명사라 une를 써요. |
| À quel nom ? | 직원이 예약자의 이름을 확인할 때 하는 짧은 질문이에요. nom은 남성 명사라 quel을 써요. |
| Au nom de Kim. | au nom de 뒤에 예약한 이름을 넣어요. au는 à와 le가 합쳐진 형태예요. |
| Où est ma chambre ? | chambre는 여성 명사라 “나의”를 ma로 써요. 주인의 성별이 아니라 명사에 맞춰요. |
| Le petit déjeuner est inclus ? | 평서문 어순에 물음표를 붙인 질문이에요. petit déjeuner는 아침 식사예요. |
| Je voudrais une serviette. | serviette는 여성 명사라 une를 써요. Je voudrais 뒤에 필요한 물건을 붙여 부탁해요. |
