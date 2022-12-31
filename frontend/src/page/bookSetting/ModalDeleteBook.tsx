import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ModalVanilla from 'src/celestial-ui/component/ModalVanilla';
import Body from 'src/celestial-ui/component/typography/Body';
import { Page } from 'src/constant/Page';
import useBook from 'src/hook/useBook';
import IcWarning from 'src/image/ic-warning.svg';
import { deleteBook } from 'src/service/bookSettingService';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalDeleteBook = ({ open, handleClose }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const book = useBook();

  const onClose = () => {
    handleClose();
  };

  const onDelete = () => {
    if (!book) return;
    deleteBook(book.id);
    handleClose();
    navigate(Page.Book);
  };

  return (
    <ModalVanilla
      open={open}
      handleClose={onClose}
      title={t('bookSetting.deleteBook')}
      cancelBtn={t('act.cancel')}
      deleteBtn={t('act.delete')}
      onDelete={onDelete}
    >
      <div className="flex gap-[10px]">
        <div>
          <img src={IcWarning} />
        </div>
        <Body className="flex-1" size="l">
          {t('bookSetting.deleteHint')}
        </Body>
      </div>
    </ModalVanilla>
  );
};

export default ModalDeleteBook;
