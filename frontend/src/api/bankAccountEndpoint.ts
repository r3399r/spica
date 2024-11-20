import { t } from 'i18next';
import {
  DeleteBankAccountResponse,
  GetBankAccountBankResponse,
  GetBankAccountResponse,
  PostBankAccountRequest,
  PostBankAccountResponse,
  PutBankAccountRequest,
  PutBankAccountResponse,
} from 'src/model/backend/api/BankAccount';
import http from 'src/util/http';

const getBankAccount = async (deviceId: string) => {
  try {
    return await http.get<GetBankAccountResponse>('bankAccount', {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const postBankAccount = async (data: PostBankAccountRequest, deviceId: string) => {
  try {
    return await http.post<PostBankAccountResponse>('bankAccount', {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const putBankAccount = async (id: string, data: PutBankAccountRequest, deviceId: string) => {
  try {
    return await http.put<PutBankAccountResponse>(`bankAccount/${id}`, {
      data,
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const deleteBankAccount = async (id: string, deviceId: string) => {
  try {
    return await http.delete<DeleteBankAccountResponse>(`bankAccount/${id}`, {
      headers: { 'x-api-device': deviceId },
    });
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

const getBankAccountBank = async () => {
  try {
    return await http.get<GetBankAccountBankResponse>('bankAccount/bank');
  } catch (e) {
    alert(t('error.default'));
    throw e;
  }
};

export default {
  getBankAccount,
  postBankAccount,
  putBankAccount,
  deleteBankAccount,
  getBankAccountBank,
};
