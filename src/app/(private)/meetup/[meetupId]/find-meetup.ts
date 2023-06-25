import { db, meetupsTable } from '@/database';
import { MeetupId } from '@/shared/entity-ids';
import { isAfter, parseISO, format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import 'server-only';

export const findMeetup = cache(async (meetupId: MeetupId) => {
  const meetup = await db.query.meetupsTable.findFirst({
    where: eq(meetupsTable.id, meetupId),
  });

  if (!meetup) {
    notFound();
  }

  return {
    ...meetup,
    hasPast: isAfter(new Date(), parseISO(meetup.date)),
    formattedDate: format(parseISO(meetup.date), "dd/MM/Y 'às' HH'h'mm"),
  };
});
