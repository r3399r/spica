import { GetBookIdResponse } from '@y-celestial/spica-service';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById } from 'src/service/detailService';

const Detail = () => {
  const { id } = useParams();
  const [book, setBook] = useState<GetBookIdResponse>();

  useEffect(() => {
    if (id === undefined) return;
    getBookById(id).then((res) => setBook(res));
  }, [id]);

  return (
    <div>
      <div>帳目清單</div>
      <div>{book?.name}</div>
    </div>
  );
};

export default Detail;
