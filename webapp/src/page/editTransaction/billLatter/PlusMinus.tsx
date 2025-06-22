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
      <div className="mb-[15px] flex items-center gap-[10px] py-[10px]">
        <H5>{t('editTx.pm')}</H5>
        <Body className="flex min-h-[42px] flex-1 items-center border-l border-grey-300 pl-[10px]">
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
