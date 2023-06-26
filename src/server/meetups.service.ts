import { meetupsTable, db } from '@/database';
import { MeetupId } from '@/shared/entity-ids';
import { formatMeetup } from '@/shared/meetup';
import { InferModel } from 'drizzle-orm';
import { ulid } from 'ulid';

type CreateMeetupOptions = Omit<
  InferModel<typeof meetupsTable, 'insert'>,
  'id' | 'updatedAt' | 'createdAt'
>;

export async function createMeetup(options: CreateMeetupOptions) {
  return db
    .insert(meetupsTable)
    .values({
      ...options,
      id: MeetupId.parse(ulid()),
    })
    .returning()
    .then(([meetup]) => formatMeetup(meetup));
}
