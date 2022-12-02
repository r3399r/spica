import { Member } from '@y-celestial/spica-service';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FormInput from 'src/celestial-ui/component/FormInput';
import ModalForm from 'src/celestial-ui/component/ModalForm';
import { RenameMemberForm } from 'src/model/Form';
import { renameMember } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: () => void;
  target?: Member;
};

const ModalEditMember = ({ open, handleClose, target }: Props) => {
  const { t } = useTranslation();
  const methods = useForm<RenameMemberForm>();

  useEffect(() => {
    methods.setValue('nickname', target?.nickname ?? '');
  }, [target]);

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: RenameMemberForm) => {
    if (!target) return;
    renameMember(target.bookId, target.id, data.nickname).then(onClose);
  };

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={onClose}
      title={t('member.edit')}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.submit')}
    >
      <FormInput name="nickname" label={t('member.nickname')} autoFocus required />
    </ModalForm>
  );
};

export default ModalEditMember;
