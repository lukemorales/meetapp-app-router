import Link from 'next/link';
import { type Metadata } from 'next';

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
      <header className="w-full flex justify-between items-center mb-10">
        <h2 className="text-[#F94D6A] font-medium tracking-[0.5px] text-3xl">
          {meetup.title}
        </h2>

        {meetup.organizerId === session.user.id && !meetup.hasPast && (
          <nav className="flex">
            <Link
              className="rounded py-2 px-3 flex items-center font-bold text-white bg-[#4dbaf9] gap-1"
              href={`/meetup/${params.meetupId}/edit`}
            >
              <MdEdit size={16} color="#fff" />
              Edit
            </Link>
          </nav>
        )}
      </header>

      <article className="bg-white rounded overflow-hidden">
        <div className="pt-6 pb-5 px-7">
          <p className="text-base mb-7 text-[#6f4e56]">
            {nl2br(meetup.description)}
          </p>

          <footer className="flex flex-col justify-between pt-5">
            <div>
              <p className="text-[#333] flex items-center gap-2">
                <MdDateRange size={18} color="#e65175" />
                {meetup.formattedDate}
              </p>

              <p className="text-[#333] flex items-center mt-2 gap-2">
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
