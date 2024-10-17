import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import LoadMore from 'src/component/LoadMore';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import H4 from 'src/component/typography/H4';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import { Transaction } from 'src/model/backend/type/Book';
import { aggregateTransactions, loadBookById } from 'src/service/bookService';
import { bn } from 'src/util/bignumber';
import Navbar from './Navbar';

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
          (v) =>
            v.type !== 'transfer' &&
            !v.dateDeleted &&
            v.latter.map((o) => o.id).includes(uid ?? 'xx'),
        ) ?? [],
      ),
    [book],
  );
  const mainCurrencyDisplay = useMemo(() => {
    const primary = book?.currencies?.find((v) => v.isPrimary);
    if (primary === undefined) return '';
    if (book?.currencies?.length === 1) return primary.symbol;

    return `${primary.name}${primary.symbol}`;
  }, [book]);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  const items = (item: Transaction) => {
    const isMultiple = (book?.currencies?.length ?? 0) > 1;
    const currency = book?.currencies?.find((v) => v.id === item.currencyId);
    const currencyDisplay = isMultiple ? `${currency?.name}${currency?.symbol}` : currency?.symbol;

    if (item.type !== 'transfer')
      return (
        <div
          key={item.id}
          className="flex cursor-pointer gap-[10px] border-b-[1px] border-b-grey-300 py-[10px]"
          onClick={() => navigate(`${Page.Book}/${id}/tx/${item.id}`)}
        >
          <Body
            size="s"
            className={classNames('py-[3px] px-1 bg-grey-200', {
              'text-tomato-700': item.type === 'out',
              'text-green-700': item.type === 'in',
            })}
          >
            {item.type === 'out' ? t('desc.out') : t('desc.in')}
          </Body>
          <div className="flex flex-1 justify-between">
            <Body size="l" bold>
              {item.descr}
            </Body>
            <Body size="l">
              {`${currencyDisplay}${bn(item.latter.find((v) => v.id === uid)?.amount ?? '0')
                .abs()
                .toFormat()}`}
            </Body>
          </div>
        </div>
      );
  };

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto" id="pdf-personal-content">
      <Navbar />
      <H2>{member?.nickname}</H2>
      <div className="flex items-center justify-between gap-[10px] pt-5">
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
          {mainCurrencyDisplay}
          {bn(member?.total ?? '0')
            .abs()
            .toFormat()}
        </H4>
      </div>
      {Object.keys(transactions).map((v) => (
        <div key={v} className="my-[10px]">
          <Body bold className="pt-[5px] text-navy-100">
            {v}
          </Body>
          <>{transactions[v].map(items)}</>
        </div>
      ))}
      {book?.transactions?.length !== book?.txCount && <LoadMore />}
    </div>
  );
};

export default PersonalBalance;
