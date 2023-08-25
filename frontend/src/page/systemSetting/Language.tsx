import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Img from 'src/component/Img';
import Body from 'src/component/typography/Body';
import H4 from 'src/component/typography/H4';
import IcEditActive from 'src/image/ic-edit-active.svg';
import IcEdit from 'src/image/ic-edit.svg';
import ModalReviseSymbol from './ModalLanguage';

const Language = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className="cursor-pointer border-b border-b-grey-300 pb-4 pt-5"
        onClick={() => setOpen(true)}
      >
        <div className="mb-[5px] flex justify-between">
          <H4>{t('systemSetting.language')}</H4>
          <Img src={IcEdit} srcActive={IcEditActive} />
        </div>
        <Body size="l" className="min-h-[24px] text-navy-300">
          {t('language')}
        </Body>
      </div>
      <ModalReviseSymbol open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Language;
