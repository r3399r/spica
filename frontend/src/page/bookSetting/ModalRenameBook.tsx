import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
import useBook from 'src/hook/useBook';
import { RenameBookForm } from 'src/model/Form';
import { renameBook } from 'src/service/bookSettingService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalRenameBook = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<RenameBookForm>();
  const book = useBook();

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
