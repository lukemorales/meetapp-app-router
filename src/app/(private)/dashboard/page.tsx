import { type Metadata } from 'next';
import Link from 'next/link';

import { db, meetupsTable } from '@/database';
import { getActiveServerSession } from '@/server';
import { formatMeetup } from '@/shared/meetup';
import { clsx } from 'clsx';
import { eq } from 'drizzle-orm';
import { exhaustive } from 'exhaustive';
import { A } from 'funkcia';
import { MdDateRange, MdLocationOn } from 'react-icons/md';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  const session = await getActiveServerSession();

  const meetups = await db.query.meetups
    .findMany({
      where: eq(meetupsTable.organizerId, session.user.id),
      limit: 10,
      orderBy: (table, { desc }) => [desc(table.date)],
    })
    .then(A.map(formatMeetup));

  return exhaustive(meetups.length === 0, {
    true: () => (
      <aside className="flex flex-1 items-center justify-center text-center text-[#eee]">
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
              'flex w-full items-center justify-between rounded bg-black/10 p-5 text-white',
              { 'opacity-50': meetup.hasPast },
            )}
          >
            <h3>{meetup.title}</h3>

            <div className="ml-8 flex flex-col gap-2 text-[#eee]">
              <p className="m-0 flex items-center gap-3 whitespace-nowrap">
                <MdDateRange size={16} />
                {meetup.formattedDate}
              </p>

              <p className="m-0 flex items-center gap-3">
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
