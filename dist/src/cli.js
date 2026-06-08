#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { loadConfig } from './config.js';
import { MiMoClient } from './mimoClient.js';
const program = new Command();
const client = new MiMoClient(loadConfig());
program.name('mimo-gateway').description('CLI for Xiaomi MiMo API smoke tests');
program.command('models').description('List MiMo models').action(async () => {
    console.log(JSON.stringify(await client.models(), null, 2));
});
program.command('chat').argument('<prompt>').option('-m, --model <model>').action(async (prompt, options) => {
    const res = await client.chatCompletions({
        model: options.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
    });
    console.log(await res.text());
});
program.parseAsync();
