import { ModalProps, Modal as MuiModal } from '@mui/material';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import IcClose from 'src/image/ic-close.svg';

type Props = ModalProps & {
  handleClose: () => void;
  showClose?: boolean;
  px?: boolean;
};

const Modal = ({
  children,
  handleClose,
  showClose = true,
  px = true,
  className,
  ...props
}: Props) => (
  <MuiModal
    className="fixed inset-0 flex items-center justify-center"
    onClose={() => handleClose()}
    {...props}
  >
    <div className="mx-[15px] max-h-[calc(100%-50px)] w-full overflow-auto rounded-[20px] bg-white outline-none sm:mx-auto sm:w-[610px]">
      {showClose && (
        <div className="relative h-[34px]">
          <img
            className="absolute bottom-0 right-[10px] cursor-pointer"
            src={IcClose}
            onClick={handleClose}
          />
        </div>
      )}
      <div
        className={twMerge(
          classNames({
            'pt-[20px]': !showClose,
            'px-5': px,
          }),
          className,
        )}
      >
        {children}
      </div>
    </div>
  </MuiModal>
);

export default Modal;
