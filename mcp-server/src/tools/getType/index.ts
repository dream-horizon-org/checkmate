import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetType(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-type',
    'Retrieve list of types for an organisation',
    { orgId: z.number().int().positive().describe('Organisation ID') },
    async ({ orgId }) => {
      try {
        const data = await makeRequest(`api/v1/type?orgId=${orgId}`);
        return handleApiResponse(data, `retrieve test types for organization ${orgId}`, [
          'orgId (number, required): Organization ID',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error retrieving types: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-orgs-list to find valid organization IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
