/**
 * MCP Resources
 * Resources provide static or dynamic data that can be accessed by AI assistants
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface ServerInfo {
  name: string;
  version: string;
  apiBase: string;
  uptime: number;
  timestamp: string;
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  apiReachable: boolean;
  timestamp: string;
  uptime: number;
  error?: string;
}

const startTime = Date.now();

/**
 * Register server info resource
 */
export function registerServerInfoResource(
  server: McpServer,
  apiBase: string,
) {
  server.resource(
    'server-info',
    'checkmate://server-info',
    () => {
      const info: ServerInfo = {
        name: 'checkmate-mcp',
        version: '1.0.0',
        apiBase,
        uptime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };

      return {
        contents: [{
          uri: 'checkmate://server-info',
          mimeType: 'application/json',
          text: JSON.stringify(info, null, 2),
        }],
      };
    },
  );
}

/**
 * Register health check resource
 */
export function registerHealthCheckResource(
  server: McpServer,
  apiBase: string,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.resource(
    'health',
    'checkmate://health',
    async () => {
      const health: HealthStatus = {
        status: 'healthy',
        apiReachable: false,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - startTime,
      };

      try {
        // Try to reach the Checkmate API
        const response = await makeRequest('api/v1/orgs');

        health.apiReachable = response !== null;
        health.status = health.apiReachable ? 'healthy' : 'unhealthy';
      } catch (error) {
        health.status = 'unhealthy';
        health.apiReachable = false;
        health.error = error instanceof Error ? error.message : 'Unknown error';
      }

      return {
        contents: [{
          uri: 'checkmate://health',
          mimeType: 'application/json',
          text: JSON.stringify(health, null, 2),
        }],
      };
    },
  );
}

/**
 * Register API documentation resource
 */
export function registerApiDocsResource(server: McpServer) {
  server.resource(
    'api-docs',
    'checkmate://api-docs',
    () => {
      const docs = `# Checkmate API Documentation

## Official Documentation

- [Postman Collection](https://documenter.getpostman.com/view/23217307/2sAYXFgwRt)
- [Checkmate Documentation](https://checkmate.dreamsportslabs.com/)
- [GitHub Repository](https://github.com/ds-horizon/checkmate)

## Available Endpoints

The Checkmate MCP server provides access to the following API endpoints:

### Organizations & Projects
- \`GET /api/v1/orgs\` - List organizations
- \`GET /api/v1/org/{orgId}\` - Get organization details
- \`GET /api/v1/projects\` - List projects
- \`GET /api/v1/project/{projectId}\` - Get project details

### Tests
- \`GET /api/v1/project/tests\` - List tests in a project
- \`GET /api/v1/test/{testId}\` - Get test details
- \`GET /api/v1/test/status-history\` - Get test status history

### Test Runs
- \`GET /api/v1/runs\` - List test runs
- \`GET /api/v1/run/{runId}\` - Get run details
- \`POST /api/v1/run/update-test-status\` - Update test statuses in a run
- \`PUT /api/v1/run/lock\` - Lock a run
- \`PUT /api/v1/run/reset\` - Reset a run

For more information, visit the official documentation links above.
`;

      return {
        contents: [{
          uri: 'checkmate://api-docs',
          mimeType: 'text/markdown',
          text: docs,
        }],
      };
    },
  );
}

/**
 * Register all resources
 */
export function registerAllResources(
  server: McpServer,
  apiBase: string,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  registerServerInfoResource(server, apiBase);
  registerHealthCheckResource(server, apiBase, makeRequest);
  registerApiDocsResource(server);
}

