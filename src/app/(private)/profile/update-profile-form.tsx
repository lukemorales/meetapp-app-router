'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { type User } from '@/database';
import { toast } from 'react-hot-toast';
import { pipe } from 'effect';
import { E } from '@/shared/effect';

type UpdateProfileFormProps = React.PropsWithChildren<{
  action: (formData: FormData) => Promise<E.Either<unknown, User>>;
}>;

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  action,
  children,
}) => {
  const router = useRouter();
  const session = useSession();

  async function updateProfile(formData: FormData) {
    const updateResult = await action(formData);

    return pipe(
      updateResult,
      E.match({
        onLeft: async (message) => {
          if (typeof message === 'string') toast.error(message);
        },
        onRight: async (updatedUser) => {
          toast.success('Profile updated');
          await session.update(updatedUser);

          router.refresh();
        },
      }),
    );
  }

  return (
    <form className="flex flex-col gap-3" action={updateProfile}>
      {children}
    </form>
  );
};
