import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ModalVanilla from 'src/component/ModalVanilla';
import Body from 'src/component/typography/Body';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import { inviteFriend } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: (closeParent: boolean) => void;
  email: string;
};

const ModalInvite = ({ open, handleClose, email }: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();

  const onConfirm = () => {
    inviteFriend(id ?? 'xx', email, i18n.language).then(() => {
      dispatch(setSnackbarMessage(t('member.inviteSuccess')));
      handleClose(true);
    });
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={() => handleClose(false)}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.ok')}
      onConfirm={onConfirm}
    >
      <>
        <Body size="l">{t('member.invite1')}</Body>
        <Body size="l" className="mt-[15px] mb-5">
          {t('member.invite2', { email })}
        </Body>
      </>
    </ModalVanilla>
  );
};

export default ModalInvite;
