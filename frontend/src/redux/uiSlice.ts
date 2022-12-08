import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  workload: number;
  txState: 'main' | 'former' | 'latter';
  txPageScroll: number;
  settlementTab: 'check' | 'balance';
};

const initialState: UiState = {
  workload: 0,
  txState: 'main',
  txPageScroll: 0,
  settlementTab: 'check',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
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
  },
});

export const { startWaiting, finishWaiting, setTxState, setTxPageScroll, setSettlementTab } =
  uiSlice.actions;

export default uiSlice.reducer;
