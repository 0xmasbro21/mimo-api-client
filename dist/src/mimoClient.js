export class MiMoClient {
    config;
    constructor(config) {
        this.config = config;
    }
    async models() {
        return this.request('/models', { method: 'GET' });
    }
    async chatCompletions(body) {
        const payload = { ...body, model: body.model ?? this.config.MIMO_DEFAULT_MODEL };
        return this.rawRequest('/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
    async request(path, init) {
        const res = await this.rawRequest(path, init);
        const text = await res.text();
        if (!res.ok)
            throw new Error(`MiMo API ${res.status}: ${text.slice(0, 500)}`);
        return text ? JSON.parse(text) : null;
    }
    async rawRequest(path, init) {
        const url = `${this.config.MIMO_BASE_URL.replace(/\/$/, '')}${path}`;
        let lastError;
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
                if (res.status >= 500 && attempt < this.config.MAX_RETRIES)
                    continue;
                return res;
            }
            catch (error) {
                clearTimeout(timer);
                lastError = error;
                if (attempt >= this.config.MAX_RETRIES)
                    break;
            }
        }
        throw lastError instanceof Error ? lastError : new Error(String(lastError));
    }
}
