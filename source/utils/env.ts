export namespace Env {
  export function getString(key: string): string {
    const value = process.env[key];
    if (value === undefined) throw new Error(`Missing environment variable: ${key}`);
    return value;
  }

  export function getBoolean(key: string): boolean {
    const value = process.env[key];
    if (value === undefined) throw new Error(`Missing environment variable: ${key}`);
    return value === 'true' || value === '1';
  }
}
