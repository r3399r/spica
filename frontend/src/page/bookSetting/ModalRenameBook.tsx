import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInput from 'src/celestial-ui/component/FormInput';
import ModalForm from 'src/celestial-ui/component/ModalForm';
import { SavedBook } from 'src/model/Book';
import { RenameBookForm } from 'src/model/Form';
import { renameBook } from 'src/service/settingService';

type Props = {
  open: boolean;
  handleClose: () => void;
  book?: SavedBook;
};

const ModalRenameBook = ({ open, handleClose, book }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<RenameBookForm>();

  useEffect(() => {
    methods.setValue('name', book?.name ?? '');
  }, [open, book]);

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: RenameBookForm) => {
    if (!book) return;
    renameBook(book.id, data.name).then(onClose);
  };

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={onClose}
      title={t('bookSetting.rename')}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.submit')}
    >
      <FormInput name="name" label={t('bookSetting.bookName')} autoFocus required />
    </ModalForm>
  );
};

export default ModalRenameBook;
