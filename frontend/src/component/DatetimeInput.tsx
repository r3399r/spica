import { getDate, getHours, getMinutes, getMonth, getYear } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import Input from './Input';

type Props = {
  onChange: (date: Date) => void;
};

const DatetimeInput = ({ onChange }: Props) => {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState<string>(`${getYear(now)}`);
  const [month, setMonth] = useState<string>(`${getMonth(now) + 1}`);
  const [day, setDay] = useState<string>(`${getDate(now)}`);
  const [hours, setHours] = useState<string>(`${getHours(now)}`);
  const [minutes, setMinutes] = useState<string>(`${getMinutes(now)}`);

  useEffect(() => {
    onChange(
      new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)),
    );
  }, [year, month, day, hours, minutes]);

  return (
    <div>
      <Input
        value={year}
        onChange={(e) => setYear(e.target.value)}
        regex={/^[0-9]{0,4}$/}
        size={5}
      />
      /
      <Input
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        regex={/^(0{0,1}[0-9]{0,1}|1[0-2]{0,1})$/}
        size={3}
      />
      /
      <Input
        value={day}
        onChange={(e) => setDay(e.target.value)}
        regex={/^([0-2]{0,1}[0-9]{0,1}|3[0-1]{0,1})$/}
        size={3}
      />{' '}
      <Input
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        regex={/^([01]{0,1}[0-9]{0,1}|2[0-3]{0,1})$/}
        size={3}
      />
      :
      <Input
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        regex={/^[0-5]{0,1}[0-9]{0,1}$/}
        size={3}
      />
    </div>
  );
};

export default DatetimeInput;
