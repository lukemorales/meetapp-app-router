'use client';

import { User } from '@/database';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as E from '@effect/data/Either';
import { pipe } from '@effect/data/Function';
import { toast } from 'react-hot-toast';

type UpdateProfileFormProps = React.PropsWithChildren<{
  action: (formData: FormData) => Promise<E.Either<string, User>>;
}>;

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  action,
  children,
}) => {
  const session = useSession();
  const router = useRouter();

  async function updateProfile(formData: FormData) {
    const updateResult = await action(formData);

    return pipe(
      updateResult,
      E.match(
        async (message) => {
          toast.error(message);
        },
        async (updatedUser) => {
          toast.success('Profile updated');
          await session.update(updatedUser);

          router.refresh();
        },
      ),
    );
  }

  return (
    <form className="flex flex-col gap-3" action={updateProfile}>
      {children}
    </form>
  );
};
