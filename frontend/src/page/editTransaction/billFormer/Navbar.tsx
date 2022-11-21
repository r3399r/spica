import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Body from 'src/component/celestial-ui/typography/Body';
import H5 from 'src/component/celestial-ui/typography/H5';
import IcCross from 'src/image/ic-cross.svg';
import { RootState } from 'src/redux/store';
import { setTxState } from 'src/redux/uiSlice';

const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { billFormData } = useSelector((rootState: RootState) => rootState.form);

  return (
    <div className="flex justify-between mt-[15px] mb-5">
      <H5>{billFormData.type === 'out' ? t('desc.payer') : t('desc.receiver')}</H5>
      <div className="cursor-pointer flex" onClick={() => dispatch(setTxState('main'))}>
        <img src={IcCross} />
        <Body size="l" bold>
          {t('act.cancel')}
        </Body>
      </div>
    </div>
  );
};

export default Navbar;
