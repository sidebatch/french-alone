// Four consistent Lou poses from the app's locally cached mascot sheet.
export function mascot(mood='idle') {
  const pose={idle:'wave',wave:'wave',correct:'happy',revealed:'think',wrong:'think',complete:'celebrate'}[mood]||'wave';
  return '<span class="mascot mascot-'+mood+' lou-'+pose+'" aria-hidden="true"></span>';
}
export function companionMessage(mood='idle') {
  const messages={idle:'준비됐나요? 같이 한 문장씩!',correct:'정답이에요. 정말 잘했어요!',wrong:'조금만 더! 같이 다시 해봐요.',revealed:'좋아요, 이 문장부터 기억해요.',complete:'오늘의 한 걸음, 해냈어요!'};
  return '<div class="companion-message companion-'+mood+'">'+mascot(mood)+'<p><span>LOU · 나의 프랑스어 친구</span><b>'+(messages[mood]||messages.idle)+'</b></p></div>';
}
