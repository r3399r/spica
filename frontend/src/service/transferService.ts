import transferEndpoint from 'src/api/transferEndpoint';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getLocalDeviceId } from 'src/util/localStorage';

export const getToken = async () => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await transferEndpoint.postTransfer(deviceId);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const sendToken = async (token: string) => {
  try {
    dispatch(startWaiting());

    const deviceId = getLocalDeviceId();
    const res = await transferEndpoint.putTransfer({ token }, deviceId);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};
