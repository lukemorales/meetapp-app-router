import { type Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

import { AppLogo } from '../app-logo';
import { HeaderBackButton } from './header-back-button';

type HeaderProps = {
  profile: Session['user'];
};

export const Header: React.FC<HeaderProps> = ({ profile }) => (
  <header className="bg-black/30 px-8">
    <div className="mx-auto flex max-w-[56.25rem] items-center justify-between py-4">
      <nav className="flex items-center">
        <h1>
          <Link href="/dashboard">
            <AppLogo size={32} />
          </Link>
        </h1>

        <HeaderBackButton />
      </nav>

      <section>
        <Link
          className="flex items-center gap-4 text-[#f5ebec]"
          href="/profile"
        >
          <Image
            className="rounded-full border-[2px] border-[#8e3343]"
            height={40}
            width={40}
            src={`https://ui-avatars.com/api/?background=D44059&color=fff&name=${profile.name}`}
            alt={profile.name}
          />
          {profile.name}
        </Link>
      </section>
    </div>
  </header>
);
