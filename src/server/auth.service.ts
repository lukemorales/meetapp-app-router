import 'server-only';

import { type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';

import { type User, db, usersTable, type DatabaseUser } from '@/database';
import { comparePassword } from '@/shared/encryption';
import { type UserId } from '@/shared/entity-ids';
import { Email, Password } from '@/shared/validation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { identity, pipe } from 'effect';
import { O, FX } from '@/shared/effect';
import { constNull } from 'effect/Function';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@provider.com',
        },
        password: {
          label: 'Senha',
          type: 'password',
        },
      },
      authorize(credentials, _req) {
        type Credentials = z.infer<typeof schema>;
        const schema = z.object({ email: Email, password: Password });

        function verifyUserCredentials(password: Password) {
          return ({ passwordHash, ...user }: DatabaseUser) =>
            pipe(
              comparePassword(password, passwordHash),
              FX.if({
                onFalse: FX.fail('Invalid password' as const),
                onTrue: FX.succeed(user),
              }),
            );
        }

        function authenticateUser({ email, password }: Credentials) {
          return pipe(
            FX.tryPromise(() =>
              db.query.users.findFirst({ where: eq(usersTable.email, email) }),
            ),
            FX.flatMap(O.fromNullable),
            FX.flatMap(verifyUserCredentials(password)),
          );
        }

        return pipe(
          FX.try({
            try: () => schema.parse(credentials),
            catch: () => 'Invalid Credentials' as const,
          }),
          FX.flatMap(authenticateUser),
          FX.match({ onFailure: constNull, onSuccess: identity }),
          FX.runPromise,
        );
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      const urlObject = new URL(url);
      if (urlObject.origin === baseUrl) {
        if (urlObject.pathname === '/') {
          for (const param of urlObject.searchParams.keys()) {
            urlObject.searchParams.delete(param);
          }

          return `${urlObject}dashboard`;
        }

        return url;
      }

      return baseUrl;
    },
    async jwt({ token, trigger, session }) {
      const mutatedToken = { ...token };

      if (trigger === 'update') {
        const sessionUpdate = session as Partial<User>;

        mutatedToken.name = sessionUpdate.name ?? token.name;
        mutatedToken.email = sessionUpdate.email ?? token.email;
      }

      return mutatedToken;
    },
    session({ session, token }) {
      const mutatedSession = { ...session };

      mutatedSession.user = {
        id: (token.sub ?? session.user.id) as UserId,
        name: token.name ?? session.user.name,
        email: (token.email ?? session.user.email) as Email,
      };

      return mutatedSession;
    },
  },
  pages: {
    signIn: '/',
  },
};

export function getActiveServerSession() {
  return pipe(
    FX.promise(() => getServerSession(authOptions)),
    FX.flatMap(O.fromNullable),
    FX.match({
      onFailure: () => redirect('/'),
      onSuccess: identity,
    }),
  );
}
