import Link from 'next/link';

import { MdAddCircleOutline } from 'react-icons/md';

type DashboardLayoutProps = React.PropsWithChildren;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <header className="mb-10 flex w-full items-center justify-between">
        <h2 className="text-3xl font-medium tracking-[0.5px] text-[#f94d6a]">
          My meetups
        </h2>

        <Link
          className="flex items-center gap-2 rounded bg-[#f94d6a] px-3 py-2 font-bold tracking-[0.5px] text-white"
          href="/meetup/create"
        >
          <MdAddCircleOutline color="#fff" size={22} />
          New Meetup
        </Link>
      </header>

      {children}
    </>
  );
}
