import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Input from 'src/component/Input';
import ModalForm from 'src/component/ModalForm';
import { SearchForm } from 'src/model/Form';

type Props = {
  open: boolean;
  handleClose: () => void;
  defaultQuery?: string;
  onSearch: (query: string) => void;
};

const ModalSearch = ({ open, handleClose, defaultQuery, onSearch }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<SearchForm>();

  useEffect(() => {
    if (defaultQuery) methods.setValue('q', defaultQuery);
    else methods.reset();
  }, [defaultQuery]);

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: SearchForm) => {
    onSearch(data.q);
    handleClose();
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
      <div className="mt-[10px] mb-5">
        <Input placeholder={t('searchModal.placeholder')} autoFocus {...methods.register('q')} />
      </div>
    </ModalForm>
  );
};

export default ModalSearch;
