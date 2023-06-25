import { customType, timestamp } from 'drizzle-orm/pg-core';

/**
 * Returns the base ID with any prefixes removed.
 */
export const unprefixId = (id: string): string =>
  id.split('_').slice(-1).join('_');

export const entityId = <T extends string>(prefix: T) =>
  customType<{ data: string }>({
    dataType() {
      return 'varchar';
    },
    toDriver(data) {
      return unprefixId(data);
    },
    fromDriver(value) {
      return `${prefix}_${value}`;
    },
  });

export const timestamps = {
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
};
