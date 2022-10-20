import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'src/redux/store';

const BalanceCard = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);

  return (
    <div className="rounded-[15px] p-[10px] bg-grey-200 my-[10px] text-navy-700">
      <div className="font-bold text-xl mb-[10px]">{t('bookDetail.balance')}</div>
      {book && book.members && book.members.length > 0 ? (
        book.members.map((v) => (
          <div key={v.id} className="flex justify-between py-[5px] ml-[10px] gap-2">
            <div>{v.nickname}</div>
            <div>{`$${v.balance}`}</div>
          </div>
        ))
      ) : (
        <div className="text-black">--</div>
      )}
    </div>
  );
};

export default BalanceCard;
