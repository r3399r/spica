import { useTranslation } from 'react-i18next';
import Button from 'src/component/Button';
import NavbarVanilla from 'src/component/NavbarVanilla';
import Body from 'src/component/typography/Body';
import H2 from 'src/component/typography/H2';
import H4 from 'src/component/typography/H4';
import IcCopy from 'src/image/ic-copy.svg';
import IcWarning from 'src/image/ic-warning.svg';

const Upgrade = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-[15px] max-w-[640px] sm:mx-auto">
      <NavbarVanilla text={t('upgrade.back')} />
      <H2>{t('upgrade.head')}</H2>
      <div className="mt-4">
        <Body size="l">{t('upgrade.hintDesc')}</Body>
        <Body size="l" className="mt-4">
          {t('upgrade.hintHead')}
        </Body>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
          <li>{t('upgrade.hint1')}</li>
          <li>{t('upgrade.hint2')}</li>
          <li>{t('upgrade.hint3')}</li>
        </ul>
        <div className="mt-8 mb-4 bg-grey-100 p-[10px]">
          <div className="flex gap-[10px]">
            <img src={IcWarning} />
            <H4>{t('upgrade.warningHead')}</H4>
          </div>
          <Body size="l" className="mt-[10px]">
            {t('upgrade.warningDesc')}
          </Body>
          <Body className="mt-[26px]">{t('upgrade.codeHead')}</Body>
          <div className="mt-1 mb-4 flex gap-[5px] rounded-sm border border-navy-900/30 p-2">
            <Body className="flex-1 text-navy-300">aa</Body>
            <img src={IcCopy} className="cursor-pointer" />
          </div>
        </div>
        <Body className="mt-4 mb-5 text-navy-300">
          {t('upgrade.codeHint1')}{' '}
          <span className="cursor-pointer font-bold text-teal-500">{t('upgrade.codeHint2')}</span>{' '}
          {t('upgrade.codeHint3')}
        </Body>
        <Button appearance="default">{t('upgrade.goToUpgrade')}</Button>
      </div>
    </div>
  );
};

export default Upgrade;
