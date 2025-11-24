import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Add squads
 *
 * Creates new squads in a project.
 */
export default function registerAddSquads(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'add-squads',
    'Add new squads to a project',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      squads: z.array(z.string().min(1)).min(1).describe('Array of squad names to create'),
    },
    async ({ projectId, squads }) => {
      try {
        const body = { projectId, squads };

        const data = await makeRequest('api/v1/squads/add', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `add ${squads.length} squads to project ${projectId}`, [
          'projectId (number, required): Project ID',
          'squads (array, required): Array of squad names (strings)',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error adding squads: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
