import { Member } from 'src/model/backend/entity/Member';
import { Check } from 'src/model/Book';
import { bn } from 'src/util/bignumber';
import { compare } from 'src/util/compare';

export const check = (members: Member[]): Check[] => {
  let formers = members.filter((v) => v.balance > 0);
  let latters = members.filter((v) => v.balance < 0);
  let n = 0;

  const res: Check[] = [];
  while (formers.length > 0 && latters.length > 0 && n < members.length) {
    const sortedFormers = formers.sort(compare('balance', 'desc'));
    const sortedLatters = latters.sort(compare('balance', 'asc'));

    const former = sortedFormers[0];
    const latter = sortedLatters[0];

    const diff = bn(former.balance).plus(latter.balance);
    if (diff.gt(0)) {
      sortedFormers[0] = { ...former, balance: diff.toNumber() };
      sortedLatters.shift();
      res.push({
        former,
        latter,
        amount: latter.balance * -1,
      });
    } else if (diff.lt(0)) {
      sortedLatters[0] = { ...latter, balance: diff.toNumber() };
      sortedFormers.shift();
      res.push({
        former,
        latter,
        amount: former.balance,
      });
    } else {
      sortedLatters.shift();
      sortedFormers.shift();
      res.push({
        former,
        latter,
        amount: former.balance,
      });
    }
    formers = sortedFormers;
    latters = sortedLatters;
    n = n + 1;
  }

  return res;
};
