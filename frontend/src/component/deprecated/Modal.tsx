import { Modal as MuiModal } from '@mui/material';
import { CSSProperties, ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const style: CSSProperties = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  borderRadius: 15,
  padding: 20,
};

const Modal = ({ open, onClose, children }: Props) => (
  <MuiModal open={open} onClose={onClose}>
    <div style={style}>{children}</div>
  </MuiModal>
);

export default Modal;
