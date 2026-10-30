export function showAppError(message) {
  document.querySelector('#loading-state')?.classList.add('loading-state--ready');
  const errorElement = document.querySelector('#app-error');
  if (!errorElement) return;
  errorElement.textContent = message;
  errorElement.hidden = false;
}
