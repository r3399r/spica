import classNames from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/celestial-ui/Button';
import Body from 'src/celestial-ui/typography/Body';
import H4 from 'src/celestial-ui/typography/H4';
import H5 from 'src/celestial-ui/typography/H5';
import { Page } from 'src/constant/Page';
import IcMember from 'src/image/ic-member.svg';
import { RootState } from 'src/redux/store';
import { getBookIndex } from 'src/service/bookService';
import { bn } from 'src/util/bignumber';

const MainCard = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
          <Button
            appearance="default"
            className="!p-[5px] !rounded-md"
            onClick={() => navigate(`${Page.Book}/${id}/member`)}
          >
            <div className="flex gap-[5px]">
              <img src={IcMember} />
              <Body bold className="pr-[5px] text-white">
                {t('bookDetail.member')}
              </Body>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
