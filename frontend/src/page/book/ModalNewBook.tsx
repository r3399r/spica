import { useForm } from 'react-hook-form';
import FormInput from 'src/component/form/FormInput';
import ModalForm from 'src/component/ModalForm';
import { NewBookForm } from 'src/model/Form';
import { createBook } from 'src/service/bookService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalNewBook = ({ open, handleClose }: Props) => {
  const methods = useForm<NewBookForm>();

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: NewBookForm) => {
    createBook(data.name).then(onClose);
  };

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={onClose}
      title="建立新帳本"
      cancelBtn="取消"
      confirmBtn="送出"
    >
      <FormInput name="name" placeholder="帳本名稱" autoFocus />
    </ModalForm>
  );
};

export default ModalNewBook;
