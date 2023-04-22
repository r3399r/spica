import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'src/constant/Page';

const Share = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === undefined) return;
    navigate(Page.Book, { replace: true }); // add this to make back button work
    navigate(`${Page.Book}/${id}`);
  }, [id]);

  return <></>;
};

export default Share;
