import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { handleApiResponse } from '../utils.js';

export default function registerGetLabels(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-labels',
    'Retrieve list of labels for a project',
    { projectId: z.number().int().positive().describe('Project ID') },
    async ({ projectId }) => {
      try {
        const data = await makeRequest(`api/v1/labels?projectId=${projectId}`);
        return handleApiResponse(data, `retrieve labels for project ${projectId}`, [
          'projectId (number, required): Project ID',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error retrieving labels: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
