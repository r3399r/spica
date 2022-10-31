import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/component/celestial-ui/typography/Body';
import H4 from 'src/component/celestial-ui/typography/H4';
import IcEdit from 'src/image/ic-edit.svg';
import { RootState } from 'src/redux/store';

const RenameBook = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);

  return (
    <>
      <div className="pt-5 pb-4 border-b border-b-grey-300">
        <div className="flex justify-between mb-[5px]">
          <H4>{t('bookSetting.bookName')}</H4>
          <img src={IcEdit} />
        </div>
        <Body size="l" className="text-navy-300 min-h-[24px]">
          {book?.name}
        </Body>
      </div>
    </>
  );
};

export default RenameBook;
