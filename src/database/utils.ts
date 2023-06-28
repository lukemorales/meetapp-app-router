import { unprefixId } from '@/shared/unprefix-id';
import { customType, timestamp } from 'drizzle-orm/pg-core';

/**
 * Formats the db schema by removing `Table` suffix from keys
 *
 * @example
 * // without formatDbSchema
 * export const db = drizzle(postgresConnection, {
 *   schema: { usersTable, meetupsTable }
 * });
 *
 * await db.query.usersTable.findFirst()
 *
 * // with formatDbSchema
 * export const db = drizzle(postgresConnection, {
 *   schema: formatDbSchema({ usersTable, meetupsTable })
 * });
 *
 * await db.query.users.findFirst()
 */
export const formatDbSchema = <T extends object>(schema: T) => {
  type FormattedSchemaKeys<K extends string> = {
    [P in K]: P extends `${infer R}Table` ? R : P;
  }[K];

  type Schema<S extends object> = {
    [K in FormattedSchemaKeys<keyof S & string>]: `${K}Table` extends keyof S
      ? S[`${K}Table`]
      : K extends keyof S
      ? S[K]
      : never;
  };

  return Object.keys(schema).reduce((acc, key) => {
    const value = schema[key as keyof typeof schema];
    const formattedKey = key.endsWith('Table')
      ? key.slice(0, -'table'.length)
      : key;

    acc[formattedKey as keyof typeof acc] = value;

    return acc;
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
  }, {} as Schema<typeof schema>);
};

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
