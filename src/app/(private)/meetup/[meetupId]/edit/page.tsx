import { type Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

import { FormSubmitButton } from '@/components';
import { db, meetupsTable } from '@/database';
import { getActiveServerSession, meetupsService } from '@/server';
import { type MeetupId } from '@/shared/entity-ids';
import { parseISO } from 'date-fns';
import { eq } from 'drizzle-orm';
import { MdDeleteForever, MdSave } from 'react-icons/md';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { DatePicker } from '../../date-picker';
import { findMeetup } from '../find-meetup';
import { createDateFromDatePickerString } from '../../create-date-from-string';

type EditMeetupProps = {
  params: { meetupId: MeetupId };
};

export async function generateMetadata({
  params,
}: EditMeetupProps): Promise<Metadata> {
  const session = await getActiveServerSession();

  const meetup = await findMeetup(params.meetupId, session.user.id);

  return {
    title: `Edit "${meetup.title}"`,
  };
}

export default async function EditMeetup({ params }: EditMeetupProps) {
  const session = await getActiveServerSession();

  const meetup = await findMeetup(params.meetupId, session.user.id);

  async function update(formData: FormData) {
    'use server';

    const schema = zfd.formData({
      date: z.string(),
      description: z.string().min(1),
      title: z.string().min(1),
      location: z.string().min(1),
    });

    const { date, ...values } = schema.parse(formData);

    const updatedMeetup = await meetupsService.updateMeetup(params.meetupId, {
      ...values,
      date: createDateFromDatePickerString(date).toISOString(),
    });

    revalidatePath('/dashboard');
    redirect(`/meetup/${updatedMeetup.id}`, RedirectType.replace);
  }

  async function cancelMeetup(_: FormData) {
    'use server';

    await db.delete(meetupsTable).where(eq(meetupsTable.id, params.meetupId));

    revalidatePath('/dashboard');
    redirect('/dashboard', RedirectType.replace);
  }

  return (
    <div className="mx-auto my-12 flex w-full max-w-[60rem] flex-1 flex-col px-7">
      <form action={update} className="flex flex-col gap-3">
        <input
          className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
          type="text"
          name="title"
          placeholder="Event name"
          defaultValue={meetup.title}
        />
        <textarea
          className="h-[12.5rem] w-full resize-none rounded bg-white px-3 py-2 text-[#515366]"
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
          className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
          type="text"
          name="location"
          placeholder="Location"
          defaultValue={meetup.location}
        />

        <div className="mt-3 flex items-center justify-between">
          <button
            formAction={cancelMeetup}
            type="submit"
            className="flex h-12 items-center gap-2 bg-none px-3 py-2 font-bold text-[#e65175]"
          >
            <MdDeleteForever size={20} color="#e65175" />
            Cancel meetup
          </button>

          <FormSubmitButton>
            <div className="flex items-center justify-center gap-2 self-end px-3 py-2">
              <MdSave size={20} color="#fff" />
              Save
            </div>
          </FormSubmitButton>
        </div>
      </form>
    </div>
  );
}
