'use client';

import { usePathname, useRouter } from 'next/navigation';

import { B } from '@/shared/effect';
import { pipe } from 'effect';
import { constNull } from 'effect/Function';
import { MdArrowBack } from 'react-icons/md';

export const HeaderBackButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return pipe(
    pathname === '/dashboard',
    B.match({
      onTrue: constNull,
      onFalse: () => (
        <button
          className="ml-7 flex items-center gap-1 bg-none text-[#eee]"
          type="button"
          onClick={router.back}
        >
          <MdArrowBack size={18} />
          Back
        </button>
      ),
    }),
  );
};
