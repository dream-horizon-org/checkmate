#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import 'dotenv/config';
import fg from 'fast-glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ToolModule, LogLevel } from './types/mcp.js';

// =====================
// CONFIGURATION & VALIDATION
// =====================

const ConfigSchema = z.object({
  CHECKMATE_API_BASE: z.string().url('Invalid CHECKMATE_API_BASE URL'),
  CHECKMATE_API_TOKEN: z.string().min(1, 'CHECKMATE_API_TOKEN is required'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug'] as const).default('info'),
  REQUEST_TIMEOUT: z.coerce.number().int().positive().default(30000),
  ENABLE_RETRY: z.coerce.boolean().default(false),
  MAX_RETRIES: z.coerce.number().int().positive().default(3),
});

type Config = z.infer<typeof ConfigSchema>;

let config: Config;

try {
  config = ConfigSchema.parse({
    CHECKMATE_API_BASE: process.env.CHECKMATE_API_BASE,
    CHECKMATE_API_TOKEN: process.env.CHECKMATE_API_TOKEN,
    LOG_LEVEL: process.env.LOG_LEVEL,
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
    ENABLE_RETRY: process.env.ENABLE_RETRY,
    MAX_RETRIES: process.env.MAX_RETRIES,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Configuration Error:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    console.error('\n📝 Please check your .env file and ensure all required variables are set.');
    console.error('   See .env.example for reference.\n');
    process.exit(1);
  }
  throw error;
}

// =====================
// LOGGING UTILITY
// =====================

const LOG_LEVELS: Record<LogLevel, number> = { error: 0, warn: 1, info: 2, debug: 3 };

class Logger {
  private level: number;

  constructor(level: LogLevel) {
    this.level = LOG_LEVELS[level];
  }

  private log(level: LogLevel, ...args: unknown[]) {
    if (LOG_LEVELS[level] <= this.level) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      console.error(prefix, ...args);
    }
  }

  error(...args: unknown[]) {
    this.log('error', ...args);
  }
  warn(...args: unknown[]) {
    this.log('warn', ...args);
  }
  info(...args: unknown[]) {
    this.log('info', ...args);
  }
  debug(...args: unknown[]) {
    this.log('debug', ...args);
  }
}

const logger = new Logger(config.LOG_LEVEL);

// =====================
// ERROR TYPES
// =====================

class CheckmateAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseBody?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'CheckmateAPIError';
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// =====================
// HTTP CLIENT WITH RETRY
// =====================

interface RequestOptions extends RequestInit {
  timeout?: number;
  retry?: boolean;
  maxRetries?: number;
}

async function makeRequestWithRetry<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    timeout = config.REQUEST_TIMEOUT,
    retry = config.ENABLE_RETRY,
    maxRetries = config.MAX_RETRIES,
    ...fetchOptions
  } = options;

  const attemptRequest = async (attemptNumber: number): Promise<T | null> => {
    // Ensure proper URL construction without double slashes
    const url = `${config.CHECKMATE_API_BASE}/${path}`.replace(/([^:]?)\/\/+/g, '$1/');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      logger.debug(`Fetch attempt ${attemptNumber}/${maxRetries + 1}:`, url);

      const response = await fetch(url, {
        ...fetchOptions,
        method: fetchOptions.method ?? 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${config.CHECKMATE_API_TOKEN}`,
          'User-Agent': 'Checkmate-MCP-Server/1.0.0',
          ...(fetchOptions.headers ?? {}),
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody: string = await response.text().catch(() => '(no response body)');
        logger.error(`HTTP ${response.status} ${response.statusText}:`, errorBody);

        let parsedBody: Record<string, unknown> | undefined;
        try {
          parsedBody = JSON.parse(errorBody) as Record<string, unknown>;
        } catch {
          // Not JSON, leave as undefined
        }

        throw new CheckmateAPIError(
          `HTTP error! status: ${response.status}`,
          response.status,
          parsedBody,
        );
      }

      const data = (await response.json()) as T;
      logger.info(`✓ Request successful: ${fetchOptions.method ?? 'GET'} ${path}`);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof CheckmateAPIError) {
        // Don't retry on client errors (4xx)
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          logger.error('Client error, not retrying:', error.message);
          return null;
        }
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(`Request timeout after ${timeout}ms`);
      }

      // Retry logic for network errors and 5xx errors
      if (retry && attemptNumber < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attemptNumber), 10000); // Exponential backoff
        logger.warn(`Retrying after ${delay}ms (attempt ${attemptNumber + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return attemptRequest(attemptNumber + 1);
      }

      logger.error('Request failed:', error);

      if (error instanceof CheckmateAPIError || error instanceof TimeoutError) {
        throw error;
      }

      throw new NetworkError('Network request failed', error as Error);
    }
  };

  try {
    const result = await attemptRequest(1);
    if (result === null) {
      throw new Error('No response from server');
    }
    return result;
  } catch (error) {
    logger.error('Final error after all retry attempts:', error);
    throw error;
  }
}

import { registerAllResources } from './resources.js';

// =====================
// SERVER SETUP
// =====================

const server = new McpServer({
  name: 'checkmate-mcp',
  version: '1.0.0',
});

// =====================
// REGISTER RESOURCES
// =====================

registerAllResources(server, config.CHECKMATE_API_BASE, makeRequestWithRetry);
logger.info('✓ Registered MCP resources (server-info, health, api-docs)');

// =====================
// TOOL LOADING
// =====================

logger.info('🚀 Starting Checkmate MCP Server...');
logger.debug('Configuration:', {
  apiBase: config.CHECKMATE_API_BASE,
  logLevel: config.LOG_LEVEL,
  timeout: config.REQUEST_TIMEOUT,
  retryEnabled: config.ENABLE_RETRY,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolFiles = await fg(path.join(__dirname, 'tools/**/index.@(js|ts)'));

logger.info(`📦 Loading ${toolFiles.length} tool(s)...`);

let loadedTools = 0;
for (const file of toolFiles) {
  try {
    const mod = (await import(path.resolve(file))) as ToolModule;
    if (typeof mod.default === 'function') {
      const toolName = path.basename(path.dirname(file));
      mod.default(server, makeRequestWithRetry);
      loadedTools++;
      logger.debug(`  ✓ Loaded tool: ${toolName}`);
    } else {
      logger.warn(`  ⚠ Skipping ${file}: No default export function`);
    }
  } catch (error) {
    logger.error(`  ✗ Failed to load tool from ${file}:`, error);
  }
}

logger.info(`✓ Successfully loaded ${loadedTools} tool(s)`);

// =====================
// GRACEFUL SHUTDOWN
// =====================

const gracefulShutdown = (signal: string) => {
  logger.info(`\n${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// =====================
// START SERVER
// =====================

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('✅ Checkmate MCP Server running on stdio');
    logger.info('📡 Connected to Checkmate API:', config.CHECKMATE_API_BASE);
    logger.info('🔧 Ready to receive requests\n');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Fatal error in main():', error);
  process.exit(1);
});
