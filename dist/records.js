import { today } from './core.js';
import { isRecordDate, monthDates, shiftMonth, monthSummary, recordSummary } from './records-core.js';
import { makeRecordCard } from './record-card.js';

const dateLabel = date => new Date(`${date}T12:00:00`).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
export function createRecords({ getRecords, getRoom = () => null, icon, escape, makeCard = makeRecordCard }) {
  let selected = today(), month = selected.slice(0, 7), generation = 0;
  let cardURL = null, file = null, focusBefore = null;
  const dialog = document.querySelector('#record-dialog');
  const currentMonth = () => today().slice(0, 7);
  const amount = number => number.toLocaleString('ko-KR');

  function render() {
    const records = getRecords(), summary = monthSummary(records, month);
    const record = recordSummary(records, selected), now = today();
    const [year, number] = month.split('-').map(Number);
    const title = `${year}년 ${number}월`;
    return `<section id="learning-records" class="learning-records" aria-labelledby="records-heading">
      <div class="records-heading"><div><p class="section-kicker">하루하루, 쌓이는 프랑스어</p><h2 id="records-heading">나의 학습 달력</h2></div>
        <button class="secondary-button" data-action="record-open" ${records[now] ? '' : 'disabled'}>오늘 학습 인증 ${icon('sparkles')}</button></div>
      <div class="records-layout"><div class="record-calendar">
        <div class="calendar-heading"><h3 id="calendar-month" aria-live="polite">${title}</h3><div class="calendar-controls">
          <button class="text-link" data-action="record-today">오늘</button>
          <button class="icon-button calendar-prev" data-action="record-month" data-value="-1" aria-label="이전 달" ${month <= '1900-01' ? 'disabled' : ''}>${icon('chevron')}</button>
          <button class="icon-button" data-action="record-month" data-value="1" aria-label="다음 달" ${month >= currentMonth() ? 'disabled' : ''}>${icon('chevron')}</button></div></div>
        <div class="month-totals"><span><b>${summary.days}</b>일 학습</span><span><b>${summary.stamps}</b>일 목표 달성</span><span><b>${amount(summary.questions)}</b>문제 기록</span><span><b>${amount(summary.xp)}</b> XP</span></div>
        <div class="calendar-weekdays" aria-hidden="true">${['월', '화', '수', '목', '금', '토', '일'].map(day => `<span>${day}</span>`).join('')}</div>
        <div class="calendar-dates" role="group" aria-labelledby="calendar-month">${monthDates(month).map(date => {
          if (!date) return '<span class="calendar-blank" aria-hidden="true"></span>';
          const day = records[date], label = `${dateLabel(date)}, ${day ? '학습 기록 있음' + (day.stamp ? ', 하루 목표 달성' : '') : '학습 기록 없음'}`;
          return `<button type="button" class="calendar-date ${day ? 'has-record' : ''} ${day?.stamp ? 'has-stamp' : ''}" data-action="record-date" data-value="${date}" aria-label="${escape(label)}" aria-pressed="${date === selected}" ${date === now ? 'aria-current="date"' : ''} ${date > now ? 'disabled' : ''}><span>${Number(date.slice(-2))}</span><span class="calendar-mark" aria-hidden="true">${day?.stamp ? icon('check') : day ? '·' : ''}</span></button>`;
        }).join('')}</div>
        <p class="calendar-legend"><span>● 학습한 날</span><span>${icon('check')} 문장 연습 3문제 이상</span></p>
      </div><div class="record-detail" aria-live="polite" aria-atomic="true">
        <p class="record-date-label">${dateLabel(selected)}</p>
        ${record ? `<div class="record-day-badge">${icon(record.stamp ? 'check' : 'sun')}${record.stamp ? '하루 목표를 마친 날' : '프랑스어를 만난 날'}</div>
          <h3>조금씩, 내 말이 되어 가요.</h3>
          <dl class="record-day-stats"><div><dt>${record.partial ? '기록된 문제' : '완료한 문제'}</dt><dd>${record.partial && !record.questions ? '기록 있음' : amount(record.questions) + '<small>문제</small>'}</dd></div><div><dt>경험치</dt><dd>+${amount(record.xp)}<small>XP</small></dd></div></dl>
          <p class="record-breakdown">문장 연습 ${amount(record.practiceQuestions)}문제${record.basicQuestions ? ` · 기초 퀴즈 ${amount(record.basicQuestions)}문제` : ''}</p>
          <p class="record-streak">${record.streak}일 연속 학습 · 하루 목표 ${record.stamps}일 달성</p>
          ${record.partial ? '<p class="record-legacy-note">이전 기초 학습은 문제 수가 남아 있지 않아요.</p>' : ''}
          <button class="primary-button" data-action="record-open" data-value="${selected}">이날의 인증 카드 ${icon('arrow')}</button>` : `<div class="record-empty">${icon('sun')}<h3>${selected === now ? '오늘의 첫 발자국을 남겨요.' : '쉬어 간 하루예요.'}</h3><p>${selected === now ? '한 판을 마치면 여기에 기록돼요.' : '이날은 완료한 학습 기록이 없어요.'}</p>${selected === now ? '<button class="primary-button" data-action="practice-light">가볍게 3문제 ' + icon('arrow') + '</button>' : '<button class="secondary-button" data-action="record-today">오늘로 돌아가기</button>'}</div>`}
      </div></div>
    </section>`;
  }
  function refresh(focusSelector) {
    const root = document.querySelector('#learning-records');
    if (!root) return;
    root.outerHTML = render();
    if (focusSelector) (document.querySelector(`#learning-records ${focusSelector}`) || document.querySelector('#learning-records [data-action="record-today"]'))?.focus({ preventScroll: true });
  }
  function releaseCard() {
    if (cardURL) window.URL.revokeObjectURL(cardURL);
    cardURL = null; file = null;
  }
  function close() {
    generation++; releaseCard();
    if (dialog.open) { dialog.close(); if (focusBefore?.isConnected) focusBefore.focus({ preventScroll: true }); }
  }
  async function open(date = today()) {
    if (!isRecordDate(date) || date > today()) return;
    const record = recordSummary(getRecords(), date);
    if (!record) return;
    const token = ++generation;
    releaseCard();
    if (!dialog.open) { focusBefore = document.activeElement; dialog.showModal(); }
    dialog.innerHTML = `<div class="record-dialog-header"><div><p>나의 하루를 간직해요</p><h2 id="record-title">학습 인증 카드</h2></div><button class="icon-button" data-action="record-close" aria-label="인증 카드 닫기">${icon('close')}</button></div>
      <div class="record-preview" aria-busy="true"><p role="status">루가 카드를 준비하고 있어요…</p></div>
      <div class="record-export-actions"><button class="primary-button" data-action="record-download" disabled>이미지 저장</button><button class="secondary-button" data-action="record-share" hidden disabled>이미지 공유</button></div><p class="record-export-status" role="status"></p>`;
    dialog.querySelector('[data-action="record-close"]').focus();
    try {
      const blob = await makeCard({...record, room:getRoom(date)});
      if (generation !== token || !dialog.open) return;
      cardURL = window.URL.createObjectURL(blob);
      file = new window.File([blob], `french-alone-${date}.png`, { type: 'image/png' });
      const preview = dialog.querySelector('.record-preview');
      const img = document.createElement('img'); img.src = cardURL;
      img.alt = `${dateLabel(date)} 학습 인증, ${record.partial && !record.questions ? '학습 기록 있음' : record.questions + '문제'}, +${record.xp} XP, ${record.streak}일 연속, 루의 방`;
      preview.replaceChildren(img); preview.setAttribute('aria-busy', 'false');
      dialog.querySelector('[data-action="record-download"]').disabled = false;
      let canShare = false;
      try { canShare = !!window.navigator.share && !!window.navigator.canShare?.({ files: [file] }); } catch { /* Download is always available. */ }
      const share = dialog.querySelector('[data-action="record-share"]'); share.hidden = !canShare; share.disabled = !canShare;
      dialog.querySelector('.record-export-status').textContent = canShare ? '날짜와 학습 기록, 루의 방을 담았어요.' : '이미지를 저장해 간직하거나 원하는 곳에 공유하세요.';
    } catch {
      if (generation !== token || !dialog.open) return;
      const preview = dialog.querySelector('.record-preview'); preview.setAttribute('aria-busy', 'false');
      preview.innerHTML = `<p>인증 이미지를 만들지 못했어요.</p><button class="secondary-button" data-action="record-open" data-value="${date}">다시 만들기</button>`;
    }
  }
  function download() {
    if (!file) return;
    const url = window.URL.createObjectURL(file), link = document.createElement('a');
    link.href = url; link.download = file.name; document.body.append(link); link.click(); link.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    dialog.querySelector('.record-export-status').textContent = '이미지 저장을 요청했어요. 브라우저의 다운로드를 확인해 주세요.';
  }
  async function share() {
    if (!file || !window.navigator.share) return;
    const button = dialog.querySelector('[data-action="record-share"]'), token = generation;
    button.disabled = true;
    try {
      await window.navigator.share({ files: [file], title: 'French Alone · 나의 학습 기록' });
    } catch (error) {
      if (generation === token && error.name !== 'AbortError') dialog.querySelector('.record-export-status').textContent = '공유 창을 열지 못했어요. 이미지 저장으로 간직할 수 있어요.';
    } finally { if (generation === token) button.disabled = false; }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action^="record-"]');
    if (!button || button.disabled) return;
    const { action, value } = button.dataset;
    if (action === 'record-open') { void open(value || today()); return; }
    if (action === 'record-close') { close(); return; }
    if (action === 'record-download') { download(); return; }
    if (action === 'record-share') { void share(); return; }
    if (action === 'record-today') { selected = today(); month = currentMonth(); refresh(`[data-value="${selected}"]`); }
    if (action === 'record-date' && isRecordDate(value) && value <= today()) { selected = value; refresh(`[data-value="${value}"]`); }
    if (action === 'record-month' && ['-1', '1'].includes(value)) {
      const target = shiftMonth(month, Number(value));
      if (target < '1900-01' || target > currentMonth()) return;
      month = target; selected = month === currentMonth() ? today() : `${month}-01`;
      refresh(`[data-action="record-month"][data-value="${value}"]:not(:disabled)`);
    }
  });
  document.addEventListener('keydown', event => {
    const button = event.target.closest('[data-action="record-date"]');
    if (!button || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const date = new Date(`${button.dataset.value}T12:00:00`), weekday = (date.getDay() + 6) % 7;
    const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday }[event.key];
    date.setDate(date.getDate() + offset);
    const target = today(date);
    if (target > today() || target < '1900-01-01') return;
    selected = target; month = target.slice(0, 7); refresh(`[data-value="${target}"]`);
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  window.addEventListener('hashchange', close);
  return { render, close, isOpen: () => dialog.open, reset: () => { close(); selected = today(); month = currentMonth(); } };
}
