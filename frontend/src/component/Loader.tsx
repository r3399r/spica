import { Backdrop } from '@mui/material';
import { useSelector } from 'react-redux';
import IcLoader from 'src/image/ic-loader.svg';
import { RootState } from 'src/redux/store';

const Loader = () => {
  const { workload } = useSelector((rootState: RootState) => rootState.ui);

  return (
    <Backdrop open={workload > 0} className="z-[1400]">
      <div className="w-20 outline-none">
        <img src={IcLoader} />
      </div>
    </Backdrop>
  );
};

export default Loader;
