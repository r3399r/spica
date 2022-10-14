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
      className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center"
      components={{ Backdrop }}
    >
      <div className="w-20 outline-none">
        <img src={IcLoader} />
      </div>
    </ModalUnstyled>
  );
};

export default Loader;
