import { Button } from '@mui/material';
import { GetBookIdResponse as Book } from '@y-celestial/spica-service';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { NewMemberForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { addMember, getBookById } from 'src/service/bookService';
import RenameBookModal from './component/RenameBookModal';

const BookSetting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [book, setBook] = useState<Book>();
  const { bookList } = useSelector((rootState: RootState) => rootState.book);
  const [renameBookOpen, setRenameBookOpen] = useState<boolean>(false);
  const { register, handleSubmit, control } = useForm<NewMemberForm>();
  const nickname = useWatch({
    control,
    name: 'nickname',
  });

  useEffect(() => {
    if (id === undefined) return;
    getBookById(id);
  }, [id]);

  useEffect(() => {
    if (id === undefined) return;
    setBook(bookList.find((v) => v.id === id));
  }, [bookList]);

  useEffect(() => {
    if (nickname === '' || nickname === undefined) setDisabled(true);
    else setDisabled(false);
  }, [nickname]);

  const onSubmit = (data: NewMemberForm) => {
    if (!book) return;
    setDisabled(true);
    addMember(book.id, data.nickname).finally(() => setDisabled(false));
  };

  return (
    <div>
      <Button variant="contained" type="button" onClick={() => navigate(`${Page.Book}/${id}`)}>
        回到帳本
      </Button>
      {book && (
        <div>
          <h1>設定</h1>
          <h2>帳本名稱</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <div>{book.name}</div>
            <div>
              <Button variant="contained" type="button" onClick={() => setRenameBookOpen(true)}>
                重新命名
              </Button>
            </div>
          </div>
          <h2>成員</h2>
          {book.members.length === 0 && <div>目前帳本中無任何成員，請新增</div>}
          {book.members.map((v) => (
            <div key={v.id}>{v.nickname}</div>
          ))}
          <form style={{ display: 'flex', gap: 10 }} onSubmit={handleSubmit(onSubmit)}>
            <input {...register('nickname')} placeholder="暱稱" autoComplete="off" />
            <Button variant="contained" type="submit" disabled={disabled}>
              新增成員
            </Button>
          </form>
          <h2>與好友共享</h2>
          <div>通行碼：{book.code}</div>
          <div>分享網址：{`${location.origin}${Page.Share}/${book.id}`}</div>
          <RenameBookModal
            open={renameBookOpen}
            onClose={() => setRenameBookOpen(false)}
            bookId={book.id}
          />
        </div>
      )}
    </div>
  );
};

export default BookSetting;
