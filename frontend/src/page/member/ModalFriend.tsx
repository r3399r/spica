import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import FormInput from 'src/component/FormInput';
import ModalForm from 'src/component/ModalForm';
import Body from 'src/component/typography/Body';
import IcSync from 'src/image/ic-sync.svg';
import IcWarning from 'src/image/ic-warning.svg';
import { FriendForm } from 'src/model/Form';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import { addFriendIntoBook } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalFriend = ({ open, handleClose }: Props) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const methods = useForm<FriendForm>();
  const dispatch = useDispatch();

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: FriendForm) => {
    addFriendIntoBook(id ?? 'xx', data.email)
      .then(() => {
        dispatch(setSnackbarMessage(t('member.shareSuccess')));
        onClose();
      })
      .catch(() => methods.setError('email', {}));
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
        <Body size="l">{t('member.friendHint')}</Body>
        <div className="my-[15px] rounded-[15px] bg-beige-300 p-[10px]">
          <div className="flex justify-center">
            <img src={IcWarning} />
          </div>
          <Body size="l" className="pb-[6px]" bold>
            {t('member.warning1')}
          </Body>
          <div className="gap-[5px]">
            <Body className="inline">{t('member.warning2')}</Body>
            <img className="mx-[5px] inline" src={IcSync} />
            <Body className="inline">{t('member.warning3')}</Body>
          </div>
        </div>
        <FormInput
          type="email"
          name="email"
          placeholder={t('member.emailPlaceholder')}
          autoFocus
          required
        />
      </>
    </ModalForm>
  );
};

export default ModalFriend;
