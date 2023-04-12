import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Body from 'src/component/typography/Body';
import useBook from 'src/hook/useBook';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemoveDisabled from 'src/image/ic-remove-disabled.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { Member } from 'src/model/backend/entity/Member';
import ModalDeleteMember from './ModalDeleteMember';
import ModalEditMember from './ModalEditMember';

const MemberList = () => {
  const { t } = useTranslation();
  const book = useBook();
  const members = useMemo(() => book?.members, [book]);
  const [editTarget, setEditTarget] = useState<Member>();
  const [deleteTarget, setDeleteTarget] = useState<Member>();

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
            <div>{v.nickname}</div>
            <div className="flex gap-[15px]">
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
    </>
  );
};

export default MemberList;
