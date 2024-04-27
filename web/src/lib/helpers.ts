export function truncateString(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}
