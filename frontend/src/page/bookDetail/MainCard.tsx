import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Body from 'src/component/typography/Body';
import H4 from 'src/component/typography/H4';
import H5 from 'src/component/typography/H5';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcMember from 'src/image/ic-member.svg';
import { getBookIndex } from 'src/service/bookService';
import { bn } from 'src/util/bignumber';

const MainCard = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const book = useBook();
  const index = useMemo(() => getBookIndex(id ?? ''), [book, id]);
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
      <H4 className="min-h-[28px] text-navy-700 mb-[10px]">{book?.name}</H4>
      <div className="flex items-end">
        <div className="flex-1">
          <Body size="s" className="text-navy-300">
            {total?.gte(0) ? t('bookDetail.totalIn') : t('bookDetail.totalOut')}
          </Body>
          <H5 className="min-h-[24px] text-navy-700">
            {book?.symbol}
            {total?.abs().toFormat()}
          </H5>
        </div>
        <div>
          <div
            className="p-[5px] rounded-md flex gap-[5px] cursor-pointer bg-teal-500 text-white active:bg-teal-400 disabled:bg-teal-300 disabled:text-opacity-70"
            onClick={() => navigate(`${Page.Book}/${id}/member`)}
          >
            <img src={IcMember} />
            <Body bold className="pr-[5px] text-white">
              {t('bookDetail.member')}
            </Body>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
