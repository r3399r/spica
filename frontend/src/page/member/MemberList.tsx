import { Member } from '@y-celestial/spica-service/lib/src/model/entity/Member';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemoveDisabled from 'src/image/ic-remove-disabled.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { RootState } from 'src/redux/store';
import ModalEditMember from './ModalEditMember';

const MemberList = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members ?? null, [books]);
  const [target, setTarget] = useState<Member>();

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
              <img src={IcEdit} className="cursor-pointer" onClick={() => setTarget(v)} />
              {v.deletable === true ? (
                <img src={IcRemove} className="cursor-pointer" />
              ) : (
                <img src={IcRemoveDisabled} className="cursor-pointer" />
              )}
            </div>
          </div>
        ))}
      </div>
      <ModalEditMember open={!!target} handleClose={() => setTarget(undefined)} target={target} />
    </>
  );
};

export default MemberList;
