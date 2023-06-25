import { db, usersTable } from '@/database';
import { Email, Password } from '@/shared/validation';
import { eq } from 'drizzle-orm';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import * as E from '@effect/data/Either';
import { pipe } from '@effect/data/Function';
import { compare } from 'bcryptjs';
import { UserId } from '@/shared/entity-ids';

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

        const user = await db.query.usersTable
          .findFirst({
            where: eq(usersTable.email, email),
          })
          .then(E.fromNullable(() => 'User not found' as const));

        return pipe(
          user,
          E.match(
            (_error) => null,
            async ({ passwordHash, ...user }) => {
              const isSamePassword = await compare(password, passwordHash);

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
    jwt({ token }) {
      return token;
    },
    session({ session, token }) {
      session.user = {
        id: (token.sub ?? session.user.id) as UserId,
        name: token.name ?? session.user.name,
        email: (token.email ?? session.user.email) as Email,
      };

      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
