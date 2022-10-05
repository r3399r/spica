import { Button } from '@mui/material';
import { GetBookIdResponse as Book } from '@y-celestial/spica-service';
import { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DatetimeInput from 'src/component/DatetimeInput';
import Input from 'src/component/Input';
import { Page } from 'src/constant/Page';
import { TransferForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { addTransfer } from 'src/service/fillService';

const Transfer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookList } = useSelector((rootState: RootState) => rootState.book);
  const [book, setBook] = useState<Book>();
  const [state, setState] = useReducer(
    (prev: TransferForm, now: Partial<TransferForm>) => ({ ...prev, ...now }),
    { date: new Date(), amount: '', from: '', to: '', memo: '' },
  );

  useEffect(() => {
    const res = bookList.find((v) => v.id === id);
    if (res === undefined) navigate(`${Page.Book}/${id}`);
    else setBook(res);
  }, [id, bookList]);

  const onChange = (date: Date) => {
    setState({ date });
  };

  const onSubmit = () => {
    if (book === undefined) return;
    addTransfer(book.id, state).then(() => navigate(`${Page.Book}/${id}`));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>時間: </div>
        <DatetimeInput onChange={onChange} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>金額: </div>
        <Input
          value={state.amount}
          onChange={(e) => setState({ amount: e.target.value })}
          regex={/^\d*\.?\d*$/}
        />
      </div>
      {book && (
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <div>From: </div>
          <select defaultValue="" onChange={(e) => setState({ from: e.target.value })}>
            <option disabled value="" hidden>
              請選擇
            </option>
            {book.members.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nickname}
              </option>
            ))}
          </select>
        </div>
      )}
      {book && (
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <div>To: </div>
          <select defaultValue="" onChange={(e) => setState({ to: e.target.value })}>
            <option disabled value="" hidden>
              請選擇
            </option>
            {book.members.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nickname}
              </option>
            ))}
          </select>
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>備註: </div>
        <textarea value={state.memo} onChange={(e) => setState({ memo: e.target.value })} />
      </div>
      <Button variant="contained" type="button" onClick={onSubmit}>
        送出
      </Button>
    </div>
  );
};

export default Transfer;
