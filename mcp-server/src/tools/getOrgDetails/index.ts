import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, isEmptyData, formatNotFoundError } from '../utils.js';

export default function registerGetOrgDetails(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-org-details',
    'Fetch organisation details by orgId',
    { orgId: z.number().int().positive().describe('Organisation ID') },
    async ({ orgId }) => {
      try {
        const data = await makeRequest(`api/v1/org/detail?orgId=${orgId}`);

        // Check for empty data
        if (isEmptyData(data)) {
          return formatNotFoundError('Organization', orgId, 'get-orgs-list');
        }

        return handleApiResponse(data, `retrieve organization ${orgId} details`, [
          'orgId (number, required): Organization ID',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error retrieving organization details: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-orgs-list to find valid organization IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
