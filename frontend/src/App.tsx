import { useEffect } from 'react';
import Loader from './component/Loader';
import Snackbar from './component/Snackbar';
import Routes from './Routes';
import { checkIsBinded, setDeviceId } from './service/appService';

const App = () => {
  useEffect(() => {
    checkIsBinded();
    setDeviceId();
  }, []);

  return (
    <>
      <Routes />
      <Loader />
      <Snackbar />
    </>
  );
};

export default App;
