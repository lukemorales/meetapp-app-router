export function createDateFromDatePickerString(date: string) {
  // dd/MM/yyyy - HH:mm
  const [fullDate, time] = date.split(' - ');
  const [day, month, year] = fullDate.split('/');

  return new Date(`${month} ${day} ${year} ${time}`);
}
