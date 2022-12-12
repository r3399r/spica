import classNames from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Body from 'src/celestial-ui/component/typography/Body';
import H2 from 'src/celestial-ui/component/typography/H2';
import NavbarVanilla from 'src/component/NavbarVanilla';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import { setSettlementTab } from 'src/redux/uiSlice';
import { loadBookById } from 'src/service/bookService';
import Balance from './Balance';
import Check from './Check';

const Settlement = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { settlementTab: tab } = useSelector((rootState: RootState) => rootState.ui);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  return (
    <div className="max-w-[640px] mx-[15px] sm:mx-auto">
      <NavbarVanilla text={t('settlement.back')} />
      <H2>{t('settlement.head')}</H2>
      <div className="mt-5 mb-[25px] flex gap-[10px]">
        <Body
          bold
          className={classNames('w-full text-center py-1 rounded-[4px] cursor-pointer', {
            'bg-tan-300 text-navy-700': tab === 'check',
            'bg-grey-200 text-navy-900 text-opacity-30': tab === 'balance',
          })}
          onClick={() => dispatch(setSettlementTab('check'))}
        >
          {t('settlement.check')}
        </Body>
        <Body
          bold
          className={classNames('w-full text-center py-1 rounded-[4px] cursor-pointer', {
            'bg-tan-300 text-navy-700': tab === 'balance',
            'bg-grey-200 text-navy-900 text-opacity-30': tab === 'check',
          })}
          onClick={() => dispatch(setSettlementTab('balance'))}
        >
          {t('settlement.balance')}
        </Body>
      </div>
      {tab === 'check' && <Check />}
      {tab === 'balance' && <Balance />}
    </div>
  );
};

export default Settlement;
