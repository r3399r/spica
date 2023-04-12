import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Body from 'src/component/typography/Body';
import useBook from 'src/hook/useBook';
import IcCrown from 'src/image/ic-crown.svg';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemoveDisabled from 'src/image/ic-remove-disabled.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { Member } from 'src/model/backend/entity/Member';
import { RootState } from 'src/redux/store';
import { getDeviceId } from 'src/service/memberService';
import ModalDeleteMember from './ModalDeleteMember';
import ModalEditMember from './ModalEditMember';
import ModalSelf from './ModalSelf';

const MemberList = () => {
  const { t } = useTranslation();
  const book = useBook();
  const { isDeviceReady } = useSelector((rootState: RootState) => rootState.ui);
  const [selfTarget, setSelfTarget] = useState<Member>();
  const [editTarget, setEditTarget] = useState<Member>();
  const [deleteTarget, setDeleteTarget] = useState<Member>();
  const members = useMemo(() => book?.members, [book]);
  const self = useMemo(() => {
    if (!members || !isDeviceReady) return null;

    return members.find((v) => v.deviceId === getDeviceId())?.id ?? null;
  }, [members, isDeviceReady]);

  if (members === undefined) return <></>;

  if (members === null || members.length === 0)
    return <Body className="text-navy-300 py-[30px] text-center">{t('member.noMemberHint')}</Body>;

  return (
    <>
      <div className="px-[10px] mb-5">
        {members.map((v) => (
          <div
            key={v.id}
            className="py-[10px] flex justify-between border-b-[1px] border-b-grey-100"
          >
            <div className="flex gap-3 items-center">
              <Body bold size="l">
                {v.nickname}
              </Body>
              {v.id === self && (
                <Body size="s" className="px-1 py-[3px] bg-beige-300 text-tomato-700">
                  {t('member.self')}
                </Body>
              )}
            </div>
            <div className="flex gap-[15px]">
              {(v.id === self || !self) && (
                <img src={IcCrown} className="cursor-pointer" onClick={() => setSelfTarget(v)} />
              )}
              {v.deletable === true ? (
                <img src={IcRemove} className="cursor-pointer" onClick={() => setDeleteTarget(v)} />
              ) : (
                <img src={IcRemoveDisabled} />
              )}
              <img src={IcEdit} className="cursor-pointer" onClick={() => setEditTarget(v)} />
            </div>
          </div>
        ))}
      </div>
      <ModalEditMember
        open={!!editTarget}
        handleClose={() => setEditTarget(undefined)}
        target={editTarget}
      />
      <ModalDeleteMember
        open={!!deleteTarget}
        handleClose={() => setDeleteTarget(undefined)}
        target={deleteTarget}
      />
      <ModalSelf
        open={!!selfTarget}
        handleClose={() => setSelfTarget(undefined)}
        target={selfTarget}
        isSelf={selfTarget?.id === self}
      />
    </>
  );
};

export default MemberList;
