import { type Metadata } from 'next';

import { FormSubmitButton } from '@/components';
import { getActiveServerSession, usersService } from '@/server';
import { Email, Password } from '@/shared/validation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { FX } from '@/shared/effect';

import { PasswordInputs } from './password-inputs';
import { SignOutButton } from './sign-out-button';
import { UpdateProfileForm } from './update-profile-form';

export const metadata: Metadata = {
  title: 'My profile',
};

export default async function Profile() {
  const { user } = await getActiveServerSession().pipe(FX.runPromise);

  async function updateProfile(formData: FormData) {
    'use server';

    const schema = zfd
      .formData({
        name: z.string().min(1),
        email: Email,
        password: z.union([Password, z.literal('')]),
        'new-password': z.union([Password, z.literal('')]),
        'confirm-password': z.union([Password, z.literal('')]),
      })
      .refine((data) => {
        if (data['new-password']) {
          return (
            data.password && data['new-password'] === data['confirm-password']
          );
        }

        return true;
      })
      .transform(({ name, email, password, ...passwords }) => ({
        name,
        email,
        password: password || undefined,
        newPassword: passwords['new-password'] || undefined,
      }));

    return usersService
      .updateUser(user.id, schema.parse(formData))
      .pipe(FX.either)
      .pipe(FX.runPromise);
  }

  return (
    <div className="mx-auto my-12 flex w-full max-w-[600px] flex-col px-7">
      <UpdateProfileForm action={updateProfile}>
        <input
          required
          className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
          name="name"
          type="text"
          placeholder="Full name"
          minLength={1}
          defaultValue={user.name}
        />
        <input
          required
          className="h-12 w-full rounded bg-white px-3 py-2 text-[#515366]"
          name="email"
          type="email"
          placeholder="Email"
          minLength={1}
          defaultValue={user.email}
        />

        <fieldset className="mt-5 flex flex-col gap-3">
          <PasswordInputs />
        </fieldset>

        <FormSubmitButton>Save profile</FormSubmitButton>
      </UpdateProfileForm>

      <SignOutButton />
    </div>
  );
}
