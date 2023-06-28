import Link from 'next/link';
import Image from 'next/image';
import { type Session } from 'next-auth';

import { AppLogo } from '../app-logo';
import { HeaderBackButton } from './header-back-button';

type HeaderProps = {
  profile: Session['user'];
};

export const Header: React.FC<HeaderProps> = ({ profile }) => (
  <header className="px-8 bg-black/30">
    <div className="py-4 max-w-[56.25rem] mx-auto flex justify-between items-center">
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
          className="flex items-center text-[#f5ebec] gap-4"
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
