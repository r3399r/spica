import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInput from 'src/celestial-ui/FormInput';
import ModalForm from 'src/celestial-ui/ModalForm';
import { NewBookForm } from 'src/model/Form';
import { createBook } from 'src/service/bookService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalNewBook = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
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
      title={t('bookList.newBook')}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.submit')}
    >
      <FormInput name="name" placeholder={t('bookList.name')} autoFocus required />
    </ModalForm>
  );
};

export default ModalNewBook;
