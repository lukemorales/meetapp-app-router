import { type Metadata } from 'next';
import Link from 'next/link';

import { db, meetupsTable } from '@/database';
import { getActiveServerSession } from '@/server';
import { formatMeetup } from '@/shared/meetup';
import { clsx } from 'clsx';
import { eq } from 'drizzle-orm';
import { exhaustive } from 'exhaustive';
import { MdDateRange, MdLocationOn } from 'react-icons/md';
import * as A from '@effect/data/ReadonlyArray';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  const session = await getActiveServerSession();

  const meetups = await db.query.meetups
    .findMany({
      where: eq(meetupsTable.organizerId, session.user.id),
      limit: 10,
      orderBy: meetupsTable.date,
    })
    .then(A.map(formatMeetup));

  return exhaustive(meetups.length === 0, {
    true: () => (
      <aside className="text-center text-[#eee] flex justify-center items-center flex-1">
        You have not created any meetups
      </aside>
    ),
    false: () => (
      <ul className="flex flex-col gap-3">
        {meetups.map((meetup) => (
          <Link
            key={meetup.id}
            href={`/meetup/${meetup.id}`}
            className={clsx(
              'flex justify-between items-center w-full p-5 rounded bg-black/10 text-white',
              { 'opacity-50': meetup.hasPast },
            )}
          >
            <h3>{meetup.title}</h3>

            <div className="text-[#eee] ml-8 flex flex-col gap-2">
              <p className="flex items-center m-0 gap-3 whitespace-nowrap">
                <MdDateRange size={16} />
                {meetup.formattedDate}
              </p>

              <p className="flex items-center gap-3 m-0">
                <MdLocationOn size={16} />
                {meetup.location}
              </p>
            </div>
          </Link>
        ))}
      </ul>
    ),
  });
}
