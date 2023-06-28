import Link from 'next/link';

import { MdAddCircleOutline } from 'react-icons/md';

type DashboardLayoutProps = React.PropsWithChildren;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <header className="w-full items-center justify-between mb-10 flex">
        <h2 className="text-[#f94d6a] font-medium tracking-[0.5px] text-3xl">
          My meetups
        </h2>

        <Link
          className="bg-[#f94d6a] rounded py-2 px-3 flex items-center gap-2 font-bold tracking-[0.5px] text-white"
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
