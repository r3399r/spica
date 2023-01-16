import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Switch from 'src/celestial-ui/component/Switch';
import H4 from 'src/celestial-ui/component/typography/H4';
import useBook from 'src/hook/useBook';
import { toggleShowDelete } from 'src/service/bookSettingService';

const ShowDeleted = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const book = useBook();

  const onToggle = () => {
    toggleShowDelete(id ?? 'xx');
  };

  return (
    <div className="pt-5 pb-4 border-b border-b-grey-300 flex justify-between mb-[5px]">
      <H4>{t('bookSetting.showDeleted')}</H4>
      <Switch defaultChecked={book?.showDelete} onChange={onToggle} />
    </div>
  );
};

export default ShowDeleted;
