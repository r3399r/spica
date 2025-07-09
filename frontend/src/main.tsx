import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { configStore } from './redux/store';
import './style/index.css';
import './util/i18n';

const store = configStore();

const root = createRoot(document.getElementById('root') as Element);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

// Migration step: unregister old CRA service workers
if ('serviceWorker' in navigator)
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    let foundOldCRA = false;

    registrations.forEach((reg) => {
      // CRA service workers usually have this path
      if (reg.active?.scriptURL.includes('/service-worker.js')) {
        foundOldCRA = true;
        reg.unregister().then(() => {
          console.log('[PWA] Unregistered old CRA service worker');
        });
      }
    });

    // Wait a short time before registering new SW
    setTimeout(() => {
      if (!foundOldCRA)
        // No old SW, safe to register immediately
        safelyRegisterViteSW();
      else {
        // Delay a bit after unregister to let browser clear things
        console.log('[PWA] Delayed new SW registration after cleanup');
        setTimeout(() => {
          safelyRegisterViteSW();
        }, 1000); // wait 1s after unregister
      }
    }, 200);
  });

function safelyRegisterViteSW() {
  const updateSW = registerSW({
    onNeedRefresh() {
      updateSW(true); // auto update without asking
    },
  });
}
