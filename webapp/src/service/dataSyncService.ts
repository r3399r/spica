import dataSyncEndpoint from 'src/api/dataSyncEndpoint';
import { dispatch } from 'src/redux/store';
import { finishWaiting, setEmailBinded, startWaiting } from 'src/redux/uiSlice';
import { getLocalDeviceId } from 'src/util/localStorage';

export const receiveCode = async (email: string, language: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await dataSyncEndpoint.postDataSync({ email, language }, deviceId);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const bind = async (email: string, code: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await dataSyncEndpoint.postDataSyncBind({ email, code }, deviceId);

    localStorage.setItem('emailBinded', email);
    dispatch(setEmailBinded(email));
    localStorage.setItem('deviceId', res.data.newDeviceId);
  } finally {
    dispatch(finishWaiting());
  }
};

export const unbind = async () => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await dataSyncEndpoint.postDataSyncUnbind(deviceId);

    localStorage.removeItem('emailBinded');
    dispatch(setEmailBinded(null));
    localStorage.setItem('deviceId', res.data.newDeviceId);
  } finally {
    dispatch(finishWaiting());
  }
};
