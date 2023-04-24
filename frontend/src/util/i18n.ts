import { init, use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { Language } from 'src/constant/Language';

// load translation using http
use(ChainedBackend);
// detect user language
use(LanguageDetector);
// pass the i18n instance to react-i18next.
use(initReactI18next);
// init i18next
init({
  // language to use if translations in user language are not available
  fallbackLng: 'en',
  // array of allowed languages
  supportedLngs: Language.map((v) => v.code),
  // namespaces to load
  ns: ['common'],
  // default namespace used if not passed to translation function
  defaultNS: 'common',
  // not needed for react as it escapes by default
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
    format(value, format) {
      if (format === 'uppercase') return value.toUpperCase();

      return value;
    },
  },
  // options for react
  react: {
    // if using suspense or not
    useSuspense: true,
  },
  // options for backend plugin
  backend: {
    backends: [HttpBackend],
    backendOptions: [
      {
        // path where resources get loaded from
        loadPath: '/locale/{{lng}}/{{ns}}.json',
      },
    ],
  },
});
