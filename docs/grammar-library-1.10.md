# v1.10.0 문법 참고 도서관

기존 67개에 독립 문법 59개를 더해 126개로 확장했습니다. 문장의 기본 34, 동사와 표현 25, 시제와 가정 25, 대명사와 연결 42개입니다. 전체 535개 설명·표 섹션, 158개 표, 580개 프랑스어–한국어 예문 쌍을 포함합니다. 표 안의 추가 예시는 예문 쌍 수에서 제외합니다.

## 범위와 검증의 의미

아래 세 자료의 공개 목차를 직접 확인해 97개 문법 단원을 앱 항목과 대조했습니다. 단원별 대응은 [grammar-coverage.mjs](grammar-coverage.mjs)에 있습니다. 출판사 목차의 주요 주제 범위를 다룬다는 뜻이며, 공개되지 않은 본문의 모든 예외·논쟁·연습문제까지 동일한 깊이로 검증했다는 뜻은 아닙니다. 한국어 설명, 구성, 예문은 앱용으로 새로 작성했습니다. 책 본문이나 문제를 복제하지 않았습니다.

| 대조 자료 | 확인 범위 |
| --- | --- |
| [Bescherelle — La grammaire pour tous, 2024](https://www.bescherelle.com/livre/bescherelle-la-grammaire-pour-tous-nouvelle-edition-9782401104778/) | 출판사가 연결한 [공개 미리보기](https://www.liseuse-hachette.fr/?ean=9782401110380)의 본문 소단원 39개. 단어·문장 성분·동사 체계·복문·텍스트와 담화 포함 |
| [Grammaire progressive du français — intermédiaire](https://livre-web.cle-international.com/applis/9782090381030/audioexers/start.html) | 출판사 공개 학습 메뉴 1–36단원. 점수 화면 제외 |
| [FLE — Objectif B2. Grammaire en contexte](https://www.editions-ellipses.fr/fr/accueil/13825-fle-francais-langue-etrangere-objectif-b2-grammaire-en-contexte-pour-enrichir-et-consolider-ses-connaissances-titre-provisoire-9782340058255.html) | [출판사 공개 목차](https://www.editions-ellipses.fr/fr/index.php?controller=attachment&id_attachment=46618)의 문법 22단원 |

이 대조표는 누락 방지용 편집 기록입니다. 자동 검사는 연결 대상·설명·예문의 존재와 회귀를 확인합니다. 자동 통과만으로 언어학적 완전성이나 특정 CEFR 등급 인증을 보증하지 않습니다.

## 추가된 내용

- 기초: 문장 성분, 주어 대명사와 on, 명사 수식, 합성명사, 불규칙 형용사, 색깔, 관사 생략, 기수·서수·분수, 날짜·시각, 부정 표현, tout, 공간 전치사, 모음 생략·연음, 동음이의어, 구두점, 명사화.
- 동사: 자동사·타동사, à·de·원형 결합, 형용사와 전치사, faire·laisser 사역, 지각동사, 의무·추측, 비인칭, c’est·il est·il y a, 주어 일치, 과거분사 일치, 철자 변화, 유사 동사 구별.
- 시제: 전체 지도, 원형 과거, 명령법 과거, 복합분사·과거 제롱디프, 동작의 단계, 단순과거 전체 인칭 표, 전과거, 접속법 반과거·대과거, 이중복합시제.
- 문장 연결: ce qui·ce que·ce dont·ce à quoi, 수량·비례 비교, 고급 부정·허사 ne, 도치, 감탄·강조, 보충절, 간접의문, 원인·결과·목적·대조·양보·조건·시간절, 접속법 선택, 분사절, 등위·병렬, 관계절 의미, 글의 연결, 발화 상황, 자유간접화법.

모든 새 항목에 프랑스어 정식 제목과 검색 별칭이 있습니다. 기존 114개 미니 레슨과 210문제 연결은 유지합니다. 표기는 기본적인 현대 프랑스어를 중심으로 하고 문학적·지역적·1990년 개정 표기 등은 해당 문단에서 구분합니다.

## 예외 검토

오류가 나기 쉬운 아래 사항은 공식 언어 자료와 별도로 대조했습니다. 나머지 기반 자료는 [v1.9 기록](grammar-library-1.9.md)을 함께 참고합니다.

- [OQLF 문법 분류](https://vitrinelinguistique.oqlf.gouv.qc.ca/banque-de-depannage-linguistique/la-grammaire): 품사·문장 기능·일치의 보완 기준.
- [laissé + 원형](https://vitrinelinguistique.oqlf.gouv.qc.ca/21711/la-grammaire/le-verbe/accord-du-participe-passe/cas-particuliers-daccord-du-participe-passe/accord-du-participe-passe-laisse-suivi-dun-infinitif): 전통 일치와 개정 표기의 불변을 구분. fait + 원형은 불변.
- [부사 tout](https://vitrinelinguistique.oqlf.gouv.qc.ca/22907/la-grammaire/ladverbe/tout-employe-comme-adverbe): 여성 형용사의 첫소리에 따른 예외 일치.
- [허사 ne](https://vitrinelinguistique.oqlf.gouv.qc.ca/22467/la-syntaxe/la-negation-et-la-restriction/constructions-avec-un-ne-expletif): 실제 부정과 구별하고 sans que에는 넣지 않는 기본 규범.
- [종속접속어 뒤의 법](https://vitrinelinguistique.oqlf.gouv.qc.ca/24238/la-grammaire/le-verbe/modes/subjonctif/subjonctif-ou-indicatif-apres-les-subordonnants-composes): après que의 직설법, 목적과 결과에서 de sorte que의 차이.
- [접속법 형태](https://vitrinelinguistique.oqlf.gouv.qc.ca/24237/la-grammaire/le-verbe/conjugaison/formes-du-subjonctif), [과거 주절의 접속법 시제 관계](https://vitrinelinguistique.oqlf.gouv.qc.ca/21175/la-grammaire/le-verbe/modes/concordance-des-temps/principes-de-la-correspondance-des-temps): 문학형과 현대 사용 구별.
- [분사·제롱디프의 생략된 주어](https://vitrinelinguistique.oqlf.gouv.qc.ca/24712/la-syntaxe/constructions-syntaxiques-boiteuses/logique-syntaxique-sujet-sous-entendu-du-participe-present): 잘못 연결된 주어를 피하는 설명.
- [Université de Sherbrooke, Usito의 동사 활용 체계](https://sanction.usito.usherbrooke.ca/articles/th%C3%A9matiques/contant_1): 복합분사와 과거 제롱디프의 형태 구별.

편집 검토에서 특히 다음을 확인했습니다: 수의 cent·vingt·mille와 million, moi qui ai, on과 vous의 실제 지시 대상 일치, se laver les mains와 se parler, vu + 원형의 행동 주체, fait의 불변, ce dont의 de 중복, 간접의문 si의 미래 허용, au cas où의 조건법, après que의 직설법, fut/fût·eut/eût, 제롱디프 주어, tout heureuse/toute petite.

## 이후 문제 제작 시 연결

새 문제에는 `grammarId: 'causative'` 또는 `grammarIds: ['causative', 'participle-agreement']`로 직접 연결할 수 있습니다. 여러 개이면 각 문법의 짧은 한국어 제목이 버튼으로 표시됩니다. 단일 항목 버튼은 기존처럼 “문법 보기”입니다. 기존 문제 ID 기반 연결도 지원하며 명시한 ID의 중복은 제거합니다. 잘못된 ID만 있다면 기존 연결로 복귀합니다.

짧은 문제 해설과 미니 레슨은 문제의 학습 목표에 맞게 계속 작성해야 합니다. 장문의 도서관 내용을 자동으로 문제 화면에 붙이지 않습니다. 신규 ID·내용 추가 시에는 문법 구조 검사와 실제 문제 연결 검사를 함께 실행합니다.

문법 ID와 `bonjour-grammar-v1` 저장 형식을 유지하여 기존 조회수를 보존합니다. 한 문제에서 여러 문법을 열면 각 문법에 별도로 기록하고, 같은 풀이에서 같은 문법을 반복해서 열면 중복 집계하지 않습니다. 문제 DOM·입력·타일·점수는 문법 창을 닫아도 그대로 유지합니다.

## 검증

- 구문 검사 및 자동 검사 99개 통과: 전체 문법 구조, 97개 대조표 연결, 주요 불규칙형, 한국어·프랑스어 검색, 신규 복수 연결, 조회수 보존, 기존 학습·설치 회귀 포함.
- Chrome 320px에서 문법 126개, 210문제의 해설·미니 레슨·문법 연결, 기초 표현 72개 전수 확인. 본문 가로 넘침과 상단 제목 잘림 없음.
- Chrome 320·390·768·1440px에서 126개 카드씩, 총 504개 레이아웃 확인. 모든 표의 가로 넘침, 카드 높이, 위·아래 스크롤, 닫기 버튼 접근을 검사했습니다.
- 실제 브라우저에서 210개 문제의 문법 연결, 틀린 입력·스크롤 복원, 조회 중복 방지, 키보드 접근, 오프라인 재접속을 확인했습니다. 최종 문구·용어 수정 후 320px 전수 검사를 재실행했습니다.

추가 콘텐츠는 정적 파일에 저장되어 오프라인에서도 열립니다. 조회·검색·문제 연결에 AI 호출이나 토큰 사용을 추가하지 않았습니다.
