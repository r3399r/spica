import { dispatch } from 'src/redux/store';
import { setDeviceReady } from 'src/redux/uiSlice';
import { getLocalDeviceId, setLocalDeviceId } from 'src/util/localStorage';

export const getDeviceId = () => getLocalDeviceId();

export const setDeviceId = (id?: string) => {
  setLocalDeviceId(id);
  dispatch(setDeviceReady());
};
