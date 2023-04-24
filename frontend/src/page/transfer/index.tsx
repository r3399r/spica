import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'src/component/Button';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import H4 from 'src/component/typography/H4';
import ModalIn from './ModalIn';
import ModalOut from './ModalOut';

const Transfer = () => {
  const { t } = useTranslation();
  const [openModalOut, setOpenModalOut] = useState<boolean>(false);
  const [openModalIn, setOpenModalIn] = useState<boolean>(false);

  return (
    <>
      <div className="max-w-[640px] mx-[15px] sm:mx-auto">
        <NavbarVanilla text={t('transfer.back')} />
        <H2 className="mt-5">{t('transfer.head')}</H2>
        <div className="pt-5 pb-4 border-b border-b-grey-300 flex gap-[15px] justify-between items-center">
          <div className="w-3/4">
            <H4 className="mb-[5px]">{t('transfer.outHead')}</H4>
            <Body size="l">{t('transfer.outHint')}</Body>
          </div>
          <div className="w-1/4 text-right">
            <Button
              appearance="default"
              className="px-[10px] py-[5px]"
              onClick={() => setOpenModalOut(true)}
            >
              {t('transfer.outBtn')}
            </Button>
          </div>
        </div>
        <div className="pt-5 pb-4 border-b border-b-grey-300 flex gap-[15px] justify-between items-center">
          <div className="w-3/4">
            <H4 className="mb-[5px]">{t('transfer.inHead')}</H4>
            <Body size="l">{t('transfer.inHint')}</Body>
          </div>
          <div className="w-1/4 text-right">
            <Button
              appearance="default"
              className="px-[10px] py-[5px]"
              onClick={() => setOpenModalIn(true)}
            >
              {t('transfer.inBtn')}
            </Button>
          </div>
        </div>
      </div>
      <ModalOut open={openModalOut} handleClose={() => setOpenModalOut(false)} />
      <ModalIn open={openModalIn} handleClose={() => setOpenModalIn(false)} />
    </>
  );
};

export default Transfer;
