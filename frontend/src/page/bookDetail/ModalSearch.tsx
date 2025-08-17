import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
import { SearchForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';

type Props = {
  open: boolean;
  handleClose: () => void;
  onSearch: (query: string) => void;
};

const ModalSearch = ({ open, handleClose, onSearch }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<SearchForm>();
  const { searchQuery } = useSelector((root: RootState) => root.ui);

  useEffect(() => {
    if (searchQuery) methods.setValue('q', searchQuery);
    else methods.reset();
  }, [searchQuery]);

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
        <FormInput
          placeholder={t('searchModal.placeholder')}
          autoFocus
          name="q"
          required
          defaultValue={searchQuery ?? ''}
        />
      </div>
    </ModalForm>
  );
};

export default ModalSearch;
