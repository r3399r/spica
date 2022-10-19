import { Button as MuiButton } from '@mui/material';
import classNames from 'classnames';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import H2 from 'src/component/celestial-ui/typography/H2';
import { Page } from 'src/constant/Page';
import IcBack from 'src/image/ic-back.svg';
import IcMember from 'src/image/ic-member.svg';
import IcSetting from 'src/image/ic-setting.svg';
import { RootState } from 'src/redux/store';
import { loadBookById } from 'src/service/bookService';
import { deleteBill, deleteTransfer } from 'src/service/fillService';

const BookDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const [book, index] = useMemo(() => {
    if (books === null) return [undefined, -1];
    const idx = books.findIndex((v) => v.id === id);

    return [books[idx], idx];
  }, [id, books]);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id);
  }, [id]);

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <div className="flex justify-between mt-[15px] mb-5">
        <div className="flex cursor-pointer" onClick={() => navigate(Page.Book)}>
          <img src={IcBack} />
          <div className="text-navy-700 font-bold">{t('bookDetail.back')}</div>
        </div>
        <div className="cursor-pointer" onClick={() => navigate(`${Page.Book}/${id}/setting`)}>
          <img src={IcSetting} />
        </div>
      </div>
      <div
        className={classNames('rounded-[15px] p-[10px]', {
          'bg-beige-300': index % 3 === 0,
          'bg-green-300': index % 3 === 1,
          'bg-tan-300': index % 3 === 2,
        })}
      >
        <div className="text-navy-700 font-bold text-xl mb-[10px]">{book?.name}</div>
        <div className="flex items-end">
          <div className="flex-1">
            <div className="text-navy-300 text-[12px] leading-[18px]">總花費</div>
            <div className="text-navy-700 font-bold">0.00 TWD</div>
          </div>
          <div>
            <Button appearance="default" className="!p-[5px] !rounded-md">
              <div className="flex gap-[5px]">
                <img src={IcMember} />
                <div className="pr-[5px]">成員</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-[15px] p-[10px] bg-grey-200 my-[10px]">
        <div className="text-navy-700 font-bold text-xl mb-[10px]">餘額</div>
        <div className="text-black">--</div>
      </div>
      <div className="text-black p-[10px]">--</div>
      <div className="mt-[30px] px-[46px] text-center text-sm text-navy-300">
        請先至「成員」中新增一起分帳的夥伴， 才能開始記帳喔！
      </div>
      {book && (
        <div>
          <H2>餘額</H2>
          {(book.members ?? []).length === 0 && <div>目前帳本中無任何成員，請至設定新增</div>}
          {(book.members ?? []).map((v) => (
            <div key={v.id}>{`${v.nickname}: $${v.balance}`}</div>
          ))}
          <H2>帳目清單</H2>
          <MuiButton
            variant="contained"
            color="success"
            type="button"
            onClick={() => navigate(`${Page.Book}/${id}/fill`)}
          >
            新增帳目
          </MuiButton>
          {(book.transactions ?? []).map((v) => {
            if ('srcMemberId' in v)
              return (
                <div key={v.id}>
                  <div style={{ height: 1, background: 'black' }} />
                  <div>{format(new Date(v.date), 'yyyy-MM-dd HH:mm')}</div>
                  <div>${v.amount}</div>
                  <div>{`${(book.members ?? []).find((o) => o.id === v.srcMemberId)?.nickname}→${
                    (book.members ?? []).find((o) => o.id === v.dstMemberId)?.nickname
                  }`}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div>備註:</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{v.memo}</div>
                  </div>
                  <MuiButton
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => navigate(`${Page.Book}/${id}/fill`, { state: v })}
                    disabled={!!v.dateDeleted}
                  >
                    修改
                  </MuiButton>
                  <MuiButton
                    variant="contained"
                    color="error"
                    type="button"
                    onClick={() => deleteTransfer(id ?? 'xx', v.id).then(() => navigate('.'))}
                    disabled={!!v.dateDeleted}
                  >
                    刪除
                  </MuiButton>
                </div>
              );
            else
              return (
                <div key={v.id}>
                  <div style={{ height: 1, background: 'black' }} />
                  <div>{format(new Date(v.date), 'yyyy-MM-dd HH:mm')}</div>
                  <div>{`${v.type === 'expense' ? '支出' : '收入'}: ${v.descr} $${v.amount}`}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div>先:</div>
                    {v.detail
                      .filter((o) => (v.type === 'expense' ? o.amount > 0 : o.amount < 0))
                      .map((o) => (
                        <div key={o.id}>{`${
                          (book.members ?? []).find((m) => m.id === o.memberId)?.nickname
                        } $${o.amount}`}</div>
                      ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div>後:</div>
                    {v.detail
                      .filter((o) => (v.type === 'expense' ? o.amount < 0 : o.amount > 0))
                      .map((o) => (
                        <div key={o.id}>{`${
                          (book.members ?? []).find((m) => m.id === o.memberId)?.nickname
                        } $${o.amount}`}</div>
                      ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div>備註:</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{v.memo}</div>
                  </div>
                  <MuiButton
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => navigate(`${Page.Book}/${id}/fill`, { state: v })}
                    disabled={!!v.dateDeleted}
                  >
                    修改
                  </MuiButton>
                  <MuiButton
                    variant="contained"
                    color="error"
                    type="button"
                    onClick={() => deleteBill(id ?? 'xx', v.id).then(() => navigate(0))}
                    disabled={!!v.dateDeleted}
                  >
                    刪除
                  </MuiButton>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default BookDetail;
