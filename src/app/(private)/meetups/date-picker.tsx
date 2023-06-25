'use client';

import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = {
  name: string;
  placeholder: string;
};

// TODO: improve datepicker styles
export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  placeholder,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <ReactDatePicker
      className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
      name={name}
      placeholderText={placeholder}
      selected={startDate}
      minDate={new Date()}
      showTimeSelect
      timeFormat="HH:mm"
      dateFormat="dd/MM/yyyy - HH:mm"
      autoComplete="off"
      onChange={(date) => setStartDate(date)}
    />
  );
};
