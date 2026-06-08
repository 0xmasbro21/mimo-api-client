export function redact(input: string): string {
  return input
    .replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, 'Bearer [REDACTED]')
    .replace(/sk-[A-Za-z0-9._\-]+/g, 'sk-[REDACTED]')
    .replace(/mimo_[A-Za-z0-9._\-]+/g, 'mimo_[REDACTED]');
}
