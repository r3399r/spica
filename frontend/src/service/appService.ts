import { v4 as uuidv4 } from 'uuid';

export const getDeviceId = () => {
  const existingId = localStorage.getItem('deviceId');

  if (existingId !== null) return existingId;

  const id = uuidv4();
  localStorage.setItem('deviceId', id);

  return id;
};
