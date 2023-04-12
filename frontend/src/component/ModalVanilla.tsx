import { ReactElement } from 'react';
import Button from './Button';
import Modal from './Modal';
import H2 from './typography/H2';

type Props = {
  open: boolean;
  handleClose: () => void;
  title?: string;
  children: ReactElement;
  cancelBtn?: string;
  confirmBtn?: string;
  deleteBtn?: string;
  onConfirm?: () => void;
  onDelete?: () => void;
};

const ModalVanilla = ({
  title,
  children,
  cancelBtn,
  confirmBtn,
  deleteBtn,
  handleClose,
  onConfirm,
  onDelete,
  ...props
}: Props) => (
  <Modal handleClose={handleClose} {...props}>
    <>
      {title && <H2 className="mb-[15px]">{title}</H2>}
      <div>{children}</div>
      {(cancelBtn || confirmBtn) && (
        <div className="flex justify-end pt-[10px] gap-[15px] pb-[30px] flex-wrap">
          {cancelBtn && (
            <Button appearance="secondary" onClick={handleClose} type="button">
              {cancelBtn}
            </Button>
          )}
          {deleteBtn && (
            <Button appearance="error" onClick={onDelete} type="button">
              {deleteBtn}
            </Button>
          )}
          {confirmBtn && (
            <Button appearance="default" onClick={onConfirm} type="button">
              {confirmBtn}
            </Button>
          )}
        </div>
      )}
    </>
  </Modal>
);

export default ModalVanilla;
