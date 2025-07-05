import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Switch from 'src/component/Switch';
import H4 from 'src/component/typography/H4';
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
    <div className="mb-[5px] flex justify-between border-b border-b-grey-300 pt-5 pb-4">
      <H4>{t('bookSetting.showDeleted')}</H4>
      <Switch defaultChecked={book?.showDelete} onChange={onToggle} />
    </div>
  );
};

export default ShowDeleted;
