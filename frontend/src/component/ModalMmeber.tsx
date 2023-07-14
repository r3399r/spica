import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ModalForm from 'src/component/ModalForm';
import Radio from 'src/component/Radio';
import useBook from 'src/hook/useBook';
import { MemberSelectForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { setShowMemberModal } from 'src/redux/uiSlice';
import { setMemberAsSelf } from 'src/service/memberService';

const ModalMmeber = () => {
  const dispatch = useDispatch();
  const { showMemberModal: open } = useSelector((rootState: RootState) => rootState.ui);
  const { t } = useTranslation();
  const methods = useForm<MemberSelectForm>();
  const book = useBook();
  const members = useMemo(() => book?.members, [book]);

  const handleClose = () => {
    dispatch(setShowMemberModal(false));
  };

  const onClose = () => {
    handleClose();
    methods.reset();
  };

  const onSubmit = (data: MemberSelectForm) => {
    if (!book) return;
    setMemberAsSelf(book.id, data.id).then(onClose);
  };

  if (!members) return <></>;

  return (
    <ModalForm
      methods={methods}
      onSubmit={onSubmit}
      open={open}
      handleClose={onClose}
      title="gi"
      cancelBtn={t('act.cancel')}
      confirmBtn={t('act.submit')}
    >
      <>
        {members.map((v) => (
          <Radio key={v.id} {...methods.register('id')} id={v.id} label={v.nickname} value={v.id} />
        ))}
      </>
    </ModalForm>
  );
};

export default ModalMmeber;
