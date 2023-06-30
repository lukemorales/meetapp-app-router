'use client';

import { usePathname, useRouter } from 'next/navigation';

import { MdArrowBack } from 'react-icons/md';

export const HeaderBackButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <button
      className="ml-7 flex items-center gap-1 bg-none text-[#eee]"
      type="button"
      onClick={router.back}
    >
      <MdArrowBack size={18} />
      Back
    </button>
  );
};
