'use client';

import { SessionProvider } from 'next-auth/react';

import { Toaster } from 'react-hot-toast';

type ProvidersProps = React.PropsWithChildren;

export const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <SessionProvider>
    {children}
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: '#402845',
          color: '#ffffff',
          fontSize: '0.75rem',
          border: '1px solid #e65175',
        },
      }}
    />
  </SessionProvider>
);
