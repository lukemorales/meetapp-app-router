import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppLogo } from '../app-logo';

export default function AuthLayout({ children }: React.PropsWithChildren) {
  const cookiesStore = cookies();
  const hasAuthCookie = cookiesStore.has('auth');

  if (hasAuthCookie) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-full flex p-8">
      <main className="bg-white w-full max-w-[25rem] m-auto p-10 rounded text-center">
        <AppLogo />

        {children}
      </main>
    </div>
  );
}
