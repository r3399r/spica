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

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true); // auto update without asking
  },
});
