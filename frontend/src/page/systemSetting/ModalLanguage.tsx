import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ModalForm from 'src/celestial-ui/component/ModalForm';
import Radio from 'src/celestial-ui/component/Radio';
import { Language } from 'src/constant/Language';
import { LanguageForm } from 'src/model/Form';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalLanguage = ({ open, handleClose }: Props) => {
  const { t, i18n } = useTranslation();
  const methods = useForm<LanguageForm>();

  useEffect(() => {
    methods.setValue('language', i18n.language);
  }, [open]);

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: LanguageForm) => {
    i18n.changeLanguage(data.language).then(onClose);
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
        {Language.map((v) => (
          <Radio
            key={v.code}
            {...methods.register('language')}
            id={v.code}
            label={v.name}
            value={v.code}
          />
        ))}
      </>
    </ModalForm>
  );
};

export default ModalLanguage;
