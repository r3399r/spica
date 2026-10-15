import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
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
  { id: 'dong', label: '₫' },
];

const ModalSymbolSelect = ({ open, onClose, value, setValue }: Props) => {
  const { t } = useTranslation();
  const isCustom = useMemo(() => !!value && !symbols.some((v) => v.label === value), [value]);
  const [showCustom, setShowCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    setShowCustom(isCustom);
    setCustomValue(isCustom ? value : '');
  }, [open]);

  const onClick = (label: string) => () => {
    setValue(label);
    onClose();
  };

  const onCustomConfirm = () => {
    const symbol = customValue.trim();
    if (symbol.length === 0) return;
    setValue(symbol);
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
        <ListItem focus={isCustom} onClick={() => setShowCustom(true)}>
          {t('currencySetting.custom')}
          {isCustom && ` (${value})`}
        </ListItem>
        {showCustom && (
          <div className="flex items-center gap-[10px] px-[10px]">
            <div className="flex-1">
              <Input
                autoFocus
                maxLength={5}
                placeholder={t('currencySetting.customSymbol')}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onCustomConfirm()}
              />
            </div>
            <Button
              type="button"
              disabled={customValue.trim().length === 0}
              onClick={onCustomConfirm}
            >
              {t('act.confirm')}
            </Button>
          </div>
        )}
      </>
    </Modal>
  );
};

export default ModalSymbolSelect;
