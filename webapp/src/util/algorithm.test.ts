import { getMinIndex } from './algorithm';
import { bn } from './bignumber';

describe('getMinIndex', () => {
  it('should work', () => {
    expect(getMinIndex([bn(1), bn(2), bn(3)])).toStrictEqual([0]);
    expect(getMinIndex([bn(1), bn(2), bn(3), bn(1)])).toStrictEqual([0, 3]);
  });
});
