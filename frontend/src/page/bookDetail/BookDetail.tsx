import { Button } from '@mui/material';
import { GetBookIdResponse as Book } from '@y-celestial/spica-service';
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>{book?.name}</h1>
        <div>
          <Button
            variant="contained"
            type="button"
            onClick={() => navigate(`${Page.Book}/${id}/setting`)}
          >
            設定
          </Button>
        </div>
      </div>
      <h2>餘額</h2>
      <h2>帳目清單</h2>
    </div>
  );
};

export default BookDetail;
