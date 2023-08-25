import { ModalUnstyled, ModalUnstyledProps } from '@mui/base';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import IcClose from 'src/image/ic-close.svg';
import Backdrop from './Backdrop';

type Props = ModalUnstyledProps & {
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
  <ModalUnstyled
    className="fixed inset-0 z-10 flex items-center justify-center"
    slots={{ backdrop: Backdrop }}
    onClose={() => handleClose()}
    {...props}
  >
    <div className="mx-[15px] w-full rounded-[20px] bg-white outline-none sm:mx-auto sm:w-[610px]">
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
  </ModalUnstyled>
);

export default Modal;
