import { type User as DatabaseUser } from './database';

type SessionUser = Pick<DatabaseUser, 'id' | 'name' | 'email'>;

declare module 'next-auth' {
  interface Session {
    /** Authenticated User */
    user: SessionUser;
  }

  interface User extends SessionUser {}
}
