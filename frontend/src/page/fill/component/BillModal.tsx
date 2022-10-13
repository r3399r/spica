import { Button } from '@mui/material';
import { Member } from '@y-celestial/spica-service/lib/src/model/entity/Member';
import { useState } from 'react';
import Input from 'src/component/deprecated/Input';
import Modal from 'src/component/deprecated/Modal';
import { BillForm } from 'src/model/Form';

type Props = {
  open: boolean;
  onClose: () => void;
  side?: 'former' | 'latter';
  member: Member[];
  onConfirm: (v: BillForm['detail']) => void;
};

const BillModal = ({ open, onClose, side, member, onConfirm }: Props) => {
  const [detail, setDetail] = useState<
    { id: string; type: 'weight' | 'pct' | 'amount'; value: string; nickname: string }[]
  >(member.map((v) => ({ id: v.id, type: 'weight', value: '', nickname: v.nickname })));

  return (
    <Modal open={open} onClose={onClose}>
      <div>{side === 'former' ? '先付' : '待付'}</div>
      {detail.map((v, i) => (
        <div key={v.id} style={{ display: 'flex', gap: 10 }}>
          <div>{v.nickname}</div>
          <select
            className="border"
            defaultValue={'weight'}
            onChange={(e) => {
              const tmp = [...detail];
              tmp[i] = { ...tmp[i], type: e.target.value as 'weight' | 'pct' | 'amount' };
              setDetail(tmp);
            }}
          >
            <option value="weight">份數</option>
            <option value="pct">百分比</option>
            <option value="amount">金額</option>
          </select>
          <Input
            value={v.value}
            onChange={(e) => {
              const tmp = [...detail];
              tmp[i] = { ...tmp[i], value: e.target.value };
              setDetail(tmp);
            }}
            regex={/^\d*\.?\d{0,2}$/}
          />
        </div>
      ))}
      <Button
        variant="contained"
        type="button"
        onClick={() =>
          onConfirm(
            detail.map((v) => ({ id: v.id, side: side ?? 'former', type: v.type, value: v.value })),
          )
        }
      >
        確定
      </Button>
    </Modal>
  );
};

export default BillModal;
