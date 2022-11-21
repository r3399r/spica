import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetBillFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';
import BillFormer from './billFormer';
import Main from './main';

const EidtTransaction = () => {
  const { txState } = useSelector((rootState: RootState) => rootState.ui);
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(resetBillFormData());
    },
    [],
  );

  return (
    <>
      {txState === 'main' && <Main />}
      {txState === 'former' && <BillFormer />}
    </>
  );
};

export default EidtTransaction;
