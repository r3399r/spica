import { useTranslation } from 'react-i18next';
import Divider from 'src/component/Divider';
import Body from 'src/component/typography/Body';
import H5 from 'src/component/typography/H5';
import Amount from './Amount';
import SplitMix from './SplitMix';

const Percentage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-[15px] flex items-center gap-[10px] py-[10px]">
        <H5>{t('editTx.pct')}</H5>
        <Body className="flex min-h-[42px] flex-1 items-center border-l border-grey-300 pl-[10px]">
          {t('editTx.pctDesc')}
        </Body>
      </div>
      <Amount />
      <Divider className="my-[15px]" />
      <SplitMix mode="pct" />
    </>
  );
};

export default Percentage;
