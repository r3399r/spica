import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ModalForm from 'src/component/celestial-ui/ModalForm';
import Radio from 'src/component/celestial-ui/Radio';
import { SavedBook } from 'src/model/Book';
import { ReviseSymbolForm } from 'src/model/Form';
import { resetSymbol } from 'src/service/settingService';

type Props = {
  open: boolean;
  handleClose: () => void;
  book?: SavedBook;
};

const ModalReviseSymbol = ({ open, handleClose, book }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<ReviseSymbolForm>();

  useEffect(() => {
    methods.setValue('symbol', book?.symbol ?? '');
  }, [open, book]);

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: ReviseSymbolForm) => {
    if (!book) return;
    resetSymbol(book.id, data.symbol).then(onClose);
  };

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={onClose}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.submit')}
    >
      <>
        <Radio {...methods.register('symbol')} id="dollar" label="$" value="$" />
        <Radio {...methods.register('symbol')} id="euro" label="€" value="€" />
        <Radio {...methods.register('symbol')} id="yen" label="¥" value="¥" />
        <Radio {...methods.register('symbol')} id="won" label="₩" value="₩" />
        <Radio {...methods.register('symbol')} id="pound" label="£" value="£" />
        <Radio {...methods.register('symbol')} id="baht" label="฿" value="฿" />
      </>
    </ModalForm>
  );
};

export default ModalReviseSymbol;
