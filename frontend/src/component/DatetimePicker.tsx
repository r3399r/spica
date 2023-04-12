import { LocalizationProvider, StaticDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { useState } from 'react';
import IcCalendar from 'src/image/ic-calendar.svg';
import IcClock from 'src/image/ic-clock.svg';
import IcSelect from 'src/image/ic-select.svg';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';

type Props = {
  label?: string;
  initDate: Date;
  onChange?: (v: Date) => void;
  cancelTxt: string;
  confirmTxt: string;
};

const DatetimePicker = ({ label, initDate, onChange, cancelTxt, confirmTxt }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(initDate);

  const onDateChange = (v: Date) => {
    setDate(v);
    onChange && onChange(v);
  };

  return (
    <div className="w-full">
      {label && <div className="text-[14px] leading-normal text-navy-700 mb-[5px]">{label}</div>}
      <div
        className="rounded bg-grey-200 outline-none p-2 h-[40px] cursor-pointer flex justify-between"
        onClick={() => setOpen(true)}
      >
        <div>{format(date, 'yyyy/MM/dd HH:mm')}</div>
        <div>
          <img src={IcSelect} />
        </div>
      </div>
      <Modal open={open} handleClose={() => setOpen(false)} showClose={false} px={false}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDateTimePicker
            value={date}
            onChange={(v) => {
              v && onDateChange(v);
            }}
            renderInput={({ inputProps }) => <Input {...inputProps} />}
            ampm={false}
            componentsProps={{
              actionBar: { actions: [] },
            }}
            dateRangeIcon={<img src={IcCalendar} />}
            timeIcon={<img src={IcClock} />}
            inputFormat="yyyy/MM/dd HH:mm"
          />
          <div className="flex gap-[15px] justify-end mr-3 mb-4">
            <Button
              appearance="secondary"
              onClick={() => {
                setOpen(false);
                onDateChange(initDate);
              }}
            >
              {cancelTxt}
            </Button>
            <Button
              appearance="default"
              onClick={() => {
                setOpen(false);
                onDateChange(date);
              }}
            >
              {confirmTxt}
            </Button>
          </div>
        </LocalizationProvider>
      </Modal>
    </div>
  );
};

export default DatetimePicker;
