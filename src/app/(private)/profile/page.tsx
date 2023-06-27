import { FormSubmitButton } from '@/components';
import { db, usersTable } from '@/database';
import { getActiveServerSession } from '@/server';
import { comparePassword, encryptPassword } from '@/shared/encryption';
import { Email, Password } from '@/shared/validation';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { PasswordInputs } from './password-inputs';
import { SignOutButton } from './sign-out-button';
import { UpdateProfileForm } from './update-profile-form';
import * as E from '@effect/data/Either';

export const metadata: Metadata = {
  title: 'My profile',
};

export default async function Profile() {
  const { user } = await getActiveServerSession();

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
        password,
        newPassword: passwords['new-password'],
      }));

    const { password, newPassword, ...values } = schema.parse(formData);

    const databaseUser = await db.query.users.findFirst({
      where: eq(usersTable.id, user.id),
    });

    if (!databaseUser) {
      notFound();
    }

    if (password && newPassword) {
      const isSamePassword = await comparePassword(
        password,
        databaseUser.passwordHash,
      );

      if (!isSamePassword) {
        return E.left('Invalid password');
      }

      return db
        .update(usersTable)
        .set({
          ...values,
          passwordHash: await encryptPassword(password),
        })
        .where(eq(usersTable.id, user.id))
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          updatedAt: usersTable.updatedAt,
          createdAt: usersTable.createdAt,
        })
        .then(([user]) => E.right(user));
    }

    return db
      .update(usersTable)
      .set(values)
      .where(eq(usersTable.id, user.id))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        updatedAt: usersTable.updatedAt,
        createdAt: usersTable.createdAt,
      })
      .then(([user]) => E.right(user));
  }

  return (
    <div className="w-full max-w-[600px] my-12 mx-auto px-7 flex flex-col">
      <UpdateProfileForm action={updateProfile}>
        <input
          required
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          name="name"
          type="text"
          placeholder="Full name"
          minLength={1}
          defaultValue={user.name}
        />
        <input
          required
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          name="email"
          type="email"
          placeholder="Email"
          minLength={1}
          defaultValue={user.email}
        />

        <fieldset className="flex flex-col gap-3 mt-5">
          <PasswordInputs />
        </fieldset>

        <FormSubmitButton>Save profile</FormSubmitButton>
      </UpdateProfileForm>

      <SignOutButton />
    </div>
  );
}
