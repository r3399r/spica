import { getLocalDeviceId, setLocalDeviceId } from 'src/util/localStorage';

export const getDeviceId = () => getLocalDeviceId();

export const setDeviceId = (id?: string) => {
  setLocalDeviceId(id);
};
