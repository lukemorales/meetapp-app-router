import { FormSubmitButton } from '@/components';
import { getActiveSessionServer } from '@/server';
import { Metadata } from 'next';
import { SignOutButton } from './sign-out-button';

export const metadata: Metadata = {
  title: 'My profile',
};

export default async function Profile() {
  const { user } = await getActiveSessionServer();

  // TODO: implement profile update
  async function updateProfile(formData: FormData) {
    'use server';
  }

  return (
    <div className="w-full max-w-[600px] my-12 mx-auto px-7 flex flex-col">
      <form className="flex flex-col gap-3" action={updateProfile}>
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
          <input
            required
            className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
            name="password"
            type="password"
            placeholder="Current password"
            minLength={1}
          />

          <input
            required
            className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
            name="new-password"
            type="password"
            placeholder="New password"
            minLength={1}
          />
          <input
            required
            className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
            name="confirm-password"
            type="password"
            placeholder="Confirm password"
            minLength={1}
          />
        </fieldset>

        <FormSubmitButton>Save profile</FormSubmitButton>
      </form>

      <SignOutButton />
    </div>
  );
}
