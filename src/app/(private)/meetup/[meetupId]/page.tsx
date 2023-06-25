import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { MeetupId } from '@/shared/entity-ids';

import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { MdDateRange, MdEdit, MdLocationOn } from 'react-icons/md';
import nl2br from 'react-nl2br';
import { findMeetup } from './find-meetup';

type MeetupProps = {
  params: { meetupId: MeetupId };
};

// TODO: add loading.tsx
export default async function Meetup({ params }: MeetupProps) {
  const session = await getServerSession(authOptions);

  const meetup = await findMeetup(params.meetupId);

  // TODO: implement business rules for date comparison
  const isBeforeEventDate = true;

  return (
    <div>
      <header className="w-full flex justify-between items-center mb-10">
        <h2 className="text-[#F94D6A] font-medium tracking-[0.5px] text-3xl">
          {meetup.title}
        </h2>

        {meetup.organizerId === session?.user.id && isBeforeEventDate && (
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
                {/*
                 * //TODO: implement date formatting
                 */}
                {meetup.date}
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
