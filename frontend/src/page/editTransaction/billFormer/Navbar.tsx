import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Body from 'src/component/typography/Body';
import H5 from 'src/component/typography/H5';
import IcCross from 'src/image/ic-cross.svg';
import { RootState } from 'src/redux/store';

type Props = {
  onCancel: () => void;
};

const Navbar = ({ onCancel }: Props) => {
  const { t } = useTranslation();
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);

  return (
    <div className="mt-[15px] mb-5 flex justify-between">
      <H5>{billFormData.type === 'out' ? t('desc.payer') : t('desc.receiver')}</H5>
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
