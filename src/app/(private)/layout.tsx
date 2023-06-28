import { getActiveServerSession } from '@/server';

import { Header } from './header';

type PrivateLayoutProps = React.PropsWithChildren;

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const { user } = await getActiveServerSession();

  return (
    <div className="min-h-full flex flex-col w-full">
      <Header profile={user} />

      <main className="max-w-[60rem] my-14 mx-auto px-8 flex-1 w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}
