import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>,
)


const MIN_SPLASH_MS = 600;
const startedAt = performance.now();

const hideSplash = () => {
    const splash = document.getElementById("app-splash");

    if (!splash) return;

    splash.classList.add("is-hidden");
    window.setTimeout(() => splash.remove(), 600);
};

const fontsReady = document.fonts?.ready ?? Promise.resolve();

// Sécurité : on ne bloque jamais plus de 4 s, même si les polices traînent
Promise.race([
    fontsReady,
    new Promise((resolve) => window.setTimeout(resolve, 4000)),
]).then(() => {
    const elapsed = performance.now() - startedAt;
    window.setTimeout(hideSplash, Math.max(MIN_SPLASH_MS - elapsed, 0));
});