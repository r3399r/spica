import { add, format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Body from 'src/component/typography/Body';
import H6 from 'src/component/typography/H6';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';

const SystemHint = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const book = useBook();
  const dateExpired = useMemo(
    () => (book ? format(add(new Date(book.lastDateUpdated), { years: 1 }), 'yyyy-MM-dd') : '-'),
    [book],
  );

  return (
    <>
      <div className="border-b border-b-grey-300 pt-5 pb-4">
        <div className="mb-[5px] flex justify-between">
          <H6>{t('bookSetting.systemDeleteDate')}</H6>
          <Body className="text-tomato-500">
            {book?.isPro ? t('bookSetting.permanent') : dateExpired}
          </Body>
        </div>
        <Body size="s" className="mb-4 text-navy-500">
          {t('bookSetting.systemDeleteHint')}
        </Body>
        <Button
          appearance="default"
          disabled={book?.isPro}
          onClick={() => navigate(`${Page.Book}/${book?.id}/upgrade`)}
        >
          {t('bookSetting.buttonUpgrade')}
        </Button>
      </div>
    </>
  );
};

export default SystemHint;
