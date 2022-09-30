import { randomInt } from 'crypto';

export const randomBase10 = (length: number) => random('0123456789', length);

const random = (chars: string, length: number): string => {
  const n = chars.length;
  let str = '';
  for (let i = 0; i < length; ++i) str += chars[randomInt(n)];

  return str;
};
