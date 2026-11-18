export function fitPracticeInput(input) {
  if(input?.tagName!=='TEXTAREA')return;
  input.style.height='auto';
  input.style.height=`${input.scrollHeight+input.offsetHeight-input.clientHeight}px`;
}

// Keep the submitted answer and its correction together inside the scrolling body.
export function showPracticeAnswer(body) {
  const question=body?.querySelector('.practice-question');
  if(!question)return;
  const prompt=body.querySelector('.practice-prompt')||question;
  const feedback=body.querySelector('#practice-feedback:not([hidden])');
  const answer=body.querySelector('#practice-input,.choice.incorrect,.choice.correct,.tile-answer')||body.querySelector('#practice-answer');
  if(!answer)return;
  const frame=body.getBoundingClientRect(),padding=12;
  const available=frame.height-2*padding;
  if(available<=0)return;
  const promptTop=prompt.getBoundingClientRect().top,field=answer.getBoundingClientRect();
  const last=(feedback||answer).getBoundingClientRect().bottom;
  const first=last-promptTop<=available?promptTop:field.top;
  const bottom=Math.min(last,first+available);
  if(first<frame.top+padding)body.scrollTop+=first-frame.top-padding;
  else if(bottom>frame.bottom-padding)body.scrollTop+=bottom-frame.bottom+padding;
}

export function bindStudyViewport(dialog) {
  const win = dialog.ownerDocument.defaultView;
  const viewport = win.visualViewport;
  let frame, settleTimer;

  function sync() {
    if (viewport && viewport.scale !== 1) return;
    const height=Math.round(viewport?.height || win.innerHeight);
    dialog.style.setProperty('--study-height', `${height}px`);
    dialog.style.setProperty('--study-top', `${Math.round(viewport?.offsetTop || 0)}px`);
    dialog.classList.toggle('compact-study',height<=520);
    dialog.classList.toggle('visual-keyboard',height<win.innerHeight-48);
    const input = dialog.querySelector('#practice-input');
    fitPracticeInput(input);
    if (!dialog.open || !dialog.classList.contains('typing-focused')) return;
    const body = dialog.querySelector('.practice-body');
    if (input && input === dialog.ownerDocument.activeElement)showPracticeAnswer(body);
  }
  function schedule() {
    win.cancelAnimationFrame(frame);
    frame = win.requestAnimationFrame(sync);
  }
  dialog.addEventListener('focusin', event => {
    const typing = event.target.id === 'practice-input';
    dialog.classList.toggle('typing-focused', typing);
    win.clearTimeout(settleTimer);
    schedule();
    // Mobile browsers can finish their automatic input scroll after focusin.
    if (typing) settleTimer = win.setTimeout(schedule, 300);
  });
  dialog.addEventListener('focusout', event => {
    if (event.target.id === 'practice-input') {
      dialog.classList.remove('typing-focused');
      win.clearTimeout(settleTimer);
    }
  });
  dialog.addEventListener('close', () => {
    dialog.classList.remove('typing-focused');
    win.clearTimeout(settleTimer);
    win.cancelAnimationFrame(frame);
  });
  viewport?.addEventListener('resize', schedule);
  viewport?.addEventListener('scroll', schedule);
  win.addEventListener('resize', schedule);
  sync();
}
