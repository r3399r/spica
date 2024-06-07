import { useEffect, useState } from 'react';
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
import IcEditActive from 'src/image/ic-edit-active.svg';
import IcEdit from 'src/image/ic-edit.svg';
import { loadBookById } from 'src/service/bookService';
import ModalCreateCurrency from './ModalCreateCurrency';

const CurrencySetting = () => {
  const { t } = useTranslation();
  const book = useBook();
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (id === undefined) return;
    loadBookById(id).catch(() => navigate(Page.Book, { replace: true }));
  }, [id]);
  console.log(book);

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <NavbarVanilla text={t('currencySetting.back')} />
      <H2 className="mb-5">{t('currencySetting.head')}</H2>
      {book?.currencies?.map((v) => (
        <div
          key={v.id}
          className="flex cursor-pointer justify-between border-b border-b-grey-300 py-[10px]"
        >
          <div className="flex items-center gap-[15px]">
            <Body size="l">
              {v.name}
              {v.symbol}
            </Body>
            {v.isPrimary && <img src={IcBadge} />}
          </div>
          <Img src={IcEdit} srcActive={IcEditActive} />
        </div>
      ))}
      <Button appearance="default" className="mt-[30px]" onClick={() => setOpen(true)}>
        {t('currencySetting.create')}
      </Button>
      <ModalCreateCurrency open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default CurrencySetting;
