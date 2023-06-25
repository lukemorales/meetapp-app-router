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
      className="flex items-center bg-none ml-7 text-[#eee] gap-1"
      type="button"
      onClick={router.back}
    >
      <MdArrowBack size={18} />
      Voltar
    </button>
  );
};
