import { useEffect } from 'react';
import Loader from './component/Loader';
import Routes from './Routes';
import { getDeviceId } from './service/appService';

const App = () => {
  useEffect(() => {
    const id = getDeviceId();
    document
      .querySelector('#my-manifest-placeholder')
      ?.setAttribute('href', `/api/manifest?id=${id}`);
  }, []);

  return (
    <>
      <Routes />
      <Loader />
    </>
  );
};

export default App;
