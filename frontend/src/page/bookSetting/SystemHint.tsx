import add from 'date-fns/add';
import format from 'date-fns/format';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Body from 'src/celestial-ui/component/typography/Body';
import H6 from 'src/celestial-ui/component/typography/H6';
import useBook from 'src/hook/useBook';

const SystemHint = () => {
  const { t } = useTranslation();
  const book = useBook();
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
