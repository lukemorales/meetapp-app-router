import 'server-only';
import { db, meetupsTable } from '@/database';
import { MeetupId, UserId } from '@/shared/entity-ids';
import { isAfter, parseISO, format } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const findMeetup = cache(async (meetupId: MeetupId, userId: UserId) => {
  const meetup = await db.query.meetupsTable.findFirst({
    where: and(
      eq(meetupsTable.id, meetupId),
      eq(meetupsTable.organizerId, userId),
    ),
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
