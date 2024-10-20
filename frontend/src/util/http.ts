import axios, { AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { t } from 'i18next';
import packageJson from '../../package.json'; // eslint-disable-line
import { ErrorMessage } from 'src/constant/backend/ErrorMessage';

// eslint-disable-next-line
type Options<D = any, P = any> = {
  headers?: RawAxiosRequestHeaders;
  data?: D;
  params?: P;
};

const defaultConfig: AxiosRequestConfig = {
  baseURL: '/api/',
  timeout: 30000,
};

const defaultHeader: RawAxiosRequestHeaders = {
  'Content-type': 'application/json',
  Accept: 'application/json',
  'x-api-version': packageJson.version,
};

// eslint-disable-next-line
const publicRequestConfig = <D = unknown, P = any>(
  method: string,
  url: string,
  options?: Options<D, P>,
) => ({
  ...defaultConfig,
  headers: {
    ...defaultHeader,
    ...options?.headers,
  },
  data: options?.data,
  params: options?.params,
  url,
  method,
});

// eslint-disable-next-line
const request = async <T>(config: AxiosRequestConfig<any>) => {
  try {
    // eslint-disable-next-line
    return await axios.request<T, AxiosResponse<T, any>, any>(config);
  } catch (e) {
    console.log(e);
    if (axios.isAxiosError(e))
      switch (e.response?.data.message) {
        case ErrorMessage.TOO_FREQUENT:
          alert(t('error.tooFrequent'));
          break;
        case ErrorMessage.INVALID_CODE:
          alert(t('error.invalidCode'));
          break;
        case ErrorMessage.INVALID_EMAIL:
          alert(t('error.invalidEmail'));
          break;
        default:
          alert(t('error.default'));
      }
    else alert(t('error.default'));

    throw new Error(String(e));
  }
};

// eslint-disable-next-line
const get = async <T, P = any>(url: string, options?: Options<any, P>) =>
  await request<T>(publicRequestConfig<unknown, P>('get', url, options));

const post = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await request<T>(publicRequestConfig<D>('post', url, options));

const put = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await request<T>(publicRequestConfig<D>('put', url, options));

const patch = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await request<T>(publicRequestConfig<D>('patch', url, options));

const sendDelete = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await request<T>(publicRequestConfig<D>('delete', url, options));

export default {
  get,
  post,
  put,
  patch,
  delete: sendDelete,
};
