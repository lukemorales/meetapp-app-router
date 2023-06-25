import { redirect } from 'next/navigation';
import { AppLogo } from '../app-logo';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

type AuthLayoutProps = React.PropsWithChildren;

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions);

  if (session) {
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
