import { Button } from '@mui/material';
import { GetBookIdResponse as Book, Transaction } from '@y-celestial/spica-service';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import DatetimeInput from 'src/component/deprecated/DatetimeInput';
import Input from 'src/component/deprecated/Input';
import { Page } from 'src/constant/Page';
import { BillForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { addBill, calculateAmount, updateBill } from 'src/service/fillService';
import BillModal from './BillModal';

type Props = {
  type: string;
  edit: Transaction | null;
};

const Bill = ({ type, edit }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookList } = useSelector((rootState: RootState) => rootState.book);
  const [book, setBook] = useState<Book>();
  const [modalType, setModalType] = useState<'former' | 'latter'>();
  const [isFormerCustomized, setIsFormerCustomized] = useState<boolean>(false);
  const [isLatterCustomized, setIsLatterCustomized] = useState<boolean>(false);
  const [former, setFormer] = useState<{ id: string; amount: number }[]>();
  const [latter, setLatter] = useState<{ id: string; amount: number }[]>();
  const [state, setState] = useReducer(
    (prev: BillForm, now: Partial<BillForm>) => ({ ...prev, ...now }),
    {
      date: new Date(),
      type,
      amount: '',
      descr: '',
      detail: [],
      memo: '',
    },
  );

  useEffect(() => {
    if (!!edit && 'detail' in edit)
      setState({
        date: new Date(edit.date),
        amount: String(edit.amount),
        descr: edit.descr,
        memo: edit.memo ?? '',
      });
  }, [edit]);

  useEffect(() => {
    const res = bookList.find((v) => v.id === id);
    if (res === undefined) navigate(`${Page.Book}/${id}`);
    else {
      setBook(res);
      setState({
        detail: res.members.map((v) => ({ id: v.id, side: 'latter', type: 'weight', value: '1' })),
      });
    }
  }, [id, bookList]);

  useEffect(() => {
    setState({ type });
  }, [type]);

  useEffect(() => {
    if (state.amount !== '') {
      setFormer(
        calculateAmount(
          state.amount,
          state.detail.filter((v) => v.side === 'former' && v.value !== ''),
        ),
      );
      setLatter(
        calculateAmount(
          state.amount,
          state.detail.filter((v) => v.side === 'latter' && v.value !== ''),
        ),
      );
    }
  }, [state]);

  const onChange = (date: Date) => {
    setState({ date });
  };

  const onSelectFormer = (e: ChangeEvent<HTMLSelectElement>) => {
    setState({
      detail: [
        ...state.detail.filter((v) => v.side === 'latter'),
        { id: e.target.value, side: 'former', type: 'weight', value: '1' },
      ],
    });
  };

  const onCustomize = (v: BillForm['detail']) => {
    if (modalType === 'former') setIsFormerCustomized(true);
    else setIsLatterCustomized(true);
    setState({ detail: [...state.detail.filter((v) => v.side !== modalType), ...v] });
    setModalType(undefined);
  };

  const onSubmit = () => {
    if (book === undefined || former === undefined || latter === undefined) return;
    if (edit)
      updateBill(book.id, edit.id, state, former, latter).then(() =>
        navigate(`${Page.Book}/${id}`),
      );
    else addBill(book.id, state, former, latter).then(() => navigate(`${Page.Book}/${id}`));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>時間: </div>
        <DatetimeInput defaultDate={state.date} onChange={onChange} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>項目: </div>
        <input
          className="border"
          value={state.descr}
          onChange={(e) => setState({ descr: e.target.value })}
        />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>金額: </div>
        <Input
          value={state.amount}
          onChange={(e) => setState({ amount: e.target.value })}
          regex={/^\d*\.?\d{0,2}$/}
        />
      </div>
      {book && (
        <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
          <div>先: </div>
          {isFormerCustomized ? (
            <div>客製化設定</div>
          ) : (
            <select defaultValue="" onChange={onSelectFormer}>
              <option disabled value="" hidden>
                請選擇
              </option>
              {book.members.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nickname}
                </option>
              ))}
            </select>
          )}
          <Button
            variant="contained"
            type="button"
            color="success"
            onClick={() => setModalType('former')}
          >
            客製化
          </Button>
        </div>
      )}
      <div style={{ border: '1px solid black', padding: 5, display: 'flex', gap: 10 }}>
        {former?.map((v) => (
          <div key={v.id}>{`${book?.members.find((m) => m.id === v.id)?.nickname} $${
            v.amount
          }`}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
        <div>後: </div>
        {isLatterCustomized ? <div>客製化設定</div> : <div>所有人均分</div>}
        <Button
          variant="contained"
          type="button"
          color="success"
          onClick={() => setModalType('latter')}
        >
          客製化
        </Button>
      </div>
      <div style={{ border: '1px solid black', padding: 5, display: 'flex', gap: 10 }}>
        {latter?.map((v) => (
          <div key={v.id}>{`${book?.members.find((m) => m.id === v.id)?.nickname} $${
            v.amount
          }`}</div>
        ))}
      </div>{' '}
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>備註: </div>
        <textarea
          className="border"
          value={state.memo}
          onChange={(e) => setState({ memo: e.target.value })}
        />
      </div>
      <Button variant="contained" type="button" onClick={onSubmit}>
        送出
      </Button>
      {book && modalType && (
        <BillModal
          open={true}
          onClose={() => setModalType(undefined)}
          member={book.members}
          side={modalType}
          onConfirm={onCustomize}
        />
      )}
    </div>
  );
};

export default Bill;
