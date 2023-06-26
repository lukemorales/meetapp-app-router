/**
 * Returns the base ID with any prefixes removed.
 */
export const unprefixId = (id: string): string =>
  id.split('_').slice(-1).join('_');
