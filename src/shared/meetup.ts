import { type Meetup } from '@/database';
import { isAfter, parseISO, format } from 'date-fns/fp';

const formatDateToDisplay = format("MM/dd/Y 'at' HH'h'mm");

export function formatMeetup(meetup: Meetup) {
  const meetupDateISO = parseISO(meetup.date);

  const isAfterMeetupDate = isAfter(meetupDateISO);

  return {
    ...meetup,
    hasPast: isAfterMeetupDate(new Date()),
    formattedDate: formatDateToDisplay(meetupDateISO),
  };
}
