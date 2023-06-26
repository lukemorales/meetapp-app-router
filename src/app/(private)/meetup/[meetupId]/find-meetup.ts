import 'server-only';
import { db, meetupsTable } from '@/database';
import { MeetupId, UserId } from '@/shared/entity-ids';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { formatMeetup } from '@/shared/meetup';

export const findMeetup = cache(async (meetupId: MeetupId, userId: UserId) => {
  const meetup = await db.query.meetups.findFirst({
    where: and(
      eq(meetupsTable.id, meetupId),
      eq(meetupsTable.organizerId, userId),
    ),
  });

  if (!meetup) {
    notFound();
  }

  return formatMeetup(meetup);
});
