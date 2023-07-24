import { getActiveServerSession } from '@/server';
import { FX } from '@/shared/effect';
import { pipe } from 'effect';

import { Header } from './header';

type PrivateLayoutProps = React.PropsWithChildren;

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  return pipe(
    getActiveServerSession(),
    FX.map(({ user }) => (
      // eslint-disable-next-line react/jsx-key
      <div className="flex min-h-full w-full flex-col">
        <Header profile={user} />

        <main className="mx-auto my-14 flex w-full max-w-[60rem] flex-1 flex-col px-8">
          {children}
        </main>
      </div>
    )),
    FX.runPromise,
  );
}
