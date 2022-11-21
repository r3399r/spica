import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  workload: number;
  txState: 'main' | 'former' | 'latter';
};

const initialState: UiState = {
  workload: 0,
  txState: 'main',
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
  },
});

export const { startWaiting, finishWaiting, setTxState } = uiSlice.actions;

export default uiSlice.reducer;
