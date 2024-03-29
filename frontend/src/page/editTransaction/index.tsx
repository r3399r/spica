import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetBillFormData, resetTransferFormData, setTxFormType } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import { setTxState } from 'src/redux/uiSlice';
import BillFormer from './billFormer';
import BillLatter from './billLatter';
import Main from './main';

const EidtTransaction = () => {
  const { txState } = useSelector((rootState: RootState) => rootState.ui);
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetBillFormData());
      dispatch(resetTransferFormData());
      dispatch(setTxState('main'));
      dispatch(setTxFormType('bill'));
    },
    [],
  );

  return (
    <>
      {txState === 'main' && <Main />}
      {txState === 'former' && <BillFormer />}
      {txState === 'latter' && <BillLatter />}
    </>
  );
};

export default EidtTransaction;
