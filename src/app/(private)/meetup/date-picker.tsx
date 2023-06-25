'use client';

import { addDays } from 'date-fns';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  name: string;
  placeholder: string;
  initialValue?: Date;
};

// TODO: improve datepicker styles
export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  placeholder,
  initialValue,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialValue ?? null);

  return (
    <ReactDatePicker
      className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
      name={name}
      placeholderText={placeholder}
      selected={startDate}
      minDate={addDays(new Date(), 1)}
      showTimeSelect
      timeFormat="HH:mm"
      dateFormat="dd/MM/yyyy - HH:mm"
      autoComplete="off"
      onChange={(date) => {
        console.log(date, typeof date);
        setStartDate(date);
      }}
    />
  );
};
