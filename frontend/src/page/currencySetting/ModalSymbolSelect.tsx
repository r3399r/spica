import ListItem from 'src/component/ListItem';
import Modal from 'src/component/Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  value: string;
  setValue: (value: string) => void;
};

const symbols = [
  { id: 'dollar', label: '$' },
  { id: 'yen', label: '¥' },
  { id: 'baht', label: '฿' },
  { id: 'won', label: '₩' },
  { id: 'euro', label: '€' },
  { id: 'pound', label: '£' },
  { id: 'piso', label: '₱' },
];

const ModalSymbolSelect = ({ open, onClose, value, setValue }: Props) => {
  const onClick = (label: string) => () => {
    setValue(label);
    onClose();
  };

  return (
    <Modal open={open} handleClose={onClose} showClose={false} px={false} className="py-[12px]">
      <>
        {symbols.map((v) => (
          <ListItem key={v.id} focus={v.label === value} onClick={onClick(v.label)}>
            {v.label}
          </ListItem>
        ))}
      </>
    </Modal>
  );
};

export default ModalSymbolSelect;
