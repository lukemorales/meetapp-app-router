import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db, meetupsTable } from '@/database';
import { MeetupId } from '@/shared/entity-ids';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import 'server-only';

export async function findMeetup(meetupId: MeetupId) {
  const meetup = await db.query.meetupsTable.findFirst({
    where: eq(meetupsTable.id, meetupId),
  });

  if (!meetup) {
    notFound();
  }

  return meetup;
}
