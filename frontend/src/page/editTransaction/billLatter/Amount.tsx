import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import H2 from 'src/component/celestial-ui/typography/H2';
import { RootState } from 'src/redux/store';
import { remainingAmount } from 'src/service/transactionService';

const Amount = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const {
    book: { books },
    form: { billFormData },
  } = useSelector((rootState: RootState) => rootState);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const remaining = useMemo(
    () => remainingAmount(billFormData.amount ?? 0, billFormData.latter ?? []),
    [billFormData.latter],
  );

  return (
    <div className="flex justify-between items-center">
      <H2>{`${book?.symbol}${billFormData.amount ?? 0}`}</H2>
      <Body className={classNames({ 'text-tomato-500': remaining !== 0 })}>{`${t(
        remaining > 0 ? 'editTx.greaterThan' : 'editTx.lessThan',
        {
          symbol: book?.symbol,
          amount: remaining > 0 ? remaining : remaining * -1,
        },
      )}`}</Body>
    </div>
  );
};

export default Amount;
