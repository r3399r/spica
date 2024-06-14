import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Img from 'src/component/Img';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import IcAdd from 'src/image/ic-add.svg';
import IcCopyActive from 'src/image/ic-copy-active.svg';
import IcCopy from 'src/image/ic-copy.svg';
import IcEditActive from 'src/image/ic-edit-active.svg';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemoveActive from 'src/image/ic-remove-active.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { Member } from 'src/model/backend/entity/Member';
import { RootState } from 'src/redux/store';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import { getBankAccountList } from 'src/service/paymentService';
import ModalDelete from './ModalDelete';

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paymentList } = useSelector((rootState: RootState) => rootState.ui);
  const location = useLocation();
  const state = location.state as { user: Member } | null;
  const [targetId, setTargetId] = useState<string>();

  useEffect(() => {
    getBankAccountList(state?.user.deviceId ?? null);
  }, []);

  return (
    <>
      <div
        className={classNames('overflow-y-auto', {
          'fixed top-0 w-full h-[calc(100%-104px)]': !state,
        })}
      >
        <div className="mx-[15px] max-w-[640px] sm:mx-auto">
          <NavbarVanilla text={t('payment.back')} />
          <H2 className="mb-4 mt-5">
            {state ? t('payment.userPayment', { name: state.user.nickname }) : t('payment.head')}
          </H2>
          {paymentList?.length === 0 && (
            <Body className="text-center text-navy-300">{t('payment.noPayment')}</Body>
          )}
          {paymentList?.map((v) => (
            <div key={v.id} className="flex gap-[15px] border-b border-b-grey-300 py-[10px]">
              <div className="flex-1">
                <Body size="l">{v.bankCode}</Body>
                <Body className="text-navy-300">{v.accountNumber}</Body>
              </div>
              {!state && (
                <>
                  <Img
                    src={IcRemove}
                    srcActive={IcRemoveActive}
                    className="cursor-pointer"
                    onClick={() => setTargetId(v.id)}
                  />
                  <Img
                    src={IcEdit}
                    srcActive={IcEditActive}
                    className="cursor-pointer"
                    onClick={() => navigate('edit', { state: { target: v } })}
                  />
                </>
              )}
              {state && (
                <CopyToClipboard
                  text={v.accountNumber}
                  onCopy={() => dispatch(setSnackbarMessage(t('desc.copy')))}
                >
                  <Img src={IcCopy} srcActive={IcCopyActive} />
                </CopyToClipboard>
              )}
            </div>
          ))}
        </div>
      </div>
      {!state && (
        <div className="fixed bottom-0 h-[104px] w-full">
          <div className="mx-auto w-fit">
            <Button className="mt-5 h-12 w-64" onClick={() => navigate('edit')}>
              <div className="flex justify-center">
                <img src={IcAdd} />
                <Body size="l" bold className="text-white">
                  {t('payment.create')}
                </Body>
              </div>
            </Button>
          </div>
        </div>
      )}
      <ModalDelete
        open={targetId !== undefined}
        handleClose={() => setTargetId(undefined)}
        bankAccountId={targetId}
      />
    </>
  );
};

export default Payment;
