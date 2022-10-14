import { ReactElement } from 'react';
import Button from './Button';
import Modal from './Modal';
import H2 from './typography/H2';

type Props = {
  open: boolean;
  handleClose: () => void;
  title?: string;
  children: ReactElement;
  leftBtn?: string;
  rightBtn?: string;
};

const ModalVanilla = ({ title, children, leftBtn, rightBtn, handleClose, ...props }: Props) => (
  <Modal handleClose={handleClose} {...props}>
    <div>
      {title && <H2 className="mb-[15px]">{title}</H2>}
      <div className="pb-[20px]">{children}</div>
      {(leftBtn || rightBtn) && (
        <div className="flex justify-end pt-[10px] gap-[15px] pb-[30px] flex-wrap">
          {leftBtn && (
            <Button appearance="secondary" onClick={handleClose}>
              {leftBtn}
            </Button>
          )}
          {rightBtn && <Button appearance="default">{rightBtn}</Button>}
        </div>
      )}
    </div>
  </Modal>
);

export default ModalVanilla;
