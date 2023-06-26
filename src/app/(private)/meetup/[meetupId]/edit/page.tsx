import { FormSubmitButton } from '@/components';
import { db, meetupsTable } from '@/database';
import { getActiveSessionServer } from '@/server';
import { MeetupId } from '@/shared/entity-ids';
import { parseISO } from 'date-fns';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { MdDeleteForever, MdSave } from 'react-icons/md';
import { DatePicker } from '../../date-picker';
import { findMeetup } from '../find-meetup';

type EditMeetupProps = {
  params: { meetupId: MeetupId };
};

export async function generateMetadata({
  params,
}: EditMeetupProps): Promise<Metadata> {
  const session = await getActiveSessionServer();

  const meetup = await findMeetup(params.meetupId, session.user.id);

  return {
    title: `Edit ${meetup.title}`,
  };
}

export default async function EditMeetup({ params }: EditMeetupProps) {
  const session = await getActiveSessionServer();

  const meetup = await findMeetup(params.meetupId, session.user.id);

  // TODO: implement meetup update
  async function update(formData: FormData) {
    'use server';

    redirect(`/meetup/${meetup.id}`);
  }

  async function cancelMeetup(_formData: FormData) {
    'use server';

    await db.delete(meetupsTable).where(eq(meetupsTable.id, params.meetupId));

    revalidatePath('/dashboard');
    redirect('/dashboard', RedirectType.replace);
  }

  return (
    <div className="w-full max-w-[60rem] my-12 mx-auto px-7 flex flex-col flex-1">
      <form action={update} className="flex flex-col gap-3">
        <input
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          type="text"
          name="title"
          placeholder="Event name"
          defaultValue={meetup.title}
        />
        <textarea
          className="w-full rounded py-2 px-3 text-[#515366] bg-white resize-none h-[12.5rem]"
          name="description"
          placeholder="Description"
          defaultValue={meetup.description}
        />

        <DatePicker
          name="date"
          placeholder="Data"
          initialValue={parseISO(meetup.date)}
        />
        <input
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          type="text"
          name="location"
          placeholder="Location"
          defaultValue={meetup.location}
        />

        <div className="flex justify-between items-center mt-3">
          <button
            formAction={cancelMeetup}
            type="submit"
            className="flex items-center bg-none font-bold text-[#e65175] py-2 px-3 h-12 gap-2"
          >
            <MdDeleteForever size={20} color="#e65175" />
            Cancel meetup
          </button>

          <FormSubmitButton>
            <div className="flex items-center gap-2 justify-center self-end py-2 px-3">
              <MdSave size={20} color="#fff" />
              Save
            </div>
          </FormSubmitButton>
        </div>
      </form>
    </div>
  );
}
