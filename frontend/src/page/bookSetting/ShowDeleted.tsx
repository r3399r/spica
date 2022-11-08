import { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Switch from 'src/component/celestial-ui/Switch';
import H4 from 'src/component/celestial-ui/typography/H4';
import { getLocalBookById, setShowDeleted } from 'src/util/localStorage';

const ShowDeleted = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const book = useMemo(() => getLocalBookById(id ?? 'xx'), [id]);

  const onCheck = (ev: ChangeEvent<HTMLInputElement>) => {
    setShowDeleted(id ?? 'xx', ev.target.checked);
  };

  return (
    <div className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between mb-[5px]">
      <H4>{t('bookSetting.showDeleted')}</H4>
      <Switch defaultChecked={book?.showDeleted} onChange={onCheck} />
    </div>
  );
};

export default ShowDeleted;
