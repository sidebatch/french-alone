import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createRecords } from '../dist/records.js';
import { learningRecords } from '../dist/records-core.js';
import { today } from '../dist/core.js';

const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(options = {}) {
  const dom = new JSDOM('<main></main><dialog id="record-dialog" aria-labelledby="record-title"></dialog>', { url: 'https://app.test/', pretendToBeVisual: true });
  const w = dom.window;
  Object.assign(globalThis, { window: w, document: w.document });
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  const revoked = []; let urls = 0;
  w.URL.createObjectURL = () => `blob:test-${++urls}`;
  w.URL.revokeObjectURL = url => revoked.push(url);
  const date = today();
  const records = options.records || learningRecords({ [date]: { xp: 25, basicQuestions: 0, basicRounds: 0 } }, { [date]: { questions: 3, rounds: 1 } });
  const ui = createRecords({ getRecords: () => records, icon: () => '<svg></svg>', escape: value => value,
    makeCard: options.makeCard || (async () => new w.Blob(['png'], { type: 'image/png' })) });
  w.document.querySelector('main').innerHTML = ui.render();
  const $ = selector => w.document.querySelector(selector);
  const click = selector => { const element = $(selector); assert.ok(element, selector); assert.equal(element.disabled, false); element.focus(); element.click(); };
  return { dom, w, ui, $, click, revoked, date };
}

test('calendar selects dates, navigates months by keyboard, and blocks future days', () => {
  const f = setup();
  assert.equal(f.$('[data-action="record-month"][data-value="1"]').disabled, true);
  assert.match(f.$('.record-detail').textContent, /3문제/);
  f.click('[data-action="record-month"][data-value="-1"]');
  assert.ok(!f.$('[data-action="record-month"][data-value="1"]').disabled);
  assert.match(f.$('.record-empty').textContent, /쉬어 간 하루/);
  const selected = f.$('[data-action="record-date"][aria-pressed="true"]');
  selected.dispatchEvent(new f.w.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  assert.equal(f.w.document.activeElement.getAttribute('aria-pressed'), 'true');
  f.click('[data-action="record-today"]');
  assert.equal(f.$('[data-action="record-date"][aria-pressed="true"]').dataset.value, f.date);
  f.dom.window.close();
});

test('card preview shares a prepared PNG on explicit click and returns focus on close', async () => {
  const f = setup(); const shares = [];
  f.w.navigator.canShare = ({ files }) => files[0].type === 'image/png';
  f.w.navigator.share = async data => { shares.push(data); };
  f.click('.records-heading [data-action="record-open"]'); await tick();
  assert.equal(f.ui.isOpen(), true);
  assert.match(f.$('.record-preview img').alt, /3문제, \+25 XP/);
  assert.equal(shares.length, 0);
  f.click('[data-action="record-share"]'); await tick();
  assert.equal(shares.length, 1); assert.equal(shares[0].files[0].name, `french-alone-${f.date}.png`);
  f.click('[data-action="record-close"]');
  assert.equal(f.ui.isOpen(), false); assert.equal(f.revoked.length, 1);
  assert.equal(f.w.document.activeElement.dataset.action, 'record-open');
  f.dom.window.close();
});

test('download fallback, failed sharing and cancellation preserve the preview', async () => {
  const f = setup();
  f.click('[data-action="record-open"]'); await tick();
  assert.equal(f.$('[data-action="record-share"]').hidden, true);
  assert.equal(f.$('[data-action="record-download"]').disabled, false);
  f.click('[data-action="record-close"]');
  f.w.navigator.canShare = () => true;
  f.w.navigator.share = async () => { throw new DOMException('Cancelled', 'AbortError'); };
  f.click('[data-action="record-open"]'); await tick();
  const original = f.$('.record-export-status').textContent;
  f.click('[data-action="record-share"]'); await tick();
  assert.equal(f.$('.record-export-status').textContent, original);
  f.w.navigator.share = async () => { throw Error('unavailable'); };
  f.click('[data-action="record-share"]'); await tick();
  assert.match(f.$('.record-export-status').textContent, /이미지 저장/);
  assert.ok(f.$('.record-preview img')); f.ui.close(); f.dom.window.close();
});

test('empty days cannot create certificates and closing cancels pending preview work', async () => {
  const empty = setup({ records: {} });
  assert.equal(empty.$('[data-action="record-open"]').disabled, true);
  assert.match(empty.$('.record-empty').textContent, /첫 발자국/); empty.dom.window.close();
  let resolve;
  const f = setup({ makeCard: () => new Promise(done => { resolve = done; }) });
  f.click('[data-action="record-open"]');
  f.click('[data-action="record-close"]');
  resolve(new f.w.Blob(['png'], { type: 'image/png' })); await tick();
  assert.equal(f.$('.record-preview img'), null); assert.equal(f.ui.isOpen(), false);
  f.dom.window.close();
});

test('export errors can be retried and reset returns the calendar to today', async () => {
  let tries = 0;
  const f = setup({ makeCard: async () => { if (!tries++) throw Error('image unavailable'); return new window.Blob(['png'], { type: 'image/png' }); } });
  f.click('[data-action="record-open"]'); await tick();
  assert.match(f.$('.record-preview').textContent, /만들지 못했어요/);
  f.click('.record-preview [data-action="record-open"]'); await tick();
  assert.ok(f.$('.record-preview img'));
  f.ui.reset(); assert.equal(f.ui.isOpen(), false);
  f.dom.window.close();
});
