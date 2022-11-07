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
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const link = `${location.origin}/share/${id}`;

  const onShareLink = () => {
    if (!navigator.share || book === undefined) return;
    navigator.share({
      text: `與你共享帳本「${book.name}」，點擊連結後請輸入通行碼`,
      url: link,
    });
  };

  return (
    <div className="p-[10px] bg-grey-100 rounded-[15px]">
      <H4>{t('member.shareWithFriend')}</H4>
      <div className="mt-5 flex flex-col gap-[10px] items-center">
        <div className="bg-white w-[180px] p-[10px]">
          <QRCode value={`${link}?code=${book?.code}`} size={160} />
        </div>
        <Body>{t('member.scanHint')}</Body>
        <Button className="px-[15px] py-[5px] rounded-md" onClick={onShareLink}>
          {t('member.shareLink')}
        </Button>
        <div className="flex">
          <Body>{t('member.codeHint')}</Body>
          <Body bold className="text-tomato-500">
            {book?.code ?? '-'}
          </Body>
        </div>
      </div>
    </div>
  );
};

export default Share;