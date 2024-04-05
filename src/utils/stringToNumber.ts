export function stringToNumber(
  str: string,
  defaultValue: number | null = null
): number | null {
  const parsed = parseInt(str, 10);

  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}
