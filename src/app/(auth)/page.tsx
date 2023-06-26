import { getCsrfToken } from 'next-auth/react';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { AuthForm } from './auth-form';

export default async function SignInPage({ params }: any) {
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

      <p className="mt-14 flex flex-col justify-between items-center cursor-default text-[#777] leading-4">
        Don’t have an account?
        <Link
          href="/sign-up"
          className="inline-block py-2 px-5 text-[#e5556e] text-base font-bold"
        >
          Register now
        </Link>
      </p>
    </AuthForm>
  );
}
