import { useTranslation } from 'react-i18next';
import Button from 'src/component/celestial-ui/Button';
import Body from 'src/component/celestial-ui/typography/Body';
import Navbar from './Navbar';

const NewTransaction = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="fixed top-0 h-[calc(100%-104px)] w-full overflow-y-auto">
        <div className="max-w-[640px] mx-[15px] sm:mx-auto">
          <Navbar />
        </div>
      </div>
      <div className="fixed bottom-0 h-[104px] w-full">
        <div className="mx-auto w-fit">
          <Button className="mt-5 w-64 h-12">
            <div className="flex justify-center">
              <Body size="l" bold className="text-white">
                {t('act.submit')}
              </Body>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewTransaction;
