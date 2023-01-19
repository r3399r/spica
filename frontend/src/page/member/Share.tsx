import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Button from 'src/celestial-ui/component/Button';
import Body from 'src/celestial-ui/component/typography/Body';
import H4 from 'src/celestial-ui/component/typography/H4';
import useBook from 'src/hook/useBook';

const Share = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const book = useBook();
  const link = `${location.origin}/share/${id}`;

  const onShareLink = () => {
    if (!navigator.share || book === undefined) return;
    navigator.share({
      text: t('member.shareText', { book: book.name }),
      url: link,
    });
  };

  return (
    <div className="p-[10px] bg-grey-100 rounded-[15px]">
      <H4>{t('member.shareWithFriend')}</H4>
      <div className="mt-5 flex flex-col gap-[10px] items-center">
        <CopyToClipboard text={link}>
          <Button className="px-[15px] py-[5px] rounded-md" onClick={onShareLink}>
            {t('member.shareLink')}
          </Button>
        </CopyToClipboard>
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
