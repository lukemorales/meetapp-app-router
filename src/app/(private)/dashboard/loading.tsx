'use client';

import { TailSpin } from 'react-loader-spinner';

export default function DashboardLoading() {
  return (
    <aside className="flex items-center justify-center h-full flex-1">
      <TailSpin color="#F94D6A" width={48} height={48} />
    </aside>
  );
}
