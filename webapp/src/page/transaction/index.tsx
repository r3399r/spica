import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { loadBookById } from 'src/service/bookService';
import History from './History';
import Main from './Main';
import Navbar from './Navbar';

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <Navbar />
      <Main />
      <History />
    </div>
  );
};

export default Transaction;
