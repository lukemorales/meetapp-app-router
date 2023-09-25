import { type Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { FormSubmitButton } from '@/components';
import { getActiveServerSession, meetupsService } from '@/server';
import { MdAddCircleOutline } from 'react-icons/md';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { createDateFromDatePickerString } from '../create-date-from-string';
import { DatePicker } from '../date-picker';

export const metadata: Metadata = {
  title: 'Create Meetup',
};

export default async function CreateMeetup() {
  async function create(formData: FormData) {
    'use server';

    const session = await getActiveServerSession();

    const schema = zfd.formData({
      date: z.string(),
      description: z.string().min(1),
      title: z.string().min(1),
      location: z.string().min(1),
    });

    const { date, ...values } = schema.parse(formData);

    const meetup = await meetupsService.createMeetup({
      ...values,
      date: createDateFromDatePickerString(date).toISOString(),
      organizerId: session.user.id,
    });

    revalidatePath('/dashboard');
    redirect(`/meetup/${meetup.id}`);
  }

  return (
    <div className="mx-auto my-12 flex w-full max-w-[60rem] flex-col px-7">
      <form action={create} className="flex flex-col gap-3">
        <input
          className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
          type="text"
          name="title"
          placeholder="Event name"
        />
        <textarea
          className="h-[12.5rem] w-full resize-none rounded bg-white px-3 py-2 text-[#515366]"
          name="description"
          placeholder="Description"
        />

        <DatePicker name="date" placeholder="Date" />
        <input
          className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
          type="text"
          name="location"
          placeholder="Location"
        />

        <FormSubmitButton>
          <div className="flex items-center justify-center gap-1 self-end">
            <MdAddCircleOutline size={20} color="#fff" />
            Create
          </div>
        </FormSubmitButton>
      </form>
    </div>
  );
}
