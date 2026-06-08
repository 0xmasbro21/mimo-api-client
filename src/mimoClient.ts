import type { AppConfig } from './config.js';
import type { ChatCompletionRequest } from './types.js';

export class MiMoClient {
  constructor(private readonly config: AppConfig) {}

  async models(): Promise<unknown> {
    return this.request('/models', { method: 'GET' });
  }

  async chatCompletions(body: ChatCompletionRequest): Promise<Response> {
    const payload = { ...body, model: body.model ?? this.config.MIMO_DEFAULT_MODEL };
    return this.rawRequest('/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  private async request(path: string, init: RequestInit): Promise<unknown> {
    const res = await this.rawRequest(path, init);
    const text = await res.text();
    if (!res.ok) throw new Error(`MiMo API ${res.status}: ${text.slice(0, 500)}`);
    return text ? JSON.parse(text) : null;
  }

  private async rawRequest(path: string, init: RequestInit): Promise<Response> {
    const url = `${this.config.MIMO_BASE_URL.replace(/\/$/, '')}${path}`;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.config.MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          ...init,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.MIMO_API_KEY}`,
            ...(init.headers ?? {})
          }
        });
        clearTimeout(timer);
        if (res.status >= 500 && attempt < this.config.MAX_RETRIES) continue;
        return res;
      } catch (error) {
        clearTimeout(timer);
        lastError = error;
        if (attempt >= this.config.MAX_RETRIES) break;
      }
    }

    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }
}
