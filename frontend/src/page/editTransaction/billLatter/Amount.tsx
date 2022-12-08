import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Body from 'src/celestial-ui/component/typography/Body';
import H2 from 'src/celestial-ui/component/typography/H2';
import useBook from 'src/hook/useBook';
import { RootState } from 'src/redux/store';
import { remainingAmount } from 'src/service/transactionService';
import { bn, bnFormat } from 'src/util/bignumber';

const Amount = () => {
  const { t } = useTranslation();
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);
  const book = useBook();
  const remaining = useMemo(
    () => remainingAmount(billFormData.amount ?? 0, billFormData.latter ?? []),
    [billFormData.latter],
  );

  return (
    <div className="flex justify-between items-center">
      <H2>{`${book?.symbol}${bnFormat(billFormData.amount ?? 0)}`}</H2>
      <Body className={classNames({ 'text-tomato-500': remaining !== 0 })}>{`${t(
        remaining > 0 ? 'editTx.greaterThan' : 'editTx.lessThan',
        {
          symbol: book?.symbol,
          amount: bn(remaining).abs().toFormat(),
        },
      )}`}</Body>
    </div>
  );
};

export default Amount;
