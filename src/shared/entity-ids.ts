import { z } from 'zod';

const brandedId = <T extends string>(entity: T) =>
  z.string().min(1).brand(entity);

export const UserId = brandedId('UserId');
export type UserId = z.infer<typeof UserId>;

export const MeetupId = brandedId('MeetupId');
export type MeetupId = z.infer<typeof MeetupId>;
