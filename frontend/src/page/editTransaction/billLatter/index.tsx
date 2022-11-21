import { useTranslation } from 'react-i18next';
import Button from 'src/component/celestial-ui/Button';
import Navbar from './Navbar';

const BillLatter = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-10 flex gap-5">
          <Button className="mt-5 w-full h-12 text-base" appearance="secondary">
            {t('act.reset')}
          </Button>
          <Button className="mt-5 w-full h-12 text-base">{t('act.confirm')}</Button>
        </div>
      </div>
    </>
  );
};

export default BillLatter;
