'use client';

import { signOut } from 'next-auth/react';

import { MdExitToApp } from 'react-icons/md';

export const SignOutButton: React.FC = () => (
  <button
    type="button"
    className="mt-4 flex h-12 items-center gap-3 self-center border-0 bg-none font-bold text-white opacity-70"
    onClick={() => signOut()}
  >
    Sign out
    <MdExitToApp color="#fff" size={20} />
  </button>
);
