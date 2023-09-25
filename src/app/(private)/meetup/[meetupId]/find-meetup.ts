import { notFound } from 'next/navigation';
import { cache } from 'react';
import 'server-only';

import { db, meetupsTable } from '@/database';
import { type MeetupId, type UserId } from '@/shared/entity-ids';
import { formatMeetup } from '@/shared/meetup';
import { and, eq } from 'drizzle-orm';

export const findMeetup = cache(async (meetupId: MeetupId, userId: UserId) => {
  const meetup = await db.query.meetups.findFirst({
    where: and(
      eq(meetupsTable.id, meetupId),
      eq(meetupsTable.organizerId, userId),
    ),
  });

  // TODO: create not-found route
  if (!meetup) {
    notFound();
  }

  return formatMeetup(meetup);
});
