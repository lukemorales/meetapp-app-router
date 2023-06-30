'use client';

import { TailSpin } from 'react-loader-spinner';

export default function MeetupLoading() {
  return (
    <aside className="flex h-full flex-1 items-center justify-center">
      <TailSpin color="#F94D6A" width={48} height={48} />
    </aside>
  );
}
