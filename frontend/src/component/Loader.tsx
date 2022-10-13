import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

const Loader = () => {
  const { workload } = useSelector((rootState: RootState) => rootState.ui);

  return (
    <Backdrop open={workload > 0}>
      <CircularProgress />
    </Backdrop>
  );
};

export default Loader;
