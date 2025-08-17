import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bank } from 'src/model/backend/entity/Bank';
import { BankAccount } from 'src/model/backend/entity/BankAccount';

export type UiState = {
  isDeviceReady: boolean;
  workload: number;
  txState: 'main' | 'former' | 'latter';
  txPageScroll: number;
  settlementTab: 'check' | 'balance';
  snackbarMessage: string | undefined;
  paymentList: BankAccount[] | null;
  bankList: Bank[] | null;
  emailBinded: string | null;
  searchQuery: string | null;
  searchQueryChanged: boolean;
};

const initialState: UiState = {
  isDeviceReady: false,
  workload: 0,
  txState: 'main',
  txPageScroll: 0,
  settlementTab: 'balance',
  snackbarMessage: undefined,
  paymentList: null,
  bankList: null,
  emailBinded: null,
  searchQuery: null,
  searchQueryChanged: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDeviceReady: (state: UiState) => {
      state.isDeviceReady = true;
    },
    startWaiting: (state: UiState) => {
      state.workload = state.workload + 1;
    },
    finishWaiting: (state: UiState) => {
      state.workload = state.workload - 1;
    },
    setTxState: (state: UiState, action: PayloadAction<'main' | 'former' | 'latter'>) => {
      state.txState = action.payload;
    },
    setTxPageScroll: (state: UiState, action: PayloadAction<number>) => {
      state.txPageScroll = action.payload;
    },
    setSettlementTab: (state: UiState, action: PayloadAction<'check' | 'balance'>) => {
      state.settlementTab = action.payload;
    },
    setSnackbarMessage: (state: UiState, action: PayloadAction<string | undefined>) => {
      state.snackbarMessage = action.payload;
    },
    setPaymentList: (state: UiState, action: PayloadAction<BankAccount[] | null>) => {
      state.paymentList = action.payload;
    },
    setBankList: (state: UiState, action: PayloadAction<Bank[]>) => {
      state.bankList = action.payload;
    },
    setEmailBinded: (state: UiState, action: PayloadAction<string | null>) => {
      state.emailBinded = action.payload;
    },
    setSearchQuery: (state: UiState, action: PayloadAction<string | null>) => {
      if (state.searchQuery !== action.payload) state.searchQueryChanged = true;
      else state.searchQueryChanged = false;

      state.searchQuery = action.payload;
    },
  },
});

export const {
  setDeviceReady,
  startWaiting,
  finishWaiting,
  setTxState,
  setTxPageScroll,
  setSettlementTab,
  setSnackbarMessage,
  setPaymentList,
  setBankList,
  setEmailBinded,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer;
