import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BillType } from '@y-celestial/spica-service';
import { BillForm } from 'src/model/Form';

export type FormState = {
  billFormData: Partial<BillForm>;
};

const initialState: FormState = {
  billFormData: {
    type: BillType.Out,
    date: new Date().toISOString(),
  },
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    saveBillFormData: (state: FormState, action: PayloadAction<Partial<BillForm>>) => {
      state.billFormData = { ...state.billFormData, ...action.payload };
    },
    resetBillFormData: (state: FormState) => {
      state.billFormData = initialState.billFormData;
    },
  },
});

export const { saveBillFormData, resetBillFormData } = formSlice.actions;

export default formSlice.reducer;
