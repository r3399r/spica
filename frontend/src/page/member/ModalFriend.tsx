import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
import Body from 'src/component/typography/Body';
import IcConfig from 'src/image/ic-config.svg';
import { FriendForm } from 'src/model/Form';
import { addFriendIntoBook } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalFriend = ({ open, handleClose }: Props) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const methods = useForm<FriendForm>();

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: FriendForm) => {
    addFriendIntoBook(id ?? 'xx', data.id)
      .then(onClose)
      .catch(() => methods.setError('id', {}));
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
        <div className="flex gap-1 items-center mb-[30px]">
          <Body size="l">{t('member.friendHint')}</Body>
          <img src={IcConfig} />
        </div>
        <FormInput name="id" placeholder={t('member.friendPlaceholder')} autoFocus required />
      </>
    </ModalForm>
  );
};

export default ModalFriend;
