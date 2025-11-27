import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, buildQueryString } from '../utils.js';

/**
 * Get all users
 *
 * Retrieves a list of all users in the system.
 */
export default function registerGetAllUsers(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-all-users',
    'Get a list of all users in the system',
    {
      orgId: z.number().int().positive().optional().describe('Optional: Filter by organization ID'),
      limit: z
        .number()
        .int()
        .positive()
        .optional()
        .describe('Optional: Limit the number of users returned'),
      offset: z.number().int().min(0).optional().describe('Optional: Offset for pagination'),
    },
    async ({ orgId, limit, offset }) => {
      try {
        const queryParams: Record<string, string | number | boolean | null | undefined> = {};
        if (orgId) {
          queryParams.orgId = orgId;
        }
        if (limit) {
          queryParams.limit = limit;
        }
        if (offset !== undefined) {
          queryParams.offset = offset;
        }

        const query = buildQueryString(queryParams);
        const data = await makeRequest(`api/v1/users${query}`, {
          method: 'GET',
        });

        return handleApiResponse(data, 'retrieve users list', [
          'orgId (number, optional): Filter by organization ID',
          'limit (number, optional): Limit number of users returned',
          'offset (number, optional): Offset for pagination',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error getting users: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-orgs-list to find valid organization IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
