'use client';

import { SessionProvider } from 'next-auth/react';

type ProvidersProps = React.PropsWithChildren;

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
