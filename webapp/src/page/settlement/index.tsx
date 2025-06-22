import classNames from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
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
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <NavbarVanilla text={t('settlement.back')} />
      <div className="mt-5 mb-[25px] flex gap-[10px]">
        <Body
          bold
          className={classNames('w-full cursor-pointer rounded-[4px] py-1 text-center', {
            'bg-tan-300 text-navy-700': tab === 'balance',
            'text-opacity-30 bg-grey-200 text-navy-900': tab === 'check',
          })}
          onClick={() => dispatch(setSettlementTab('balance'))}
        >
          {t('settlement.balance')}
        </Body>
        <Body
          bold
          className={classNames('w-full cursor-pointer rounded-[4px] py-1 text-center', {
            'bg-tan-300 text-navy-700': tab === 'check',
            'text-opacity-30 bg-grey-200 text-navy-900': tab === 'balance',
          })}
          onClick={() => dispatch(setSettlementTab('check'))}
        >
          {t('settlement.check')}
        </Body>
      </div>
      {tab === 'balance' && <Balance />}
      {tab === 'check' && <Check />}
    </div>
  );
};

export default Settlement;
