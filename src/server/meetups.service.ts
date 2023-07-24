import { meetupsTable, db } from '@/database';
import { A, O, FX } from '@/shared/effect';
import { MeetupId } from '@/shared/entity-ids';
import { formatMeetup } from '@/shared/meetup';
import { type InferModel, eq } from 'drizzle-orm';
import { pipe } from 'effect';
import { flow } from 'effect/Function';
import { ulid } from 'ulid';

type CreateMeetupOptions = Omit<
  InferModel<typeof meetupsTable, 'insert'>,
  'id' | 'updatedAt' | 'createdAt'
>;

export function createMeetup(options: CreateMeetupOptions) {
  return pipe(
    FX.tryPromise(() =>
      db
        .insert(meetupsTable)
        .values({ ...options, id: MeetupId.parse(ulid()) })
        .returning(),
    ),
    FX.flatMap(flow(A.head, O.map(formatMeetup))),
  );
}

type UpdateMeetupOptions = Omit<CreateMeetupOptions, 'organizerId'>;

export function updateMeetup(meetupId: MeetupId, options: UpdateMeetupOptions) {
  return pipe(
    FX.tryPromise(() =>
      db
        .update(meetupsTable)
        .set(options)
        .where(eq(meetupsTable.id, meetupId))
        .returning(),
    ),
    FX.flatMap(flow(A.head, O.map(formatMeetup))),
  );
}
