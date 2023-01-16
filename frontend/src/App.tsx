import { useEffect } from 'react';
import Loader from './component/Loader';
import useQuery from './hook/useQuery';
import Routes from './Routes';
import { getDeviceId, setDeviceId } from './service/appService';

const App = () => {
  const { id } = useQuery<{ id: string }>();
  useEffect(() => {
    setDeviceId(id);
    const deviceId = getDeviceId();
    document
      .querySelector('#my-manifest-placeholder')
      ?.setAttribute('href', `/api/manifest?id=${deviceId}`);
  }, [id]);

  return (
    <>
      <Routes />
      <Loader />
    </>
  );
};

export default App;
