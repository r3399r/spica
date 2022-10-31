import { Member } from '@y-celestial/spica-service';
import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/celestial-ui/ModalVanilla';
import { deleteMember } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: () => void;
  target?: Member;
};

const ModalDeleteMember = ({ open, handleClose, target }: Props) => {
  const { t } = useTranslation();

  const onDelete = () => {
    if (!target) return;
    deleteMember(target.bookId, target.id).then(handleClose);
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={handleClose}
      cancelBtn={t('act.cancel')}
      deleteBtn={t('act.delete')}
      onDelete={onDelete}
    >
      <div>{t('member.deleteHint', { nickname: target?.nickname })}</div>
    </ModalVanilla>
  );
};

export default ModalDeleteMember;
