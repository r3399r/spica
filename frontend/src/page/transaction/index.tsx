import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadBookById } from 'src/service/bookService';
import History from './History';
import Main from './Main';
import Navbar from './Navbar';

const Transaction = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id);
  }, [id]);

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <Navbar />
      <Main />
      <History />
    </div>
  );
};

export default Transaction;
