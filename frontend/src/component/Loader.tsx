import { ModalUnstyled } from '@mui/base';
import { useSelector } from 'react-redux';
import IcLoader from 'src/image/ic-loader.svg';
import { RootState } from 'src/redux/store';
import Backdrop from './Backdrop';

const Loader = () => {
  const { workload } = useSelector((rootState: RootState) => rootState.ui);

  return (
    <ModalUnstyled
      open={workload > 0}
      className="fixed inset-0 z-20 flex items-center justify-center"
      slots={{ backdrop: Backdrop }}
    >
      <div className="w-20 outline-none">
        <img src={IcLoader} />
      </div>
    </ModalUnstyled>
  );
};

export default Loader;
