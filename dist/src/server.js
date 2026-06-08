import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import { loadConfig } from './config.js';
import { MiMoClient } from './mimoClient.js';
import { redact } from './redact.js';
const config = loadConfig();
const log = pino({ level: config.LOG_LEVEL });
const app = express();
const client = new MiMoClient(config);
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
    if (!config.LOCAL_API_KEY)
        return next();
    const token = req.header('Authorization')?.replace(/^Bearer\s+/i, '');
    if (req.path === '/health')
        return next();
    if (token !== config.LOCAL_API_KEY)
        return res.status(401).json({ error: { message: 'Unauthorized' } });
    next();
});
app.get('/health', (_req, res) => {
    res.json({ ok: true, provider: 'xiaomi-mimo', baseUrl: config.MIMO_BASE_URL, model: config.MIMO_DEFAULT_MODEL });
});
app.get('/v1/models', async (_req, res) => {
    try {
        res.json(await client.models());
    }
    catch (error) {
        log.error(redact(String(error)));
        res.status(502).json({ error: { message: 'Unable to fetch MiMo models' } });
    }
});
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const upstream = await client.chatCompletions(req.body);
        res.status(upstream.status);
        upstream.headers.forEach((value, key) => {
            if (['content-type', 'content-length'].includes(key.toLowerCase()))
                res.setHeader(key, value);
        });
        if (upstream.body) {
            return upstream.body.pipeTo(new WritableStream({ write(chunk) { res.write(Buffer.from(chunk)); }, close() { res.end(); } }));
        }
        res.end(await upstream.text());
    }
    catch (error) {
        log.error(redact(String(error)));
        res.status(502).json({ error: { message: 'MiMo upstream request failed' } });
    }
});
app.listen(config.PORT, () => {
    log.info(`MiMo gateway listening on 127.0.0.1:${config.PORT}`);
});
