import { describe, expect, it } from 'vitest';
import { redact } from '../src/redact.js';

describe('redact', () => {
  it('redacts bearer tokens', () => {
    expect(redact('Authorization: Bearer abc.def.ghi')).toContain('Bearer [REDACTED]');
  });
});
