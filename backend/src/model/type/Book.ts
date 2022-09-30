import { BillShareType, BillType } from 'src/constant/Book';
import { Bill } from 'src/model/entity/Bill';
import { BillShare } from 'src/model/entity/BillShare';
import { Transfer } from 'src/model/entity/Transfer';

export type ShareDetail = {
  id: string;
  type: BillShareType;
  value: number;
  takeRemainder: boolean;
};

export type BillData = {
  date: string;
  type: BillType;
  descr: string;
  amount: number;
  former: ShareDetail[];
  latter: ShareDetail[];
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

export type BillTransaction = Bill & { detail: BillShare[] };

export type TransferTransaction = Transfer;
