import { useTranslation } from 'react-i18next';
import ModalVanilla from 'src/component/ModalVanilla';
import Body from 'src/component/typography/Body';
import { Member } from 'src/model/backend/entity/Member';
import { setMemberAsVisible } from 'src/service/memberService';

type Props = {
  open: boolean;
  handleClose: () => void;
  target?: Member;
};

const ModalSetMemberVisible = ({ open, handleClose, target }: Props) => {
  const { t } = useTranslation();

  const onSetVisible = () => {
    if (!target) return;
    setMemberAsVisible(target.bookId, target.id).then(handleClose);
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={handleClose}
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.confirm')}
      onConfirm={onSetVisible}
    >
      <Body size="l">
        {t(target?.visible === true ? 'member.setInvisibleHint' : 'member.setVisibleHint', {
          nickname: target?.nickname,
        })}
      </Body>
    </ModalVanilla>
  );
};

export default ModalSetMemberVisible;
