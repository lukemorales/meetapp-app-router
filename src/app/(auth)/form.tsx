'use client';

import { FormSubmitButton } from '@/components';
import { signIn } from 'next-auth/react';

export const Form: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <form
      className="flex flex-col mt-10 relative z-20 gap-3"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        console.log(formData.get('email'));

        signIn('credentials', {
          email: formData.get('email'),
          password: formData.get('password'),
        });
      }}
    >
      <input
        required
        className="w-full rounded h-12 py-2 px-3 text-[#333] bg-[#3f2744]/10"
        name="email"
        type="email"
        placeholder="Email"
        minLength={1}
      />
      <input
        required
        className="w-full rounded h-12 py-2 px-3 text-[#333] bg-[#3f2744]/10"
        name="password"
        type="password"
        placeholder="Senha"
        minLength={6}
      />

      <FormSubmitButton>Entrar</FormSubmitButton>

      {children}
    </form>
  );
};
