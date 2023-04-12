import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
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
    createBook({
      bookName: data.bookName,
      nickname: data.nickname.length > 0 ? data.nickname : undefined,
    }).then(onClose);
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
      <>
        <FormInput
          name="bookName"
          placeholder={t('bookList.bookName')}
          autoFocus
          required
          className="mb-5"
        />
        <FormInput
          name="nickname"
          placeholder={t('bookList.nickname')}
          helper={t('bookList.nicknameHelper')}
        />
      </>
    </ModalForm>
  );
};

export default ModalNewBook;
