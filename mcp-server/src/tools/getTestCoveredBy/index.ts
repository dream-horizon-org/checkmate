import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetTestCoveredBy(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-test-covered-by',
    'Retrieve the mapping of tests covered by other tests for an organisation',
    { orgId: z.number().int().positive().describe('Organisation ID') },
    async ({ orgId }) => {
      try {
        const data = await makeRequest(`api/v1/testCoveredBy?orgId=${orgId}`);
        return handleApiResponse(
          data,
          `retrieve test coverage mapping for organization ${orgId}`,
          ['orgId (number, required): Organization ID']
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving test coverage data: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-orgs-list to find valid organization IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}
