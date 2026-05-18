import type { LogLevel } from './types';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
}

const queue: LogEntry[] = [];
let processing = false;

async function processQueue(): Promise<void> {
  if (processing || queue.length === 0) return;
  processing = true;

  while (queue.length > 0) {
    const entry = queue.shift();
    if (!entry) continue;

    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
      const prefix = `[${new Date(entry.timestamp).toISOString()}] [${entry.level.toUpperCase()}]`;
      if (entry.level === 'error') console.error(prefix, entry.message);
      else if (entry.level === 'warn') console.warn(prefix, entry.message);
      else console.log(prefix, entry.message);
    } catch {
      // Drop failed log entries — never block the app
    }
  }

  processing = false;
}

export function log(level: LogLevel, message: string): void {
  queue.push({ level, message, timestamp: Date.now() });
  processQueue();
}

export const logger = {
  info: (msg: string) => log('info', msg),
  warn: (msg: string) => log('warn', msg),
  error: (msg: string) => log('error', msg),
};
