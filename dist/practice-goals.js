// Each group shares a learning objective, including when a card returns as a writing exercise.
const goals = new Map();
function setGoal(pack, numbers, text) {
  for (const number of numbers) goals.set(pack + '-' + number, text);
}

setGoal('want', [1,2,4,9,10], 'vouloir로 내가 하고 싶은 일을 말해 봐요.');
setGoal('want', [3], '하고 싶은 행동을 동사원형으로 써 봐요.');
setGoal('want', [5,6,7,8], '하고 싶지 않은 일은 부정 표현의 두 부분을 모두 써 봐요.');
setGoal('can', [1,2,4,9,10], 'pouvoir로 내가 할 수 있는 일을 말해 봐요.');
setGoal('can', [3], '할 수 있는 행동을 동사원형으로 써 봐요.');
setGoal('can', [5,6,7,8], '할 수 없는 일은 부정 표현의 두 부분을 모두 써 봐요.');
setGoal('like', [1,2,3,9,10], 'aimer 뒤에 좋아하는 활동을 동사원형으로 붙여 봐요.');
setGoal('like', [4], '걷기를 얼마나 좋아하는지 aimer 뒤에 덧붙여 봐요.');
setGoal('like', [5,6,7,8], '좋아하지 않는 활동을 부정문으로 말해 봐요.');
setGoal('be', [1,2,4,9], 'être로 내가 어디에 있는지 말해 봐요.');
setGoal('be', [3], '가까운 장소를 가리키는 말 한 단어를 떠올려 봐요.');
setGoal('be', [5,6,7], '그곳에 없다는 뜻이 되도록 être를 부정해 봐요.');
setGoal('be', [8,10], 'être 뒤의 형용사는 말하는 사람의 성에 맞춰 봐요.');
setGoal('have', [1,2,4,9], 'avoir로 무엇을 하나 가지고 있는지 말해 봐요.');
setGoal('have', [3], '물건 이름만 한 단어로 써 봐요.');
setGoal('have', [5,6,7], '가진 것이 하나도 없을 때 명사 앞에 오는 말을 떠올려 봐요.');
setGoal('have', [8,10], 'avoir를 써서 지금 몸이 어떤 상태인지 말해 봐요.');
setGoal('go', [1,2,4,5,6,7,9,10], 'aller로 목적지를 말해 봐요. 장소 앞의 전치사도 함께 떠올려요.');
setGoal('go', [3], '장소 이름만 한 단어로 써 봐요.');
setGoal('go', [8], '가지 않는다는 뜻이 되도록 aller를 부정해 봐요.');
setGoal('order-food', [1,2], 'vouloir를 부드러운 부탁에 쓰는 형태로 바꿔 봐요.');
setGoal('order-food', [3], '음료 이름만 한 단어로 써 봐요.');
setGoal('order-food', [4,7,9,10], '카페에서 Je voudrais로 주문해 봐요.');
setGoal('order-food', [5,8], '하나를 주문할 때 메뉴 이름에 맞는 관사를 골라 봐요.');
setGoal('order-food', [6], '주문하고 싶은 음료의 이름을 떠올려 봐요.');
setGoal('need', [1,2], 'avoir와 함께 쓰는 ‘필요’라는 말을 떠올려 봐요.');
setGoal('need', [4,9], 'avoir besoin de로 지금 필요한 것을 말해 봐요.');
setGoal('need', [3], '필요한 것을 명사 한 단어로 써 봐요.');
setGoal('need', [5,6,7], '필요하지 않다는 뜻이 되도록 부정문을 완성해 봐요.');
setGoal('need', [8,10], 'avoir besoin de 뒤에 지금 해야 할 행동을 붙여 봐요.');
setGoal('where', [1,2,4,5,7,9,10], 'où와 être로 위치를 물어봐요. 장소 이름의 단수·복수에 맞춰요.');
setGoal('where', [3], '찾고 있는 장소의 이름만 한 단어로 써 봐요.');
setGoal('where', [6], '복수인 장소 이름에 맞는 관사를 써 봐요.');
setGoal('where', [8], '찾는 장소의 이름을 써 봐요. 악센트도 떠올려요.');

