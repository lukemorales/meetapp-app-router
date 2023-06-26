import Link from 'next/link';

import { FormSubmitButton } from '@/components';

import { zfd } from 'zod-form-data';
import { Email, Password } from '@/shared/validation';
import { z } from 'zod';
import { createUser } from '@/database/inserts';
import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default function SignUpPage() {
  async function register(formData: FormData) {
    'use server';

    const schema = zfd.formData({
      name: z.string().min(1),
      email: Email,
      password: Password,
    });

    const userOptions = schema.parse(formData);

    await Promise.all([
      createUser(userOptions),
      new Promise((res) => setTimeout(res, 800)),
    ]);

    redirect('/');
  }

  return (
    <form action={register} className="flex flex-col mt-10 relative z-20 gap-3">
      <input
        required
        className="w-full rounded h-12 py-2 px-3 text-[#333] bg-[#3f2744]/10"
        name="name"
        type="text"
        placeholder="Name"
        minLength={1}
      />
      <input
        required
        className="w-full rounded h-12 py-2 px-3 text-[#333] bg-[#3f2744]/10"
        name="email"
        type="email"
        placeholder="Email"
      />
      <input
        required
        className="w-full rounded h-12 py-2 px-3 text-[#333] bg-[#3f2744]/10"
        name="password"
        type="password"
        placeholder="Password"
        minLength={6}
      />

      <FormSubmitButton>Create account</FormSubmitButton>

      <p className="mt-14 flex flex-col justify-between items-center cursor-default text-[#777] leading-4">
        Already registered?
        <Link
          href="/"
          className="inline-block py-2 px-5 text-[#e5556e] text-base font-bold"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
