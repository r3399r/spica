import { useTranslation } from 'react-i18next';
import Divider from 'src/component/Divider';
import Body from 'src/component/typography/Body';
import H5 from 'src/component/typography/H5';
import Amount from './Amount';
import SplitAdjust from './SplitAdjust';

const PlusMinus = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-[10px] items-center py-[10px] mb-[15px]">
        <H5>{t('editTx.pm')}</H5>
        <Body className="flex-1 border-l border-grey-300 pl-[10px] min-h-[42px] flex items-center">
          {t('editTx.pmDesc')}
        </Body>
      </div>
      <Amount />
      <Divider className="my-[15px]" />
      <SplitAdjust />
    </>
  );
};

export default PlusMinus;
