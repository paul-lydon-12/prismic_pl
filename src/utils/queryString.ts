export function getStringFromQueryString(
  value: string | Array<string | undefined> | undefined
): string | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
