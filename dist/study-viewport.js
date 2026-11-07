// Keep the question inside the area above the on-screen keyboard.
export function bindStudyViewport(dialog) {
  const win = dialog.ownerDocument.defaultView;
  const viewport = win.visualViewport;
  let frame, settleTimer;

  function sync() {
    if (viewport && viewport.scale !== 1) return;
    dialog.style.setProperty('--study-height', `${Math.round(viewport?.height || win.innerHeight)}px`);
    dialog.style.setProperty('--study-top', `${Math.round(viewport?.offsetTop || 0)}px`);
    if (!dialog.open || win.innerWidth > 760 || !dialog.classList.contains('typing-focused')) return;
    const body = dialog.querySelector('.practice-body');
    const question = dialog.querySelector('.practice-question');
    const input = dialog.querySelector('#practice-input');
    if (!body || !question || input !== dialog.ownerDocument.activeElement) return;
    const area = body.getBoundingClientRect(), block = question.getBoundingClientRect();
    const padding = 12;
    if (block.top < area.top + padding || block.bottom > area.bottom - padding) {
      // Include the prompt when it fits; on very short screens keep the input reachable.
      const target = block.height <= area.height - padding * 2 ? block.top : input.getBoundingClientRect().bottom - area.height + padding * 2;
      body.scrollTop += target - area.top - padding;
    }
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
