export function showAppError(message) {
  const errorElement = document.querySelector('#app-error');
  if (!errorElement) return;
  errorElement.textContent = message;
  errorElement.hidden = false;
}
