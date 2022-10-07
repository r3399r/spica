import { BillType } from 'src/constant/Book';
import { Bill } from 'src/model/entity/Bill';
import { BillShare } from 'src/model/entity/BillShare';
import { Transfer } from 'src/model/entity/Transfer';

export type ShareDetail = {
  id: string;
  amount: number;
};

export type BillData = {
  date: string;
  type: BillType;
  descr: string;
  amount: number;
  detail: ShareDetail[];
  memo?: string;
};

export type TransferData = {
  date: string;
  amount: number;
  srcMemberId: string;
  dstMemberId: string;
  memo?: string;
};

export type Transaction = BillTransaction | TransferTransaction;

export type BillTransaction = Bill & {
  detail: Omit<BillShare, 'billId' | 'ver'>[];
};

export type TransferTransaction = Transfer;
