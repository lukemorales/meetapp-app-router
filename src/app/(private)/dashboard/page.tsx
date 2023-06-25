import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db, meetupsTable } from '@/database';
import { clsx } from 'clsx';
import { eq } from 'drizzle-orm';
import { exhaustive } from 'exhaustive';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MdDateRange, MdLocationOn } from 'react-icons/md';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const meetups = await db.query.meetupsTable.findMany({
    where: eq(meetupsTable.organizerId, session.user.id),
    limit: 10,
  });

  await new Promise((res) => setTimeout(res, 8000));

  return exhaustive(meetups.length === 0, {
    true: () => (
      <aside className="text-center text-[#eee] flex justify-center items-center flex-1">
        {'Você ainda não possui nenhum Meetup :('}
      </aside>
    ),
    false: () => (
      <ul className="flex flex-col gap-3">
        {meetups.map((meetup) => (
          <Link
            href={`/meetup/${meetup.id}`}
            key={meetup.id}
            className={clsx(
              'flex justify-between items-center w-full p-5 rounded bg-black/10 text-white',
              { 'opacity-50': false, 'opacity-100': true },
            )}
          >
            <h3>{meetup.title}</h3>

            <div className="text-[#eee] ml-8 flex flex-col gap-2">
              <p className="flex items-center m-0 gap-3 whitespace-nowrap">
                <MdDateRange size={16} />
                {meetup.date}
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
