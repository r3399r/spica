import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import useQuery from 'src/hook/useQuery';
import { RootState } from 'src/redux/store';
import { addBook } from 'src/service/shareService';

const Share = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);
  const query = useQuery<{ code?: string }>();

  useEffect(() => {
    if (id === undefined || !isDeviceReady) return;
    if (query.code === undefined) navigate(Page.Book, { replace: true });
    else
      addBook(id, query.code)
        .then(() => {
          navigate(Page.Book, { replace: true }); // add this to make back button work
          navigate(`${Page.Book}/${id}`);
        })
        .catch(() => navigate(Page.Book, { replace: true }));
  }, [id, isDeviceReady]);

  return <></>;
};

export default Share;
