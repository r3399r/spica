import { useTranslation } from 'react-i18next';
import H4 from 'src/component/celestial-ui/typography/H4';
import IcRemove from 'src/image/ic-remove.svg';

const DeleteBook = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between mb-[5px]">
        <H4>{t('bookSetting.deleteBook')}</H4>
        <img src={IcRemove} />
      </div>
    </>
  );
};

export default DeleteBook;
