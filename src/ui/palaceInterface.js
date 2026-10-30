export function createPalaceInterface({ controls } = {}) {
  const intro = document.querySelector('#intro-screen');
  const enterButton = document.querySelector('#enter-palace');
  const helpPanel = document.querySelector('#help-panel');
  const openHelpButton = document.querySelector('#open-help');
  const closeHelpButtons = document.querySelectorAll('[data-close-help]');
  const resetButton = document.querySelector('#reset-view');
  const memoryCount = document.querySelector('#memory-count');
  const toast = document.querySelector('#toast');
  let toastTimer = 0;
  let toastHideTimer = 0;
  let introTimer = 0;
  let helpTimer = 0;
  let helpHideTimer = 0;
  let helpOpen = false;
  let hasEntered = false;

  const setToast = (text) => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    window.clearTimeout(toastHideTimer);
    toast.textContent = text;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      toastHideTimer = window.setTimeout(() => { toast.hidden = true; }, 250);
    }, 2600);
  };
  const setCount = (count) => {
    if (memoryCount) memoryCount.textContent = String(count);
  };
  const showHelp = (value) => {
    if (!helpPanel) return;
    helpOpen = value;
    if (value) {
      window.clearTimeout(helpHideTimer);
      helpPanel.hidden = false;
      helpPanel.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => helpPanel.classList.add('is-open'));
      helpPanel.querySelector('[data-close-help]')?.focus({ preventScroll: true });
    } else {
      helpPanel.classList.remove('is-open');
      helpPanel.setAttribute('aria-hidden', 'true');
      helpHideTimer = window.setTimeout(() => { helpPanel.hidden = true; }, 230);
      try { window.localStorage.setItem('memorastle.controlsSeen', 'true'); } catch { /* Preferences are optional. */ }
    }
  };
  const onEnter = () => enter();
  const onToggleHelp = () => showHelp(!helpOpen);
  const onCloseHelp = () => showHelp(false);
  const onResetView = () => { controls?.reset(); setToast('The view has returned to the entrance.'); };

  const enter = () => {
    if (!intro || intro.classList.contains('is-leaving')) return;
    if (enterButton) enterButton.disabled = true;
    intro.classList.add('is-leaving');
    try { window.localStorage.setItem('memorastle.entered', 'true'); } catch { /* The experience still works without saved preferences. */ }
    introTimer = window.setTimeout(() => { intro.hidden = true; }, 560);
    let hasSeenControls = false;
    try { hasSeenControls = window.localStorage.getItem('memorastle.controlsSeen') === 'true'; } catch { /* Show the hint when preference storage is blocked. */ }
    if (!hasSeenControls) helpTimer = window.setTimeout(() => showHelp(true), 380);
  };

  if (intro) {
    try { hasEntered = window.localStorage.getItem('memorastle.entered') === 'true'; } catch { /* Intro remains available when storage is blocked. */ }
    if (hasEntered) intro.hidden = true;
  }
  if (hasEntered) {
    let hasSeenControls = false;
    try { hasSeenControls = window.localStorage.getItem('memorastle.controlsSeen') === 'true'; } catch { /* Show instructions if preferences cannot be read. */ }
    if (!hasSeenControls) helpTimer = window.setTimeout(() => showHelp(true), 0);
  }

  enterButton?.addEventListener('click', onEnter);
  openHelpButton?.addEventListener('click', onToggleHelp);
  closeHelpButtons.forEach((button) => button.addEventListener('click', onCloseHelp));
  resetButton?.addEventListener('click', onResetView);

  return {
    setCount,
    showToast: setToast,
    closeHelp: () => showHelp(false),
    dispose() {
      window.clearTimeout(toastTimer);
      window.clearTimeout(toastHideTimer);
      window.clearTimeout(introTimer);
      window.clearTimeout(helpTimer);
      window.clearTimeout(helpHideTimer);
      if (helpPanel) {
        helpPanel.hidden = true;
        helpPanel.classList.remove('is-open');
        helpPanel.setAttribute('aria-hidden', 'true');
      }
      if (toast) toast.hidden = true;
      enterButton?.removeEventListener('click', onEnter);
      openHelpButton?.removeEventListener('click', onToggleHelp);
      resetButton?.removeEventListener('click', onResetView);
      closeHelpButtons.forEach((button) => button.removeEventListener('click', onCloseHelp));
    },
  };
}
