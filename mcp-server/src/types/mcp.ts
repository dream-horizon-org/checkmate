/**
 * MCP Tool Types
 */
import type {
  TextContent,
  ImageContent,
  EmbeddedResource,
} from '@modelcontextprotocol/sdk/types.js';

// Re-export SDK types
export type ToolContent = TextContent | ImageContent | EmbeddedResource;

export interface ToolResponse {
  content: ToolContent[];
  isError?: boolean;
  [key: string]: unknown;
}

export interface ToolError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

// Logger types
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface Logger {
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  info(...args: unknown[]): void;
  debug(...args: unknown[]): void;
}

// Request options
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Query parameters
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

// Rate limiter types
export interface RateLimitConfig {
  tokensPerInterval: number;
  interval: number;
  maxTokens?: number;
}

// Module loader types
export interface ToolModule {
  default: (
    server: import('@modelcontextprotocol/sdk/server/mcp.js').McpServer,
    makeRequest: <T>(path: string, options?: RequestOptions) => Promise<T>,
  ) => void;
}

// HTTP Response type
export interface HttpResponse<T = unknown> {
  ok: boolean;
  status: number;
  statusText: string;
  data?: T;
  error?: string;
}
