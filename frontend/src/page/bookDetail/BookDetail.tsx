import { Button } from '@mui/material';
import { GetBookIdResponse as Book } from '@y-celestial/spica-service';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { getBookById } from 'src/service/bookService';

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
            <h1>{book.name}</h1>
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
          <h2>餘額</h2>
          {book.members.length === 0 && <div>目前帳本中無任何成員，請至設定新增</div>}
          {book.members.map((v) => (
            <div key={v.id}>{`${v.nickname}: $${v.balance}`}</div>
          ))}
          <h2>帳目清單</h2>
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
                <div>
                  <div style={{ height: 1, background: 'black' }} />
                  <div>{format(new Date(v.date), 'yyyy-MM-dd HH:mm')}</div>
                  <div>${v.amount}</div>
                  <div>{`${book.members.find((o) => o.id === v.srcMemberId)?.nickname}→${
                    book.members.find((o) => o.id === v.dstMemberId)?.nickname
                  }`}</div>
                </div>
              );
            else
              return (
                <div>
                  <div style={{ height: 1, background: 'black' }} />
                  <div>{format(new Date(v.date), 'yyyy-MM-dd HH:mm')}</div>
                  <div>${v.amount}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div>先墊:</div>
                    {v.detail
                      .filter((o) => o.amount > 0)
                      .map((o) => (
                        <div key={o.id}>{`${
                          book.members.find((m) => m.id === o.memberId)?.nickname
                        } ${o.amount}`}</div>
                      ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div>待付:</div>
                    {v.detail
                      .filter((o) => o.amount < 0)
                      .map((o) => (
                        <div key={o.id}>{`${
                          book.members.find((m) => m.id === o.memberId)?.nickname
                        } ${o.amount * -1}`}</div>
                      ))}
                  </div>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default BookDetail;
