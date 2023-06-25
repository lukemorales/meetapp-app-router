import { FormSubmitButton } from '@/components';
import { SignOutButton } from './sign-out-button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  const { user } = session;

  async function updateProfile(formData: FormData) {
    'use server';
  }

  async function logout() {
    'use server';
  }

  return (
    <div className="max-w-[600px] my-12 mx-auto px-7 flex flex-col">
      <form className="flex flex-col gap-3" action={updateProfile}>
        <input
          required
          className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
          name="name"
          type="text"
          placeholder="Nome completo"
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
            placeholder="Senha atual"
            minLength={1}
          />

          <input
            required
            className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
            name="new-password"
            type="password"
            placeholder="Nova senha"
            minLength={1}
          />
          <input
            required
            className="w-full rounded h-12 py-2 px-3 text-[#515366] bg-white"
            name="confirm-password"
            type="password"
            placeholder="Confirmar nova senha"
            minLength={1}
          />
        </fieldset>

        <FormSubmitButton>Atualizar perfil</FormSubmitButton>
      </form>

      <SignOutButton />
    </div>
  );
}
