import { useTranslation } from 'react-i18next';
import Body from 'src/component/celestial-ui/typography/Body';
import H5 from 'src/component/celestial-ui/typography/H5';
import IcCross from 'src/image/ic-cross.svg';

type Props = {
  onCancel: () => void;
};

const Navbar = ({ onCancel }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mt-[15px] mb-5">
      <H5>{t('desc.sharer')}</H5>
      <div className="cursor-pointer flex" onClick={onCancel}>
        <img src={IcCross} />
        <Body size="l" bold>
          {t('act.cancel')}
        </Body>
      </div>
    </div>
  );
};

export default Navbar;
