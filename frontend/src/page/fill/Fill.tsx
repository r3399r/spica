import { Button } from '@mui/material';
import { Transaction } from '@y-celestial/spica-service';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Bill from './component/Bill';
import Transfer from './component/Transfer';

const Fill = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<string>();
  const location = useLocation();
  const state = location.state as Transaction | null;

  useEffect(() => {
    if (state === null) setType('expense');
    else if ('srcMemberId' in state) setType('transfer');
    else setType(state.type);
  }, [state]);

  return (
    <div>
      <Button variant="contained" type="button" onClick={() => navigate(-1)}>
        回上一頁
      </Button>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <div>類別: </div>
        {type && (
          <select defaultValue={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">支出</option>
            <option value="income">收入</option>
            <option value="transfer">轉帳</option>
          </select>
        )}
      </div>
      {type &&
        (type === 'transfer' ? <Transfer edit={state} /> : <Bill type={type} edit={state} />)}
    </div>
  );
};

export default Fill;
