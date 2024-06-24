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

const getBankAccount = async (deviceId: string) =>
  await http.get<GetBankAccountResponse>('bankAccount', { headers: { 'x-api-device': deviceId } });

const postBankAccount = async (data: PostBankAccountRequest, deviceId: string) =>
  await http.post<PostBankAccountResponse>('bankAccount', {
    data,
    headers: { 'x-api-device': deviceId },
  });

const putBankAccount = async (id: string, data: PutBankAccountRequest, deviceId: string) =>
  await http.put<PutBankAccountResponse>(`bankAccount/${id}`, {
    data,
    headers: { 'x-api-device': deviceId },
  });

const deleteBankAccount = async (id: string, deviceId: string) =>
  await http.delete<DeleteBankAccountResponse>(`bankAccount/${id}`, {
    headers: { 'x-api-device': deviceId },
  });

const getBankAccountBank = async () =>
  await http.get<GetBankAccountBankResponse>('bankAccount/bank');

export default {
  getBankAccount,
  postBankAccount,
  putBankAccount,
  deleteBankAccount,
  getBankAccountBank,
};
