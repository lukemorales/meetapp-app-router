import { getActiveServerSession } from '@/server';

import { Header } from './header';

type PrivateLayoutProps = React.PropsWithChildren;

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const { user } = await getActiveServerSession();

  return (
    <div className="flex min-h-full w-full flex-col">
      <Header profile={user} />

      <main className="mx-auto my-14 flex w-full max-w-[60rem] flex-1 flex-col px-8">
        {children}
      </main>
    </div>
  );
}
