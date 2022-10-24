import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from 'src/component/celestial-ui/Button';
import Form from 'src/component/celestial-ui/Form';
import FormInput from 'src/component/celestial-ui/FormInput';
import { NewMemberForm as FormType } from 'src/model/Form';

const NewMemberForm = () => {
  const { t } = useTranslation();
  const methods = useForm<FormType>();

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit} className="flex gap-[10px] items-center mb-4">
      <div className="flex-1">
        <FormInput name="nickname" placeholder={t('member.nickname')} />
      </div>
      <div className="pt-4">
        <Button>{t('member.create')}</Button>
      </div>
    </Form>
  );
};

export default NewMemberForm;
