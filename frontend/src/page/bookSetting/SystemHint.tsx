import { add, format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Body from 'src/component/typography/Body';
import H6 from 'src/component/typography/H6';
import useBook from 'src/hook/useBook';

const SystemHint = () => {
  const { t } = useTranslation();
  const book = useBook();
  const dateExpired = useMemo(
    () => (book ? format(add(new Date(book.lastDateUpdated), { years: 1 }), 'yyyy-MM-dd') : '-'),
    [book],
  );

  return (
    <>
      <div className="border-b border-b-grey-300 pb-4 pt-5">
        <div className="mb-[5px] flex justify-between">
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
