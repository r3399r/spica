import { ModalUnstyled, ModalUnstyledProps } from '@mui/base';
import classNames from 'classnames';
import IcClose from 'src/image/ic-close.svg';
import Backdrop from './Backdrop';

type Props = ModalUnstyledProps & {
  handleClose: () => void;
  showClose?: boolean;
  px?: boolean;
};

const Modal = ({ children, handleClose, showClose = true, px = true, ...props }: Props) => (
  <ModalUnstyled
    className="z-10 fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center"
    slots={{ backdrop: Backdrop }}
    onClose={() => handleClose()}
    {...props}
  >
    <div className="w-full mx-[15px] sm:w-[610px] sm:mx-auto bg-white rounded-[20px] outline-none">
      {showClose && (
        <div className="relative h-[34px]">
          <img
            className="absolute right-[10px] bottom-0 cursor-pointer"
            src={IcClose}
            onClick={handleClose}
          />
        </div>
      )}
      <div
        className={classNames({
          'pt-[20px]': !showClose,
          'px-5': px,
        })}
      >
        {children}
      </div>
    </div>
  </ModalUnstyled>
);

export default Modal;
