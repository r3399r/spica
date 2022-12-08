import { Transaction } from '@y-celestial/spica-service';
import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Body from 'src/celestial-ui/component/typography/Body';
import H2 from 'src/celestial-ui/component/typography/H2';
import H4 from 'src/celestial-ui/component/typography/H4';
import NavbarVanilla from 'src/component/NavbarVanilla';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import { aggregateTransactions, loadBookById, loadMoreBookById } from 'src/service/bookService';
import { bn } from 'src/util/bignumber';

const PersonalBalance = () => {
  const { id, uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const book = useBook();
  const member = useMemo(() => book?.members?.find((v) => v.id === uid), [uid, book]);
  const transactions = useMemo(
    () =>
      aggregateTransactions(
        book?.id ?? 'xx',
        book?.transactions?.filter(
          (v) => v.type !== 'transfer' && v.latter.map((o) => o.id).includes(uid ?? 'xx'),
        ) ?? [],
      ),
    [book],
  );

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  const items = (item: Transaction) => {
    if (item.type !== 'transfer')
      return (
        <div
          key={item.id}
          className="py-[10px] border-b-[1px] border-b-grey-300 cursor-pointer flex justify-between"
          onClick={() => navigate(`${Page.Book}/${id}/tx/${item.id}`)}
        >
          <div className="flex gap-1">
            {item.dateDeleted && (
              <Body size="s" className="px-1 py-[3px] bg-tomato-500 text-white">
                {t('bookDetail.deleted')}
              </Body>
            )}
            <Body size="l" bold className={classNames({ 'opacity-30': item.dateDeleted })}>
              {item.descr}
            </Body>
          </div>
          <div className="flex gap-[10px]">
            <Body
              size="s"
              className={classNames('py-[3px] px-1 bg-grey-200', {
                'text-tomato-700': item.type === 'out',
                'text-green-700': item.type === 'in',
              })}
            >
              {item.type === 'out' ? t('desc.out') : t('desc.in')}
            </Body>
            <Body size="l" className={classNames({ 'opacity-30': item.dateDeleted })}>{`${
              book?.symbol
            }${bn(item.latter.find((v) => v.id === uid)?.amount ?? '0')
              .abs()
              .toFormat()}`}</Body>
          </div>
        </div>
      );
  };

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <NavbarVanilla text={t('act.back')} />
      <H2>{member?.nickname}</H2>
      <div className="pt-5 flex justify-end items-center gap-[10px]">
        <Body
          size="s"
          className={classNames('py-[3px] px-1 bg-grey-200', {
            'text-tomato-700': member?.total && member.total < 0,
            'text-green-700': member?.total && member.total >= 0,
          })}
        >
          {member?.total && member.total < 0 ? t('desc.out') : t('desc.in')}
        </Body>
        <H4>
          {book?.symbol}
          {bn(member?.total ?? '0')
            .abs()
            .toFormat()}
        </H4>
      </div>
      {Object.keys(transactions).map((v) => (
        <div key={v} className="mt-[10px]">
          <Body bold className="pt-[5px] text-navy-100">
            {v}
          </Body>
          <>{transactions[v].map(items)}</>
        </div>
      ))}
      {book?.transactions?.length !== book?.txCount && (
        <div className="text-center" onClick={() => loadMoreBookById(id ?? 'xx')}>
          -- load more --
        </div>
      )}
    </div>
  );
};

export default PersonalBalance;
