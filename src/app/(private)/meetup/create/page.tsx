import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { FormSubmitButton } from '@/components';
import { createMeetup } from '@/database/inserts';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { MdAddCircleOutline } from 'react-icons/md';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { DatePicker } from '../date-picker';
import { revalidatePath } from 'next/cache';

export default async function CreateMeetup() {
  async function create(formData: FormData) {
    'use server';

    const session = await getServerSession(authOptions);

    if (!session) {
      redirect('/');
    }

    const schema = zfd.formData({
      date: z.string(),
      description: z.string().min(1),
      title: z.string().min(1),
      location: z.string().min(1),
    });

    const values = schema.parse(formData);

    const meetup = await createMeetup({
      ...values,
      organizerId: session.user.id,
    });

    revalidatePath('/dashboard');
    redirect(`/meetup/${meetup.id}`);
  }

  return (
    <div className="max-w-[60rem] my-12 mx-auto px-7 flex flex-col">
      <form action={create} className="flex flex-col gap-3">
        <input
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          type="text"
          name="title"
          placeholder="Nome do evento"
        />
        <textarea
          className="w-full rounded py-2 px-3 text-[#515366] bg-white resize-none h-[12.5rem]"
          name="description"
          placeholder="Descrição"
        />

        <DatePicker name="date" placeholder="Data" />
        <input
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          type="text"
          name="location"
          placeholder="Localização"
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
