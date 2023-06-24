'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export const AuthFormSubmitButton: React.FC<{ label: string }> = ({
  label,
}) => {
  const form = useFormStatus();

  return (
    <button
      className="mt-3 h-12 bg-[#e5556e] font-bold text-white rounded disabled:opacity-80 disabled:cursor-progress"
      type="submit"
      disabled={form.pending}
    >
      {label}
    </button>
  );
};
