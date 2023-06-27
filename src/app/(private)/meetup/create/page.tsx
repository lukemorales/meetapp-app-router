import { FormSubmitButton } from '@/components';

import { redirect } from 'next/navigation';
import { MdAddCircleOutline } from 'react-icons/md';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { DatePicker } from '../date-picker';
import { revalidatePath } from 'next/cache';
import { Metadata } from 'next';
import { getActiveServerSession, meetupsService } from '@/server';
import { createDateFromDatePickerString } from '../create-date-from-string';

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
    <div className="max-w-[60rem] w-full my-12 mx-auto px-7 flex flex-col">
      <form action={create} className="flex flex-col gap-3">
        <input
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          type="text"
          name="title"
          placeholder="Event name"
        />
        <textarea
          className="w-full rounded py-2 px-3 text-[#515366] bg-white resize-none h-[12.5rem]"
          name="description"
          placeholder="Description"
        />

        <DatePicker name="date" placeholder="Date" />
        <input
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          type="text"
          name="location"
          placeholder="Location"
        />

        <FormSubmitButton>
          <div className="flex items-center gap-1 justify-center self-end">
            <MdAddCircleOutline size={20} color="#fff" />
            Create
          </div>
        </FormSubmitButton>
      </form>
    </div>
  );
}
