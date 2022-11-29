import { add, format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Body from 'src/celestial-ui/component/typography/Body';
import H6 from 'src/celestial-ui/component/typography/H6';
import { RootState } from 'src/redux/store';

const SystemHint = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { books } = useSelector((rootState: RootState) => rootState.book);
  const book = useMemo(() => books?.find((v) => v.id === id), [id, books]);
  const dateExpired = useMemo(
    () => (book ? format(add(new Date(book.lastDateUpdated), { days: 100 }), 'yyyy-MM-dd') : '-'),
    [book],
  );

  return (
    <>
      <div className="pt-5 pb-4 border-b border-b-grey-300">
        <div className="flex justify-between mb-[5px]">
          <H6>{t('bookSetting.systemDeleteDate')}</H6>
          <Body className="text-tomato-500">{dateExpired}</Body>
        </div>
        <Body size="s" className="text-navy-500">
          {t('bookSetting.systemDeleteHint')}
        </Body>
      </div>
    </>
  );
};

export default SystemHint;
