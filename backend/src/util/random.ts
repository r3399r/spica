import { randomInt } from 'crypto';

// except 0, o, l
export const randomBase33 = (length: number) =>
  random('123456789abcdefghijkmnpqrstuvwxyz', length);

const random = (chars: string, length: number): string => {
  const n = chars.length;
  let str = '';
  for (let i = 0; i < length; ++i) str += chars[randomInt(n)];

  return str;
};
