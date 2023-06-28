import './globals.css';

import { type Metadata } from 'next';

import { Providers } from './providers';

type RootLayoutProps = React.PropsWithChildren;

export const metadata: Metadata = {
  title: {
    default: 'MeetApp',
    template: '%s | MeetApp',
  },
  description: 'Your next meetup is here',
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
