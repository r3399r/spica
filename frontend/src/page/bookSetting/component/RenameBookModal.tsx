import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Modal from 'src/component/Modal';
import { RenameBookForm } from 'src/model/Form';
import { renameBook } from 'src/service/settingService';

export type Props = {
  open: boolean;
  onClose: () => void;
  bookId: string;
};

const RenameBookModal = ({ open, onClose, bookId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, control, reset } = useForm<RenameBookForm>();
  const nickname = useWatch({
    control,
    name: 'name',
  });

  useEffect(() => {
    if (nickname === '' || nickname === undefined) setDisabled(true);
    else setDisabled(false);
  }, [nickname]);

  const onSubmit = (data: RenameBookForm) => {
    setDisabled(true);
    onClose();
    reset();
    renameBook(bookId, data.name).finally(() => setDisabled(false));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register('name')} autoComplete="off" style={{ border: '1px solid black' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <Button variant="outlined" color="error" onClick={onClose} type="button">
            取消
          </Button>
          <Button variant="contained" type="submit" disabled={disabled}>
            確認
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RenameBookModal;
