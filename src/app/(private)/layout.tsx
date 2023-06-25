import { redirect } from 'next/navigation';
import { Header } from './header';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';

type PrivateLayoutProps = React.PropsWithChildren;

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-full flex flex-col w-full">
      <Header profile={session.user} />

      <main className="max-w-[60rem] my-14 mx-auto px-8 flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
