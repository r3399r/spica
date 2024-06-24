import { Member } from 'src/model/backend/entity/Member';
import { Check } from 'src/model/Book';
import { bn } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

export const check = (members: Member[]): Check[] => {
  const res: Check[] = [];

  let sortedMember = [...members].filter((v) => v.balance !== 0).sort(compare('balance', 'asc'));
  while (sortedMember.length > 0) {
    const former = sortedMember[sortedMember.length - 1];
    const latter = sortedMember[0];
    res.push({
      former,
      latter,
      amount: bn(latter.balance).abs().toNumber(),
    });

    sortedMember[sortedMember.length - 1] = {
      ...sortedMember[sortedMember.length - 1],
      balance: bn(former.balance).plus(latter.balance).toNumber(),
    };
    sortedMember.shift();
    sortedMember = sortedMember.filter((v) => v.balance !== 0).sort(compare('balance', 'asc'));
  }

  return res;
};
