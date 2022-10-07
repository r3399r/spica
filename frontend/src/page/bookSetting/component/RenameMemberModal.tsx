import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Modal from 'src/component/Modal';
import { RenameMemberForm } from 'src/model/Form';
import { renameMember } from 'src/service/settingService';

export type Props = {
  open: boolean;
  onClose: () => void;
  bookId: string;
  memberId: string;
};

const RenameMemberModal = ({ open, onClose, bookId, memberId }: Props) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const { register, handleSubmit, control, reset } = useForm<RenameMemberForm>();
  const nickname = useWatch({
    control,
    name: 'nickname',
  });

  useEffect(() => {
    if (nickname === '' || nickname === undefined) setDisabled(true);
    else setDisabled(false);
  }, [nickname]);

  const onSubmit = (data: RenameMemberForm) => {
    setDisabled(true);
    onClose();
    reset();
    renameMember(bookId, memberId, data.nickname).finally(() => setDisabled(false));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register('nickname')}
            autoComplete="off"
            style={{ border: '1px solid black' }}
          />
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

export default RenameMemberModal;
