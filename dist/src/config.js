import { z } from 'zod';
const schema = z.object({
    MIMO_API_KEY: z.string().min(1),
    MIMO_BASE_URL: z.string().url().default('https://token-plan-sgp.xiaomimimo.com/v1'),
    MIMO_DEFAULT_MODEL: z.string().default('mimo-v2.5-pro'),
    LOCAL_API_KEY: z.string().optional(),
    PORT: z.coerce.number().int().positive().default(8787),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(90000),
    MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
    LOG_LEVEL: z.string().default('info')
});
export function loadConfig(env = process.env) {
    return schema.parse(env);
}
