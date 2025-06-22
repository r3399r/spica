import { useDispatch, useSelector } from 'react-redux';
import ListItem from 'src/component/ListItem';
import Modal from 'src/component/Modal';
import { Member } from 'src/model/backend/entity/Member';
import { saveTransferFormData } from 'src/redux/formSlice';
import { RootState } from 'src/redux/store';

type Props = {
  open: boolean;
  onClose: () => void;
  members: Member[];
  side?: 'src' | 'dst';
};

const MemberSelectModal = ({ open, onClose, members, side }: Props) => {
  const dispatch = useDispatch();
  const { transferFormData } = useSelector((rootState: RootState) => rootState.form);

  const onClick = (id: string) => () => {
    dispatch(
      saveTransferFormData({
        srcMemberId: side === 'src' ? id : transferFormData.srcMemberId,
        dstMemberId: side === 'dst' ? id : transferFormData.dstMemberId,
      }),
    );
    onClose();
  };

  return (
    <Modal open={open} handleClose={onClose} showClose={false} px={false} className="py-[12px]">
      <>
        {members.map((v) => (
          <ListItem
            key={v.id}
            focus={
              side === 'src'
                ? transferFormData.srcMemberId === v.id
                : transferFormData.dstMemberId === v.id
            }
            onClick={onClick(v.id)}
          >
            {v.nickname}
          </ListItem>
        ))}
      </>
    </Modal>
  );
};

export default MemberSelectModal;
