import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Body from 'src/celestial-ui/component/typography/Body';
import H4 from 'src/celestial-ui/component/typography/H4';
import IcEdit from 'src/image/ic-edit.svg';
import { getLanguageName } from 'src/service/systemService';
import ModalReviseSymbol from './ModalLanguage';

const Language = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="pt-5 pb-4 border-b border-b-grey-300">
        <div className="flex justify-between mb-[5px]">
          <H4>{t('systemSetting.language')}</H4>
          <img src={IcEdit} onClick={() => setOpen(true)} />
        </div>
        <Body size="l" className="text-navy-300 min-h-[24px]">
          {getLanguageName(i18n.language)}
        </Body>
      </div>
      <ModalReviseSymbol open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Language;
