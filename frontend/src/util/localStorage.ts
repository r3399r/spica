import { v4 as uuidv4 } from 'uuid';

export const setLocalDeviceId = (id?: string) => {
  const existingId = localStorage.getItem('deviceId');

  if (existingId !== null) return;

  const newId = id ?? uuidv4();
  localStorage.setItem('deviceId', newId);
};

export const getLocalDeviceId = () => localStorage.getItem('deviceId');
