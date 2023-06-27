'use client';

import { User } from '@/database';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type UpdateProfileFormProps = React.PropsWithChildren<{
  action: (formData: FormData) => Promise<User>;
}>;

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  action,
  children,
}) => {
  const session = useSession();
  const router = useRouter();

  async function updateProfile(formData: FormData) {
    const updatedUser = await action(formData);
    await session.update(updatedUser);

    router.refresh();
  }

  return (
    <form className="flex flex-col gap-3" action={updateProfile}>
      {children}
    </form>
  );
};
