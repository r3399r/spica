import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ModalVanilla from 'src/component/celestial-ui/ModalVanilla';
import Body from 'src/component/celestial-ui/typography/Body';
import { Page } from 'src/constant/Page';
import IcWarning from 'src/image/ic-warning.svg';
import { SavedBook } from 'src/model/Book';
import { deleteBook } from 'src/service/settingService';

type Props = {
  open: boolean;
  handleClose: () => void;
  book?: SavedBook;
};

const ModalDeleteBook = ({ open, handleClose, book }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
