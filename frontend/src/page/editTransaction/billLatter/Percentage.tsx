import { useTranslation } from 'react-i18next';
import Divider from 'src/celestial-ui/component/Divider';
import Body from 'src/celestial-ui/component/typography/Body';
import H5 from 'src/celestial-ui/component/typography/H5';
import Amount from './Amount';
import SplitMix from './SplitMix';

const Percentage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-[10px] items-center py-[10px] mb-[15px]">
        <H5>{t('editTx.pct')}</H5>
        <Body className="flex-1 border-l border-grey-300 pl-[10px] min-h-[42px] flex items-center">
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
