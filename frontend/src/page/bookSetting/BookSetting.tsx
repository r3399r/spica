import { Button } from '@mui/material';
import { GetBookIdResponse as Book } from '@y-celestial/spica-service';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import H1 from 'src/component/celestial-ui/typography/H1';
import H2 from 'src/component/celestial-ui/typography/H2';
import { Page } from 'src/constant/Page';
import { NewMemberForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { addMember, deleteMember, getBookById } from 'src/service/bookService';
import RenameBookModal from './component/RenameBookModal';
import RenameMemberModal from './component/RenameMemberModal';

const BookSetting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [book, setBook] = useState<Book>();
  const { bookList } = useSelector((rootState: RootState) => rootState.book);
  const [renameBookOpen, setRenameBookOpen] = useState<boolean>(false);
  const [renameMemberId, setRenameMemberId] = useState<string>();
  const { register, handleSubmit, control, reset } = useForm<NewMemberForm>();
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
    reset();
    addMember(book.id, data.nickname).finally(() => setDisabled(false));
  };

  const onShare = () => {
    if (navigator.share)
      navigator
        .share({
          text: `與你共享帳本「${book?.name}」，點擊連結後請輸入通行碼`,
          url: `${location.origin}${Page.Share}/${book?.id}`,
        })
        .then(() => {
          console.log('Successful share');
        })
        .catch((error) => {
          console.log('Error sharing', error);
        });
  };

  return (
    <div>
      <Button variant="contained" type="button" onClick={() => navigate(`${Page.Book}/${id}`)}>
        回到帳本
      </Button>
      {book && (
        <div>
          <H1>設定</H1>
          <H2>帳本名稱</H2>
          <div style={{ display: 'flex', gap: 10 }}>
            <div>{book.name}</div>
            <div>
              <Button variant="contained" type="button" onClick={() => setRenameBookOpen(true)}>
                重新命名
              </Button>
            </div>
          </div>
          <H2>成員</H2>
          {book.members.length === 0 && <div>目前帳本中無任何成員，請新增</div>}
          {book.members.map((v) => (
            <div key={v.id} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div>{v.nickname}</div>
              <Button variant="contained" type="button" onClick={() => setRenameMemberId(v.id)}>
                重新命名
              </Button>
              <Button
                variant="contained"
                type="button"
                color="error"
                disabled={!v.deletable}
                onClick={() => deleteMember(v.id, v.bookId)}
              >
                刪除
              </Button>
            </div>
          ))}
          <form style={{ display: 'flex', gap: 10 }} onSubmit={handleSubmit(onSubmit)}>
            <input
              className="border"
              {...register('nickname')}
              placeholder="暱稱"
              autoComplete="off"
            />
            <Button variant="contained" type="submit" disabled={disabled}>
              新增
            </Button>
          </form>
          <H2>與好友共享</H2>
          <div>通行碼：{book.code}</div>
          <div>分享網址：{`${location.origin}${Page.Share}/${book.id}`}</div>
          <Button variant="contained" onClick={onShare}>
            Share
          </Button>
          <RenameBookModal
            open={renameBookOpen}
            onClose={() => setRenameBookOpen(false)}
            bookId={book.id}
          />
          <RenameMemberModal
            open={renameMemberId !== undefined}
            onClose={() => setRenameMemberId(undefined)}
            bookId={book.id}
            memberId={renameMemberId ?? 'xx'}
          />
        </div>
      )}
    </div>
  );
};

export default BookSetting;
