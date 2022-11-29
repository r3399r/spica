import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Body from 'src/celestial-ui/component/typography/Body';
import H5 from 'src/celestial-ui/component/typography/H5';
import IcCross from 'src/image/ic-cross.svg';
import { RootState } from 'src/redux/store';

type Props = {
  onCancel: () => void;
};

const Navbar = ({ onCancel }: Props) => {
  const { t } = useTranslation();
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);

  return (
    <div className="flex justify-between mt-[15px] mb-5">
      <H5>{billFormData.type === 'out' ? t('desc.payer') : t('desc.receiver')}</H5>
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
