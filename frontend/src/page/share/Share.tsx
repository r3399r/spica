import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { ShareForm } from 'src/model/Form';
import { init, setShareBook } from 'src/service/shareService';

const Share = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string>();
  const [hasError, setHasError] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<ShareForm>();

  useEffect(() => {
    if (id === undefined) return;
    init(id)
      .then((res) => setName(res.name))
      .catch((err) => {
        if (err === 'ALREADY_OWN') navigate(`${Page.Book}/${id}`);
        else navigate(Page.Book);
      });
  }, [id]);

  const onSubmit = (data: ShareForm) => {
    if (!id) return;
    setHasError(false);
    setShareBook(id, data.code)
      .then(() => navigate(`${Page.Book}/${id}`))
      .catch(() => setHasError(true));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>加入此帳本？</div>
      <div>帳本名：{name}</div>
      <input {...register('code')} placeholder="通行碼" />
      <div>
        <Button variant="contained" type="submit">
          確認
        </Button>
      </div>
      {hasError && <div>有錯！</div>}
    </form>
  );
};

export default Share;
