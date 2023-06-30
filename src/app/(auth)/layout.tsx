import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/server';

import { AppLogo } from '../app-logo';

type AuthLayoutProps = React.PropsWithChildren;

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-full p-8">
      <main className="m-auto w-full max-w-[25rem] rounded bg-white p-10 text-center">
        <AppLogo />

        {children}
      </main>
    </div>
  );
}
