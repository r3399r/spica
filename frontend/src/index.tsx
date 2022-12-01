import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { HistoryProvider } from './context/HistoryContext';
import { configStore } from './redux/store';
import './index.css';
import './util/i18n';

const store = configStore();

const root = createRoot(document.getElementById('root') as Element);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <HistoryProvider>
        <App />
      </HistoryProvider>
    </BrowserRouter>
  </Provider>,
);
