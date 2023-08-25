import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { NewMemberForm as FormType } from 'src/model/Form';
import { addMember } from 'src/service/memberService';

const NewMemberForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const methods = useForm<FormType>();
  const formData = useWatch({ control: methods.control });

  const onSubmit = (data: FormType) => {
    if (id === undefined) return;
    addMember(id, data.nickname).then(() => methods.reset());
  };

  return (
    <Form methods={methods} onSubmit={onSubmit} className="mb-4 flex items-center gap-[10px]">
      <div className="flex-1 pt-4">
        <FormInput name="nickname" placeholder={t('member.nickname')} required />
      </div>
      <div className="pt-4">
        <Button disabled={!formData.nickname} appearance="default">
          {t('member.create')}
        </Button>
      </div>
    </Form>
  );
};

export default NewMemberForm;
