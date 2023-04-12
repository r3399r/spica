import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/ModalVanilla';
import { Member } from 'src/model/backend/entity/Member';
import { setMemberAsSelf } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: () => void;
  target?: Member;
  isSelf: boolean;
};

const ModalSelf = ({ open, handleClose, target, isSelf }: Props) => {
  const { t } = useTranslation();

  const onConfirm = () => {
    if (!target) return;
    setMemberAsSelf(target.bookId, target.id).then(handleClose);
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={handleClose}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.confirm')}
      onConfirm={onConfirm}
    >
      <div>
        {isSelf
          ? t('member.selfHint2', { nickname: target?.nickname })
          : t('member.selfHint1', { nickname: target?.nickname })}
      </div>
    </ModalVanilla>
  );
};

export default ModalSelf;
