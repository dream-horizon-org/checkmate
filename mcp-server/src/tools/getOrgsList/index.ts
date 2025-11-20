import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetOrgsList(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-orgs-list',
    'Retrieve list of organisations',
    {},
    async () => {
      try {
        const data = await makeRequest('api/v1/orgs');
        return handleApiResponse(
          data,
          'retrieve organizations list',
          ['No parameters required - returns all accessible organizations']
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving organizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
          }],
          isError: true,
        };
      }
    },
  );
} 