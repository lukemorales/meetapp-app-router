'use client';

import { useState } from 'react';

import { addDays } from 'date-fns';
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
      showTimeSelect
      className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
      name={name}
      placeholderText={placeholder}
      selected={startDate}
      minDate={addDays(new Date(), 1)}
      timeFormat="HH:mm"
      dateFormat="dd/MM/yyyy - HH:mm"
      autoComplete="off"
      onChange={setStartDate}
    />
  );
};
