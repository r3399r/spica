import { dispatch } from 'src/redux/store';
import { setDeviceReady, setEmailBinded } from 'src/redux/uiSlice';
import { setLocalDeviceId } from 'src/util/localStorage';

export const setDeviceId = (id?: string) => {
  setLocalDeviceId(id);
  dispatch(setDeviceReady());
};

export const checkIsBinded = () => {
  const emailBinded = localStorage.getItem('emailBinded');
  if (emailBinded) dispatch(setEmailBinded(emailBinded));
};
