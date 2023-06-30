'use client';

import { signIn } from 'next-auth/react';
import { type FormEvent } from 'react';

import { FormSubmitButton } from '@/components';

export const AuthForm: React.FC<React.PropsWithChildren> = ({ children }) => {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
    });
  }

  return (
    <form
      className="relative z-20 mt-10 flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <input
        required
        className="h-12 w-full rounded bg-[#3f2744]/10 px-3 py-2 text-[#333]"
        name="email"
        type="email"
        placeholder="Email"
        minLength={1}
      />
      <input
        required
        className="h-12 w-full rounded bg-[#3f2744]/10 px-3 py-2 text-[#333]"
        name="password"
        type="password"
        placeholder="Password"
        minLength={6}
      />

      <FormSubmitButton>Sign in</FormSubmitButton>

      {children}
    </form>
  );
};