setGoal('past-events', [1,4,7,8,10], 'avoir와 과거분사로 끝난 일을 말해 봐요.');
setGoal('past-events', [2,9], 'regarder의 복합과거로 어제 본 일을 말해 봐요.');
setGoal('past-events', [3], '복합과거에 쓰는 과거분사 한 단어를 떠올려 봐요.');
setGoal('past-events', [5,6], '하지 않은 일을 복합과거의 부정문으로 말해 봐요.');
setGoal('past-movement', [1,2,3,4,5,6,8,9,10], 'être와 쓰는 과거분사를 주어의 성과 수에 맞춰 봐요.');
setGoal('past-movement', [7], 'être로 만든 복합과거 문장에서 이동을 부정해 봐요.');
setGoal('past-background', [1,2,3,7,8,9], '그때의 상태나 반복하던 일을 반과거로 말해 봐요.');
setGoal('past-background', [4], 'lire를 반과거로 써 봐요. 시간은 문장 앞이나 뒤에 놓아도 돼요.');
setGoal('past-background', [5,6,10], '하던 일은 반과거로, 그때 일어난 사건은 복합과거로 말해 봐요.');
setGoal('future-plans', [1,2,3,4,5,6,8,9,10], '주어에 맞는 단순미래형을 써 봐요.');
setGoal('future-plans', [7], '내일 하지 않을 일을 단순미래의 부정문으로 말해 봐요.');
setGoal('real-conditions', [1,2,4,5,6,7,8,9,10], '가능한 조건은 si와 현재형으로, 그 결과는 단순미래로 말해 봐요.');
setGoal('real-conditions', [3], '미래의 결과를 말할 때 쓰는 nous 동사형을 떠올려 봐요.');
setGoal('imagined-conditions', [1,2,4,5,6,7,8,9,10], '상상하는 조건은 si와 반과거로, 그 결과는 조건법으로 말해 봐요.');
setGoal('imagined-conditions', [3], '상상 속에서 내가 어떨지 말할 때 쓰는 조건법을 떠올려 봐요.');
setGoal('object-pronouns', [1,2,3,4,7,8], '이미 나온 대상을 성과 수에 맞는 목적어 대명사로 받아 봐요.');
setGoal('object-pronouns', [5,6,9,10], '책이나 편지를 대신하는 대명사를 동사원형 바로 앞에 놓아 봐요.');
setGoal('place-quantity', [1,2,4,9,10], '이미 나온 장소를 대명사로 받아 봐요.');
setGoal('place-quantity', [3,5,6,7,8], '무엇을 세거나 마시는지 대명사로 받아 봐요. 수량이 있으면 남겨요.');
setGoal('relative-links', [1,6,8,10], '앞의 명사가 뒤에서 행동의 주체가 되도록 두 내용을 이어 봐요.');
setGoal('relative-links', [2,3,4,5,7,9], '앞의 명사가 뒤에서 행동의 대상이 되도록 두 내용을 이어 봐요.');
setGoal('comparisons', [1,2,4,9,10], '두 대상의 차이나 같은 정도를 형용사와 que로 표현해 봐요.');
setGoal('comparisons', [3,6,8], 'bon의 비교급을 명사의 성과 수에 맞춰 봐요.');
setGoal('comparisons', [5,7], '어떤 행동을 더 잘한다는 뜻의 비교급을 써 봐요.');
setGoal('opinion-links', [1,2], '두 내용을 이어서 왜 그런지 이유를 밝혀 봐요.');
setGoal('opinion-links', [3,4], '앞의 일에서 어떤 결과가 나오는지 연결어로 이어 봐요.');
setGoal('opinion-links', [5,7], '예상과 다른 결과를 나타내는 연결어를 써 봐요.');
setGoal('opinion-links', [6,8], '내 의견을 말한 뒤에 그 내용을 절로 이어 봐요.');
setGoal('opinion-links', [9,10], 'parce que로 이유를 밝혀 봐요. 이유를 먼저 말해도 돼요.');
setGoal('necessity', [1,2,4,7,8,9], 'Il faut que 뒤에 접속법을 써서 필요한 일을 말해 봐요.');
setGoal('necessity', [3], '다른 사람에게 바라는 행동을 말할 때 쓰는 접속법을 떠올려 봐요.');
setGoal('necessity', [5,6,10], 'Je veux que 뒤에 접속법을 써서 상대에게 바라는 것을 말해 봐요.');

export const goalForQuestion = id => goals.get(id);

