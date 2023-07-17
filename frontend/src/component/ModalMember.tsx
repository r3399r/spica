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
import Body from './typography/Body';

const ModalMember = () => {
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
      title={t('memberModal.head')}
      cancelBtn={t('memberModal.skip')}
      confirmBtn={t('act.submit')}
    >
      <>
        <Body size="l">{t('memberModal.hint')}</Body>
        <div className="my-[15px]">
          {members.map((v) => (
            <Radio
              key={v.id}
              {...methods.register('id')}
              id={v.id}
              label={v.nickname}
              value={v.id}
            />
          ))}
        </div>
      </>
    </ModalForm>
  );
};

export default ModalMember;
