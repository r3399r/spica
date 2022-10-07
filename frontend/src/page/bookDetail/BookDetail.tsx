import { Button } from '@mui/material';
import { GetBookIdResponse as Book } from '@y-celestial/spica-service';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import H1 from 'src/component/typography/H1';
import H2 from 'src/component/typography/H2';
import { Page } from 'src/constant/Page';
import { getBookById } from 'src/service/bookService';
import { deleteBill, deleteTransfer } from 'src/service/fillService';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>();

  useEffect(() => {
    if (id === undefined) return;
    getBookById(id).then((res) => setBook(res));
  }, [id]);

  return (
    <div>
      <Button variant="contained" type="button" onClick={() => navigate(Page.Book)}>
        回到清單
      </Button>
      {book && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <H1>{book.name}</H1>
            <div>
              <Button
                variant="contained"
                type="button"
                color="warning"
                onClick={() => navigate(`${Page.Book}/${id}/setting`)}
              >
                設定
              </Button>
            </div>
          </div>
          <H2>餘額</H2>
          {book.members.length === 0 && <div>目前帳本中無任何成員，請至設定新增</div>}
          {book.members.map((v) => (
            <div key={v.id}>{`${v.nickname}: $${v.balance}`}</div>
          ))}
          <H2>帳目清單</H2>
          <Button
            variant="contained"
            color="success"
            type="button"
            onClick={() => navigate(`${Page.Book}/${id}/fill`)}
          >
            新增帳目
          </Button>
          {book.transactions.map((v) => {
            if ('srcMemberId' in v)
              return (
                <div key={v.id}>
                  <div style={{ height: 1, background: 'black' }} />
                  <div>{format(new Date(v.date), 'yyyy-MM-dd HH:mm')}</div>
                  <div>${v.amount}</div>
                  <div>{`${book.members.find((o) => o.id === v.srcMemberId)?.nickname}→${
                    book.members.find((o) => o.id === v.dstMemberId)?.nickname
                  }`}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div>備註:</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{v.memo}</div>
                  </div>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => navigate(`${Page.Book}/${id}/fill`, { state: v })}
                    disabled={!!v.dateDeleted}
                  >
                    修改
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    type="button"
                    onClick={() => deleteTransfer(id ?? 'xx', v.id).then(() => navigate('.'))}
                    disabled={!!v.dateDeleted}
                  >
                    刪除
                  </Button>
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
                          book.members.find((m) => m.id === o.memberId)?.nickname
                        } $${o.amount}`}</div>
                      ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div>後:</div>
                    {v.detail
                      .filter((o) => (v.type === 'expense' ? o.amount < 0 : o.amount > 0))
                      .map((o) => (
                        <div key={o.id}>{`${
                          book.members.find((m) => m.id === o.memberId)?.nickname
                        } $${o.amount}`}</div>
                      ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div>備註:</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{v.memo}</div>
                  </div>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => navigate(`${Page.Book}/${id}/fill`, { state: v })}
                    disabled={!!v.dateDeleted}
                  >
                    修改
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    type="button"
                    onClick={() => deleteBill(id ?? 'xx', v.id).then(() => navigate(0))}
                    disabled={!!v.dateDeleted}
                  >
                    刪除
                  </Button>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default BookDetail;
