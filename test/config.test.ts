import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
  it('parses valid environment', () => {
    const cfg = loadConfig({ MIMO_API_KEY: 'test-key', PORT: '8787' });
    expect(cfg.PORT).toBe(8787);
    expect(cfg.MIMO_DEFAULT_MODEL).toBe('mimo-v2.5-pro');
  });
});
