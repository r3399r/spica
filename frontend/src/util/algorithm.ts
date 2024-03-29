import BN from 'bignumber.js';

export const getMinIndex = (array: BN[]) => {
  const min = BN.minimum(...array);

  return array.reduce<number[]>((r, a, i) => {
    a.eq(min) && r.push(i);

    return r;
  }, []);
};

export const getMaxIndex = (array: BN[]) => {
  const max = BN.maximum(...array);

  return array.reduce<number[]>((r, a, i) => {
    a.eq(max) && r.push(i);

    return r;
  }, []);
};
