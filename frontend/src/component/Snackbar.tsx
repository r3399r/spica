import { SnackbarUnstyled, SnackbarUnstyledProps } from '@mui/base';
import classNames from 'classnames';
import { ReactElement, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';

type Props = SnackbarUnstyledProps & {
  children: ReactElement;
};

const Snackbar = ({ open, children, ...props }: Props) => {
  const [exited, setExited] = useState(true);
  const nodeRef = useRef(null);

  const handleOnEnter = () => {
    setExited(false);
  };

  const handleOnExited = () => {
    setExited(true);
  };

  return (
    <SnackbarUnstyled
      className="fixed z-50 bottom-4 w-full"
      autoHideDuration={4000}
      exited={exited}
      open={open}
      {...props}
    >
      <Transition
        timeout={{ enter: 400, exit: 400 }}
        in={open}
        appear
        unmountOnExit
        onEnter={handleOnEnter}
        onExited={handleOnExited}
        nodeRef={nodeRef}
      >
        {(status) => (
          <div
            className={classNames(
              'bg-tomato-500 text-white rounded-lg w-3/4 mx-auto p-2 text-center transition-transform duration-300',
              {
                'translate-y-0': ['entering', 'entered'].includes(status),
                'translate-y-[150px]': ['exiting', 'exited', 'unmounted'].includes(status),
              },
            )}
            ref={nodeRef}
          >
            {children}
          </div>
        )}
      </Transition>
    </SnackbarUnstyled>
  );
};

export default Snackbar;
