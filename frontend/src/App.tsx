import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from './component/Loader';
import useQuery from './hook/useQuery';
import { RootState } from './redux/store';
import Routes from './Routes';
import { getDeviceId, setDeviceId } from './service/appService';

const App = () => {
  const { id } = useQuery<{ id: string }>();
  const { isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);

  useEffect(() => {
    setDeviceId(id);
  }, [id]);

  useEffect(() => {
    if (!isDeviceReady) return;
    const deviceId = getDeviceId();
    document
      .querySelector('#my-manifest-placeholder')
      ?.setAttribute('href', `/api/manifest?id=${deviceId}`);
  }, [isDeviceReady]);

  return (
    <>
      <Routes />
      <Loader />
    </>
  );
};

export default App;
