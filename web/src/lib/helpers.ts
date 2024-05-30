export function truncateString(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

export function invalidUrl(url: string): boolean {
  try {
    new URL(url);
    return false;
  } catch {
    return true;
  }
}
