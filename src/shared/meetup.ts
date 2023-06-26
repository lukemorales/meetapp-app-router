import { Meetup } from '@/database';
import { isAfter, parseISO, format } from 'date-fns/fp';

export function formatMeetup(meetup: Meetup) {
  const isAfterMeetupDate = isAfter(parseISO(meetup.date));
  const formatDateToDisplay = format("MM/dd/Y 'at' HH'h'mm");

  return {
    ...meetup,
    hasPast: isAfterMeetupDate(new Date()),
    formattedDate: formatDateToDisplay(parseISO(meetup.date)),
  };
}
