import Link from 'next/link';
import { AuthFormSubmitButton } from './auth-form-submit-button';

export default function SignInPage() {
  async function authenticate(formData: FormData) {
    'use server';

    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    await new Promise((res) => setTimeout(res, 5000));
  }

  return (
    <form
      action={authenticate}
      className="flex flex-col mt-10 relative z-20 gap-3"
    >
      <input
        required
        className="w-full rounded h-12 py-2 px-3 text-[#333] bg-[#3f2744]/10"
        name="email"
        type="email"
        placeholder="Email"
        minLength={1}
      />
      <input
        required
        className="w-full rounded h-12 py-2 px-3 text-[#333] bg-[#3f2744]/10"
        name="password"
        type="password"
        placeholder="Senha"
        minLength={6}
      />

      <AuthFormSubmitButton label="Entrar" />

      <p className="mt-14 flex flex-col justify-between items-center cursor-default text-[#777] leading-4">
        Ainda não é cadastrado?
        <Link
          href="/sign-up"
          className="inline-block py-2 px-5 text-[#e5556e] text-base font-bold"
        >
          Criar uma conta
        </Link>
      </p>
    </form>
  );
}
