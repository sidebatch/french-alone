(() => {
  'use strict';
  const button = document.getElementById('install-app');
  const dialog = document.getElementById('install-dialog');
  const nativeButton = document.getElementById('pwa-native-install');
  const feedback = document.getElementById('pwa-install-feedback');
  const offlineStatus = document.getElementById('pwa-offline-status');
  const updateBar = document.getElementById('pwa-update');
  const updateButton = document.getElementById('pwa-update-button');
  const appURL = document.getElementById('pwa-app-url');
  if (!button || !dialog || !nativeButton || !feedback || !offlineStatus || !updateBar || !updateButton || !appURL) return;
  appURL.value = new URL('./', window.location.href).href;
  const standalone = () => Boolean(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  let promptEvent = null, registration = null, ready = false, reloadRequested = false, reloading = false;
  const renderInstalled = () => { button.hidden = standalone(); };
  const renderOffline = () => {
    offlineStatus.textContent = ready
      ? (window.navigator.onLine === false ? '오프라인' : '오프라인 준비 완료')
      : (window.navigator.onLine === false ? '인터넷에 연결해 주세요.' : '오프라인 준비 중');
  };
  button.addEventListener('click', () => {
    feedback.textContent = '';
    nativeButton.hidden = !promptEvent;
    const manual=document.getElementById('pwa-manual');if(manual)manual.open=!promptEvent&&!standalone();
    renderOffline();
    if (!dialog.open) dialog.showModal();
  });
  document.getElementById('pwa-close').addEventListener('click', () => { dialog.close(); button.focus(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); dialog.close(); button.focus(); });
  document.getElementById('pwa-copy-link').addEventListener('click', async () => {
    try {
      if (!window.navigator.clipboard || !window.navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
      await window.navigator.clipboard.writeText(appURL.value);
      feedback.textContent = '주소를 복사했어요.';
    } catch {
      appURL.focus(); appURL.select();
      feedback.textContent = '주소를 길게 눌러 복사하세요.';
    }
  });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); promptEvent = event; nativeButton.hidden = false;
  });
  nativeButton.addEventListener('click', async () => {
    const pending = promptEvent;
    if (!pending) return;
    promptEvent = null; nativeButton.disabled = true;
    try {
      await pending.prompt();
      const result = await pending.userChoice;
      feedback.textContent = result.outcome === 'accepted'
        ? '설치 요청됨'
        : '설치를 취소했어요.';
    } catch {
      feedback.textContent = '브라우저 메뉴에서 설치해 주세요.';
    } finally {
      nativeButton.disabled = false; nativeButton.hidden = !promptEvent;
    }
  });
  window.addEventListener('appinstalled', () => {
    promptEvent = null; nativeButton.hidden = true; button.hidden = true;
    feedback.textContent = '설치 완료';
  });
  window.addEventListener('online', renderOffline);
  window.addEventListener('offline', renderOffline);
  const displayMode = window.matchMedia && window.matchMedia('(display-mode: standalone)');
  if (displayMode && displayMode.addEventListener) displayMode.addEventListener('change', renderInstalled);
  renderInstalled(); renderOffline();
  window.setTimeout(() => {
    if(document.documentElement.classList.contains('app-ready'))return;
    const main=document.getElementById('main');
    if(!main)return;
    main.innerHTML='<div class="app-loading app-load-error" role="alert"><span aria-hidden="true">b.</span><h1>연결을 확인해 주세요.</h1><button id="pwa-retry" class="primary-button" type="button">다시 열기</button></div>';
    document.getElementById('pwa-retry').addEventListener('click',()=>window.location.reload());
  },12000);

  function offerUpdate(reg) {
    if (reg.waiting && window.navigator.serviceWorker.controller) updateBar.hidden = false;
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && window.navigator.serviceWorker.controller) updateBar.hidden = false;
      });
    });
  }
  updateButton.addEventListener('click', () => {
    if (!registration || !registration.waiting) {
      updateBar.hidden = true;
      return;
    }
    reloadRequested = true;
    updateButton.disabled = true;
    registration.waiting.postMessage({ type: 'ACTIVATE_UPDATE' });
  });
  if ('serviceWorker' in window.navigator && window.navigator.serviceWorker) {
    window.navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!reloadRequested || reloading) return;
      reloading = true; window.location.reload();
    });
    window.navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
      .then(reg => { registration = reg; offerUpdate(reg); return window.navigator.serviceWorker.ready; })
      .then(() => { ready = true; renderOffline(); })
      .catch(() => { offlineStatus.textContent = '오프라인 준비 실패 · 다시 열어 주세요.'; });
  } else {
    offlineStatus.textContent = '오프라인 사용 불가';
  }
})();
