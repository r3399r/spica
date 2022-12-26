import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ModalForm from 'src/celestial-ui/component/ModalForm';
import Radio from 'src/celestial-ui/component/Radio';
import useBook from 'src/hook/useBook';
import { ReviseSymbolForm } from 'src/model/Form';
import { resetSymbol } from 'src/service/bookSettingService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalReviseSymbol = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<ReviseSymbolForm>();
  const book = useBook();

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
