import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetSquads(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-squads',
    'Retrieve list of squads for a project',
    {
      projectId: z.number().int().positive().describe('Project ID'),
    },
    async ({ projectId }) => {
      try {
        const qs = new URLSearchParams({ projectId: String(projectId) });
        const data = await makeRequest(`api/v1/project/squads?${qs.toString()}`);
        return handleApiResponse(
          data,
          `retrieve squads for project ${projectId}`,
          ['projectId (number, required): Project ID']
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving squads: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
} 