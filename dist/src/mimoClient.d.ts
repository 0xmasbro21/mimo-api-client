import type { AppConfig } from './config.js';
import type { ChatCompletionRequest } from './types.js';
export declare class MiMoClient {
    private readonly config;
    constructor(config: AppConfig);
    models(): Promise<unknown>;
    chatCompletions(body: ChatCompletionRequest): Promise<Response>;
    private request;
    private rawRequest;
}
