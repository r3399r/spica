import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import IcEdit from 'src/image/ic-edit-tx.svg';
import { RootState } from 'src/redux/store';
import { randomPick } from 'src/util/random';

type Props = {
  type: 'in' | 'out';
};

const Former = ({ type }: Props) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const members = useMemo(() => books?.find((v) => v.id === id)?.members, [books]);

  if (!members) return <></>;

  return (
    <>
      <Body className="mb-[5px] text-navy-700">
        {type === 'out' ? t('desc.payer') : t('desc.receiver')}
      </Body>
      <div className="flex justify-between gap-[10px]">
        <div className="ml-[10px] flex justify-between flex-1">
          <Body size="l">{randomPick(members).nickname}</Body>
          <Body size="l" className="text-navy-300">
            {t('newTx.all')}
          </Body>
        </div>
        <div>
          <img src={IcEdit} className="cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default Former;
