import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import IcMember from 'src/image/ic-member.svg';
import { RootState } from 'src/redux/store';
import { getBookIndex } from 'src/service/bookService';
import { bn } from 'src/util/bignumber';

const MainCard = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const index = useMemo(() => getBookIndex(id ?? ''), [id]);
  const total = useMemo(
    () => book?.members?.reduce((prev, current) => prev.plus(current.total), bn(0)),
    [book],
  );

  return (
    <div
      className={classNames('rounded-[15px] p-[10px]', {
        'bg-beige-300': index % 3 === 0,
        'bg-green-300': index % 3 === 1,
        'bg-tan-300': index % 3 === 2,
      })}
    >
      <div className="min-h-[28px] text-navy-700 font-bold text-xl mb-[10px]">{book?.name}</div>
      <div className="flex items-end">
        <div className="flex-1">
          <div className="text-navy-300 text-[12px] leading-[18px]">
            {total?.gte(0) ? t('bookDetail.totalIn') : t('bookDetail.totalOut')}
          </div>
          <div className="text-navy-700 font-bold">{total?.abs().toFormat()} TWD</div>
        </div>
        <div>
          <Button appearance="default" className="!p-[5px] !rounded-md">
            <div className="flex gap-[5px]">
              <img src={IcMember} />
              <div className="pr-[5px]">{t('bookDetail.member')}</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
