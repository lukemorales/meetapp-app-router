'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

type FormSubmitButtonProps = React.PropsWithChildren;

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  children,
}) => {
  const form = useFormStatus();

  return (
    <button
      className="mt-3 h-12 rounded bg-[#e5556e] font-bold text-white disabled:cursor-progress disabled:opacity-80"
      type="submit"
      disabled={form.pending}
    >
      {children}
    </button>
  );
};
