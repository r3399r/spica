import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'src/component/Button';
import Img from 'src/component/Img';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcBadge from 'src/image/ic-badge.svg';
import IcCrownActive from 'src/image/ic-crown-active.svg';
import IcCrown from 'src/image/ic-crown.svg';
import IcEditActive from 'src/image/ic-edit-active.svg';
import IcEdit from 'src/image/ic-edit.svg';
import IcRemoveActive from 'src/image/ic-remove-active.svg';
import IcRemoveDisabled from 'src/image/ic-remove-disabled.svg';
import IcRemove from 'src/image/ic-remove.svg';
import { Currency } from 'src/model/backend/entity/Currency';
import { loadBookById } from 'src/service/bookService';
import { removeCurrency, setPrimaryCurrency } from 'src/service/currencySettingService';
import ModalCurrency from './ModalCurrency';

const CurrencySetting = () => {
  const { t } = useTranslation();
  const book = useBook();
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<Currency>();
  const primaryCurrency = useMemo(
    () => book?.currencies?.find((v) => v.isPrimary === true),
    [book],
  );

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);

  const onClickPrimary = (cid: string) => () => {
    if (id === undefined) return;
    setPrimaryCurrency(id, cid);
  };

  const onClickEdit = (cid: string) => () => {
    setEditTarget(book?.currencies?.find((v) => v.id === cid));
    setOpen(true);
  };

  const onClickCreate = () => {
    setEditTarget(undefined);
    setOpen(true);
  };

  const onClickRemove = (cid: string) => () => {
    if (id === undefined) return;
    removeCurrency(id, cid);
  };

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <NavbarVanilla text={t('currencySetting.back')} />
      <H2 className="mb-5">{t('currencySetting.head')}</H2>
      {book?.currencies?.map((v) => (
        <div
          key={v.id}
          className="flex items-center justify-between border-b border-b-grey-300 py-[10px]"
        >
          <div>
            <div className="flex items-center gap-[15px]">
              <Body size="l">
                {v.name}
                {v.symbol}
              </Body>
              {v.isPrimary && <img src={IcBadge} />}
            </div>
            {!v.isPrimary && (
              <Body size="s">
                {v.name}/{primaryCurrency?.name} = {v.exchangeRate}
              </Body>
            )}
          </div>
          <div className="flex h-[24px] gap-[15px]">
            {!v.isPrimary && (
              <Img
                src={IcCrown}
                srcActive={IcCrownActive}
                className="cursor-pointer"
                onClick={onClickPrimary(v.id)}
              />
            )}
            {v.deletable ? (
              <Img
                src={IcRemove}
                srcActive={IcRemoveActive}
                className="cursor-pointer"
                onClick={onClickRemove(v.id)}
              />
            ) : (
              <img src={IcRemoveDisabled} />
            )}
            <Img
              src={IcEdit}
              srcActive={IcEditActive}
              className="cursor-pointer"
              onClick={onClickEdit(v.id)}
            />
          </div>
        </div>
      ))}
      <Button appearance="default" className="mt-[30px]" onClick={onClickCreate}>
        {t('currencySetting.create')}
      </Button>
      <ModalCurrency open={open} handleClose={() => setOpen(false)} editTarget={editTarget} />
    </div>
  );
};

export default CurrencySetting;
