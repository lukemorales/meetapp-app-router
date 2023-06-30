import Link from 'next/link';
import { redirect } from 'next/navigation';

import { FormSubmitButton } from '@/components';
import { zfd } from 'zod-form-data';
import { Email, Password } from '@/shared/validation';
import { z } from 'zod';
import { resend, usersService } from '@/server';

import { WelcomeEmail } from './welcome-email';

export const dynamic = 'force-static';

export default function SignUpPage() {
  async function register(formData: FormData) {
    'use server';

    const schema = zfd.formData({
      name: z.string().min(1),
      email: Email,
      password: Password,
    });

    const user = await usersService.createUser(schema.parse(formData));

    await resend.emails
      .send({
        from: 'Meetapp <onboarding@meet.app>',
        to: user.email,
        subject: 'Welcome to Meetapp',
        react: <WelcomeEmail name={user.name} />,
      })
      // eslint-disable-next-line no-console
      .catch(console.log);

    redirect('/');
  }

  return (
    <form action={register} className="relative z-20 mt-10 flex flex-col gap-3">
      <input
        required
        className="h-12 w-full rounded bg-[#3f2744]/10 px-3 py-2 text-[#333]"
        name="name"
        type="text"
        placeholder="Name"
        minLength={1}
      />
      <input
        required
        className="h-12 w-full rounded bg-[#3f2744]/10 px-3 py-2 text-[#333]"
        name="email"
        type="email"
        placeholder="Email"
      />
      <input
        required
        className="h-12 w-full rounded bg-[#3f2744]/10 px-3 py-2 text-[#333]"
        name="password"
        type="password"
        placeholder="Password"
        minLength={6}
      />

      <FormSubmitButton>Create account</FormSubmitButton>

      <p className="mt-14 flex cursor-default flex-col items-center justify-between leading-4 text-[#777]">
        Already registered?
        <Link
          href="/"
          className="inline-block px-5 py-2 text-base font-bold text-[#e5556e]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
