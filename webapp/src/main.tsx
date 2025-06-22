import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { configStore } from './redux/store';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