// Only authored answers with the right meaning receive this feedback.
const alternatives = new Map();
function addAlternatives(ids, forms, feedback) {
  for (const id of ids) alternatives.set(id, {forms, feedback});
}
for (const [ids, item] of [
  [[1,8], 'un café'], [[2,6,9], 'un thé'], [[4], 'un croissant'],
  [[5,7], 'une salade'], [[10], 'un sandwich']
]) {
  const forms = [item + ', s’il vous plaît.', item + ', s’il vous plait.'];
  for (const start of ['J’aimerais ', 'Je prendrai ', 'Je vais prendre ']) {
    for (const ending of ['.', ', s’il vous plaît.', ', s’il vous plait.']) forms.push(start + item + ending);
  }
  for (const n of ids) {
    const retry = n === 6 ? '이번에는 빈칸에 음료 이름을 넣어 볼까요?'
      : [5,8].includes(n) ? '이번에는 메뉴 앞의 빈칸에 관사를 넣어 볼까요?'
      : '이번에는 Je voudrais로 주문해 볼까요?';
    addAlternatives(['order-food-' + n], forms, '카페에서 이렇게 주문해도 자연스러워요. ' + retry);
  }
}
addAlternatives(['past-events-2','past-events-9'], ['Hier, j’ai vu un film.', 'J’ai vu un film hier.'],
  'voir로도 영화를 봤다고 말할 수 있어요. 이번에는 regarder의 복합과거를 써 볼까요?');
addAlternatives(['past-background-4'], ['Hier, à huit heures, j’étais en train de lire un livre.',
  'J’étais en train de lire un livre hier à huit heures.', 'J’étais en train de lire un livre à huit heures hier.',
  'Hier, j’étais en train de lire un livre à huit heures.'],
  'être en train de로 읽는 중이었다는 뜻을 잘 살렸어요. 이번에는 lire 자체를 반과거로 바꿔 볼까요?');
addAlternatives(['future-plans-5','future-plans-9'], ['Je vais aller à Paris demain.', 'Demain, je vais aller à Paris.'],
  '근접미래로 내일의 계획을 잘 말했어요. 이번에는 aller를 단순미래로 바꿔 볼까요?');
addAlternatives(['future-plans-10'], ['Nous allons faire ce travail demain.', 'Demain, nous allons faire ce travail.'],
  '근접미래로 계획을 잘 말했어요. 이번에는 faire의 단순미래를 써 볼까요?');
addAlternatives(['object-pronouns-9'], ['Je veux lire ce livre.'],
  '무엇을 읽고 싶은지 잘 말했어요. 이번에는 ce livre를 대명사로 바꿔 볼까요?');
addAlternatives(['object-pronouns-10'], ['Je peux comprendre cette lettre.', 'Je peux comprendre la lettre.'],
  '편지를 이해할 수 있다는 뜻이 잘 전달돼요. 이번에는 편지를 대명사로 받아 볼까요?');
addAlternatives(['place-quantity-4','place-quantity-9'], ['Je veux aller là-bas.'],
  'là-bas로 가고 싶은 곳을 가리켰어요. 이번에는 이미 나온 장소를 y로 받아 볼까요?');
addAlternatives(['place-quantity-10'], ['Elle travaille là-bas.'],
  'là-bas로 일하는 곳을 가리켰어요. 이번에는 그 장소를 y로 받아 볼까요?');
addAlternatives(['need-8'], ['Je dois dormir.', 'Il faut que je dorme.'],
  '자야 한다는 뜻이 잘 전달돼요. 이번에는 avoir besoin de로 잠이 필요하다고 말해 볼까요?');
addAlternatives(['need-10'], ['Je dois manger.', 'Je dois manger quelque chose.', 'Il faut que je mange quelque chose.'],
  '먹어야 한다는 뜻이 잘 전달돼요. 이번에는 avoir besoin de로 표현해 볼까요?');
addAlternatives(['necessity-2','necessity-9'], ['Tu dois être ici.'],
  'devoir로 필요한 일을 잘 말했어요. 이번에는 Il faut que 뒤에 접속법을 써 볼까요?');
addAlternatives(['necessity-10'], ['J’espère que tu as du temps.', 'J’espère que tu auras du temps.',
  'Je souhaite que tu aies du temps.', 'J’aimerais que tu aies du temps.'],
  '상대에게 바라는 마음을 표현했어요. 이번에는 Je veux que로 그 바람을 말해 볼까요?');
addAlternatives(['opinion-links-9'], ['Comme il pleut, je reste à la maison.', 'Je reste à la maison car il pleut.'],
  '집에 있는 이유가 잘 전달돼요. 이번에는 parce que로 이유를 이어 볼까요?');
for (const [number, place] of [[4,'la gare'],[9,'le café'],[10,'le musée']]) {
  addAlternatives(['where-' + number], ['Où se trouve ' + place + ' ?', 'Où se trouve ' + place + ', s’il vous plaît ?'],
    'se trouver로 위치를 잘 물었어요. 이번에는 어디에 있는지 être로 물어볼까요?');
}

export const alternativeForQuestion = id => alternatives.get(id);
