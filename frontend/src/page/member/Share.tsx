import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'src/component/celestial-ui/Button';
import Body from 'src/component/celestial-ui/typography/Body';
import H4 from 'src/component/celestial-ui/typography/H4';
import { RootState } from 'src/redux/store';

const Share = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const code = useMemo(() => books?.find((v) => v.id === id)?.code, [id, books]);

  return (
    <div className="p-[10px] bg-grey-100 rounded-[15px]">
      <H4>{t('member.shareWithFriend')}</H4>
      <div className="mt-5 flex flex-col gap-[10px] items-center">
        <div className="bg-white w-[180px] p-[10px]">
          <QRCode value={'hi'} size={160} />
        </div>
        <Body>{t('member.scanHint')}</Body>
        <Button className="px-[15px] py-[5px] rounded-md">{t('member.shareLink')}</Button>
        <div className="flex">
          <Body>{t('member.code')}</Body>
          <Body bold className="text-tomato-500">
            {code ?? '-'}
          </Body>
        </div>
      </div>
    </div>
  );
};

export default Share;
