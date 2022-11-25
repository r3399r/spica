import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BillType } from '@y-celestial/spica-service';
import { BillForm, TransferForm } from 'src/model/Form';

export type FormState = {
  txFormType: 'bill' | 'transfer';
  billFormData: Partial<BillForm>;
  transferFormData: Partial<TransferForm>;
};

const initialState: FormState = {
  txFormType: 'bill',
  billFormData: {
    type: BillType.Out,
    date: new Date().toISOString(),
  },
  transferFormData: {
    date: new Date().toISOString(),
  },
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setTxFormType: (state: FormState, action: PayloadAction<'bill' | 'transfer'>) => {
      state.txFormType = action.payload;
    },
    saveBillFormData: (state: FormState, action: PayloadAction<Partial<BillForm>>) => {
      state.billFormData = { ...state.billFormData, ...action.payload };
    },
    resetBillFormData: (state: FormState) => {
      state.billFormData = initialState.billFormData;
    },
    saveTransferFormData: (state: FormState, action: PayloadAction<Partial<TransferForm>>) => {
      state.transferFormData = { ...state.transferFormData, ...action.payload };
    },
    resetTransferFormData: (state: FormState) => {
      state.transferFormData = initialState.transferFormData;
    },
  },
});

export const {
  setTxFormType,
  saveBillFormData,
  resetBillFormData,
  saveTransferFormData,
  resetTransferFormData,
} = formSlice.actions;

export default formSlice.reducer;
