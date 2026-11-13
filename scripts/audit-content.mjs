import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {practicePacks,practiceQuestions} from '../dist/practice-data.js';
import {lessons,phrases} from '../dist/data.js';
import {miniLessons,questionLessonIds,lessonForQuestion} from '../dist/practice-lessons.js';

// A reviewable inventory, not an automatic claim of linguistic correctness.
assert.deepEqual(Object.keys(questionLessonIds).sort(),practiceQuestions.map(q=>q.id).sort());
const cell=value=>String(value).replaceAll('|','\\|').replaceAll('\n',' ');
const rows=[
  '# v1.7.0 설명 전수 점검표',
  '',
  '문장 연습 210문제와 기초 표현 72개를 대상으로 문제·답·해설의 주제 일치를 검토했습니다. 이 표는 현재 코드의 연결을 재현하기 위한 목록입니다. 자동 검사는 누락·연결·렌더링·회귀를 확인하며, 언어 감수를 대체하지 않습니다.',
  '',
  '## 바꾼 내용',
  '',
  '- 모든 문장 문제에서 코스 공통 설명을 제거하고, 문제 ID별로 짧은 레슨을 지정했습니다. 같은 학습 목표의 문제만 레슨을 공유합니다.',
  '- 114개 레슨에 핵심 설명, 형태·비교표, 번역이 있는 예문, 흔한 혼동을 넣었습니다.',
  '- voir → vu에는 불규칙 과거분사, ne … pas에는 조동사 위치, arrivée에는 성·수 일치를 설명합니다.',
  '- 단어 문제에는 해당 단어·활용형을, 대명사·관계절·비교·접속법에는 해당 문장의 역할과 형태를 설명합니다.',
  '- 기초 표현의 공통 팁을 개별 표현 해설에서 제외했습니다. 숫자·커피 설명을 보강하고, 일부 문장 해설에서 입력 도구·채점 안내를 학습 내용으로 바꿨습니다.',
  '- 문제 ID, 정답, 허용 답, 학습 점수·기존 기록은 유지했습니다. 레슨은 요청할 때 펼치며 열람 자체에 XP를 주지 않습니다.',
  '',
  '## QA 기록',
  '',
  '- Node: 전 문제 연결과 레슨 구성, 대표 불규칙 활용표, 210문제 전체의 정답 후 펼치기, 기본 접힘, 점수·이어하기·복습·오프라인 회귀를 검사합니다.',
  '- Chrome: 210문제를 실제로 완료하며 각 설명을 펼쳤습니다. 320px·390px에서 표와 설명의 가로 넘침을 검사했습니다. 기초 표현 72개의 개별 해설도 열어 확인했습니다.',
  '- 오답 상태에서도 올바른 레슨을 표시하는지, 설명 열람이 점수를 바꾸지 않는지, 오프라인에서 새 레슨 모듈과 불규칙 표를 여는지 확인했습니다.',
  '- 실제 iOS/Android 기기를 직접 조작한 결과나 전문 원어민 감수로 표시하지 않습니다.',
  '',
  '## 형태·용법 확인 자료',
  '',
  '- [Académie française · voir 활용](https://www.dictionnaire-academie.fr/conjuguer/A9V1094)',
  '- [Larousse · faire 활용](https://www.larousse.fr/conjugaison/francais/faire/4599)',
  '- [Larousse · venir 활용](https://www.larousse.fr/conjugaison/francais/venir/9299)',
  '- [Larousse · avoir 활용](https://www.larousse.com/conjugaison/francais/avoir/749)',
  '- [Larousse · aller 활용](https://www.larousse.fr/conjugaison/francais/aller/314)',
  '- [OQLF · 복합과거](https://vitrinelinguistique.oqlf.gouv.qc.ca/24218/la-grammaire/le-verbe/temps-grammaticaux/passe/generalites-sur-le-passe-compose)',
  '- [OQLF · être와 과거분사 일치](https://vitrinelinguistique.oqlf.gouv.qc.ca/24222/la-grammaire/le-verbe/accord-du-participe-passe/avec-lauxiliaire-etre/synthese-des-regles-daccord-du-participe-passe-employe-avec-etre)',
  '- [OQLF · 가정문과 조건법](https://vitrinelinguistique.oqlf.gouv.qc.ca/24140/la-grammaire/le-verbe/temps-grammaticaux/conditionnel/conditionnel-dans-les-phrases-hypothetiques)',
  '',
  '## 문장 연습: 문제별 설명 연결',
  ''
];
for(const pack of practicePacks){
  rows.push('### '+pack.title+' · '+pack.id,'','| 문제 | 질문 | 목표 정답 | 펼쳤을 때의 레슨 |','| --- | --- | --- | --- |');
  for(const q of pack.questions){
    const item=lessonForQuestion(q.id);assert.ok(item,q.id);
    rows.push('| '+[q.id,q.ko,q.answer,item.title].map(cell).join(' | ')+' |');
  }
  rows.push('');
}
rows.push('## 기초 표현: 개별 해설','','코스 공통 팁은 이 해설에 덧붙이지 않습니다.','');
for(const group of lessons){
  rows.push('### '+group.title,'','| 표현 | 개별 해설 |','| --- | --- |');
  for(const p of phrases.filter(p=>p.lessonId===group.id))rows.push('| '+[p.fr,p.note].map(cell).join(' | ')+' |');
  rows.push('');
}
await writeFile(new URL('../docs/content-audit-1.7.md',import.meta.url),rows.join('\n'));
console.log(JSON.stringify({questions:practiceQuestions.length,miniLessons:Object.keys(miniLessons).length,basicExpressions:phrases.length,report:'docs/content-audit-1.7.md'}));
