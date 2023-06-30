import { getCsrfToken } from 'next-auth/react';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { AuthForm } from './auth-form';

export default async function SignInPage() {
  // somehow needed in the component body
  // for `getCsrfToken` to actually get the token value
  cookies();

  return (
    <AuthForm>
      <input
        name="csrfToken"
        type="hidden"
        defaultValue={await getCsrfToken()}
      />

      <p className="mt-14 flex cursor-default flex-col items-center justify-between leading-4 text-[#777]">
        Don’t have an account?
        <Link
          href="/sign-up"
          className="inline-block px-5 py-2 text-base font-bold text-[#e5556e]"
        >
          Register now
        </Link>
      </p>
    </AuthForm>
  );
}
