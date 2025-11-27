import type { ZodSchema } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type {
  TextContent,
  ImageContent,
  EmbeddedResource,
} from '@modelcontextprotocol/sdk/types.js';

export type ToolContent = TextContent | ImageContent | EmbeddedResource;

export interface ToolResponse {
  content: ToolContent[];
  isError?: boolean;
  _meta?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ToolDefinition<Args extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  description: string;
  schema: ZodSchema<Args>;
  handler: (args: Args, ctx: unknown) => Promise<ToolResponse>;
  /** Optional additional metadata */
  requiredRole?: 'reader' | 'user' | 'admin';
}

export type RegisterTool = (server: McpServer, tool: ToolDefinition) => void;
