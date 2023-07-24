import 'server-only';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { db, meetupsTable } from '@/database';
import { type MeetupId, type UserId } from '@/shared/entity-ids';
import { and, eq } from 'drizzle-orm';
import { formatMeetup } from '@/shared/meetup';
import { pipe } from 'effect';
import { FX, O } from '@/shared/effect';
import { flow, identity } from 'effect/Function';

export const findMeetup = cache((meetupId: MeetupId, userId: UserId) =>
  pipe(
    FX.tryPromise(() =>
      db.query.meetups.findFirst({
        where: and(
          eq(meetupsTable.id, meetupId),
          eq(meetupsTable.organizerId, userId),
        ),
      }),
    ),
    FX.flatMap(flow(O.fromNullable, O.map(formatMeetup))),
    FX.match({
      onFailure: notFound,
      onSuccess: identity,
    }),
  ),
);
