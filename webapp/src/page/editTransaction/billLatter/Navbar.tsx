import { useTranslation } from 'react-i18next';
import Body from 'src/component/typography/Body';
import H5 from 'src/component/typography/H5';
import IcCross from 'src/image/ic-cross.svg';

type Props = {
  onCancel: () => void;
};

const Navbar = ({ onCancel }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="mb-5 mt-[15px] flex justify-between">
      <H5>{t('desc.sharer')}</H5>
      <div className="flex cursor-pointer" onClick={onCancel}>
        <img src={IcCross} />
        <Body size="l" bold>
          {t('act.cancel')}
        </Body>
      </div>
    </div>
  );
};

export default Navbar;
