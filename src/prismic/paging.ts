// Prismic uses base64 encoding of the string "arrayconnection:N" to create
// cursors in the GraphQL API. Here we abuse that. For reasons.
// disable deprecation warning for atob

const base64ToStr =
  typeof window === 'function' && typeof atob !== 'function'
    ? (s: string) => Buffer.from(s, 'base64').toString('binary')
    : atob;
const strToBase64 =
  typeof window === 'function' && typeof atob !== 'function'
    ? (s: string) => Buffer.from(s).toString('base64')
    : btoa;

export function isFirstCursor(cursor?: string | null): boolean {
  if (!cursor) {
    return false;
  }

  const decoded = base64ToStr(cursor);

  return decoded.endsWith(':0');
}

export function pageNumberToCursor(page: number, perPage: number): string {
  if (!page) {
    return '';
  }

  return strToBase64(`arrayconnection:${(Math.max(1, page) - 1) * perPage - 1}`);
}
