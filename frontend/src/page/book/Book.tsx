import { Button } from '@mui/material';
import { GetBookResponse } from '@y-celestial/spica-service';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { NewBookForm } from 'src/model/Form';
import { createBook, getBookList } from 'src/service/bookService';

const Book = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [bookList, setBookList] = useState<GetBookResponse>();
  const { register, handleSubmit, control } = useForm<NewBookForm>();
  const name = useWatch({
    control,
    name: 'name',
  });

  useEffect(() => {
    getBookList().then((res) => setBookList(res));
  }, []);

  useEffect(() => {
    if (name === '' || name === undefined) setDisabled(true);
    else setDisabled(false);
  }, [name]);

  const onSubmit = (data: NewBookForm) => {
    setDisabled(true);
    createBook(data.name)
      .then((res) => {
        setBookList([...(bookList ?? []), res]);
      })
      .finally(() => setDisabled(false));
  };

  return (
    <div>
      <form style={{ display: 'flex', gap: 10 }} onSubmit={handleSubmit(onSubmit)}>
        <div>帳本名稱：</div>
        <input {...register('name')} />
        <Button variant="contained" type="submit" disabled={disabled}>
          新增帳本
        </Button>
      </form>
      {bookList &&
        bookList.map((v) => (
          <div key={v.id} style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <div>{v.name}</div>
            <Button
              variant="contained"
              type="button"
              onClick={() => navigate(`${Page.Book}/${v.id}`)}
            >
              GO
            </Button>
          </div>
        ))}
    </div>
  );
};

export default Book;
