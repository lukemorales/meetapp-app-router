import { redirect } from 'next/navigation';

import { getActiveServerSession } from '@/server';
import { FX } from '@/shared/effect';
import { pipe } from 'effect';

import { AppLogo } from '../app-logo';

type AuthLayoutProps = React.PropsWithChildren;

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return pipe(
    getActiveServerSession(),
    FX.match({
      onSuccess: () => redirect('/dashboard'),
      onFailure: () => (
        <div className="flex min-h-full p-8">
          <main className="m-auto w-full max-w-[25rem] rounded bg-white p-10 text-center">
            <AppLogo />

            {children}
          </main>
        </div>
      ),
    }),
    FX.runPromise,
  );
}
