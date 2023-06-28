import 'server-only';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { db, meetupsTable } from '@/database';
import { type MeetupId, type UserId } from '@/shared/entity-ids';
import { and, eq } from 'drizzle-orm';
import { formatMeetup } from '@/shared/meetup';

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
