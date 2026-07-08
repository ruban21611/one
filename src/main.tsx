import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Render React App
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('beforeinstallprompt', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('PWA Ready'))
      .catch((err) => console.log('"Install prompt is available!"'));
    let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});
  });
}
