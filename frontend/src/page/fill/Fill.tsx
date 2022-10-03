import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Transfer from './component/Transfer';

const Fill = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<string>('expense');

  return (
    <div>
      <Button variant="contained" type="button" onClick={() => navigate(-1)}>
        回上一頁
      </Button>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>類別: </div>
        <select defaultValue={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">支出</option>
          <option value="income">收入</option>
          <option value="transfer">轉帳</option>
        </select>
      </div>
      {type === 'transfer' && <Transfer />}
    </div>
  );
};

export default Fill;
