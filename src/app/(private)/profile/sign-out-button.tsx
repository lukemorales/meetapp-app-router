'use client';

import { signOut } from 'next-auth/react';
import { MdExitToApp } from 'react-icons/md';

export const SignOutButton: React.FC = () => {
  return (
    <button
      type="button"
      className="bg-none text-white font-bold border-0 flex items-center self-center h-12 mt-4 opacity-70 gap-3"
      onClick={() => signOut()}
    >
      Sign out
      <MdExitToApp color="#fff" size={20} />
    </button>
  );
};
