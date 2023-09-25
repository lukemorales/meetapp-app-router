import { type Metadata } from 'next';
import Link from 'next/link';

import { getActiveServerSession } from '@/server';
import { type MeetupId } from '@/shared/entity-ids';
import { MdDateRange, MdEdit, MdLocationOn } from 'react-icons/md';
import nl2br from 'react-nl2br';

import { findMeetup } from './find-meetup';

type MeetupProps = {
  params: { meetupId: MeetupId };
};

export async function generateMetadata({
  params,
}: MeetupProps): Promise<Metadata> {
  const session = await getActiveServerSession();

  const meetup = await findMeetup(params.meetupId, session.user.id);

  return {
    title: meetup.title,
  };
}

export default async function Meetup({ params }: MeetupProps) {
  const session = await getActiveServerSession();

  const meetup = await findMeetup(params.meetupId, session.user.id);

  return (
    <div>
      <header className="mb-10 flex w-full items-center justify-between">
        <h2 className="text-3xl font-medium tracking-[0.5px] text-[#F94D6A]">
          {meetup.title}
        </h2>

        {meetup.organizerId === session.user.id && !meetup.hasPast && (
          <nav className="flex">
            <Link
              className="flex items-center gap-1 rounded bg-[#4dbaf9] px-3 py-2 font-bold text-white"
              href={`/meetup/${params.meetupId}/edit`}
            >
              <MdEdit size={16} color="#fff" />
              Edit
            </Link>
          </nav>
        )}
      </header>

      <article className="overflow-hidden rounded bg-white">
        <div className="px-7 pb-5 pt-6">
          <p className="mb-7 text-base text-[#6f4e56]">
            {nl2br(meetup.description)}
          </p>

          <footer className="flex flex-col justify-between pt-5">
            <div>
              <p className="flex items-center gap-2 text-[#333]">
                <MdDateRange size={18} color="#e65175" />
                {meetup.formattedDate}
              </p>

              <p className="mt-2 flex items-center gap-2 text-[#333]">
                <MdLocationOn size={18} color="#e65175" />
                {meetup.location}
              </p>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
