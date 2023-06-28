import 'server-only';

import { type NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';

import { type User, db, usersTable } from '@/database';
import { comparePassword } from '@/shared/encryption';
import { type UserId } from '@/shared/entity-ids';
import { Email, Password } from '@/shared/validation';
import * as O from '@effect/data/Option';
import { pipe } from '@effect/data/Function';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

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
      async authorize(credentials, _req) {
        const schema = z.object({ email: Email, password: Password });

        const validation = schema.safeParse(credentials);

        if (!validation.success) {
          return null;
        }

        const { email, password } = validation.data;

        const maybeUser = await db.query.users
          .findFirst({
            where: eq(usersTable.email, email),
          })
          .then(O.fromNullable);

        return pipe(
          maybeUser,
          O.match(
            async () => null,
            async ({ passwordHash, ...user }) => {
              const isSamePassword = await comparePassword(
                password,
                passwordHash,
              );

              if (!isSamePassword) {
                return null;
              }

              return user;
            },
          ),
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

export async function getActiveServerSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return session;
}
