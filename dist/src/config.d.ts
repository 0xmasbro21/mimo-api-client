import { z } from 'zod';
declare const schema: z.ZodObject<{
    MIMO_API_KEY: z.ZodString;
    MIMO_BASE_URL: z.ZodDefault<z.ZodString>;
    MIMO_DEFAULT_MODEL: z.ZodDefault<z.ZodString>;
    LOCAL_API_KEY: z.ZodOptional<z.ZodString>;
    PORT: z.ZodDefault<z.ZodNumber>;
    REQUEST_TIMEOUT_MS: z.ZodDefault<z.ZodNumber>;
    MAX_RETRIES: z.ZodDefault<z.ZodNumber>;
    LOG_LEVEL: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    MIMO_API_KEY: string;
    MIMO_BASE_URL: string;
    MIMO_DEFAULT_MODEL: string;
    PORT: number;
    REQUEST_TIMEOUT_MS: number;
    MAX_RETRIES: number;
    LOG_LEVEL: string;
    LOCAL_API_KEY?: string | undefined;
}, {
    MIMO_API_KEY: string;
    MIMO_BASE_URL?: string | undefined;
    MIMO_DEFAULT_MODEL?: string | undefined;
    LOCAL_API_KEY?: string | undefined;
    PORT?: number | undefined;
    REQUEST_TIMEOUT_MS?: number | undefined;
    MAX_RETRIES?: number | undefined;
    LOG_LEVEL?: string | undefined;
}>;
export type AppConfig = z.infer<typeof schema>;
export declare function loadConfig(env?: NodeJS.ProcessEnv): AppConfig;
export {};
