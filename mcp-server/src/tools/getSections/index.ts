import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetSections(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-sections',
    'Retrieve list of sections for a project (optionally scoped to a run)',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      runId: z.number().int().positive().optional().describe('Run ID (optional)'),
    },
    async ({ projectId, runId }) => {
      try {
        const qs = new URLSearchParams({ projectId: String(projectId) });
        if (runId) {
          qs.set('runId', String(runId));
        }

        const data = await makeRequest(`api/v1/project/sections?${qs.toString()}`);
        return handleApiResponse(data, `retrieve sections for project ${projectId}`, [
          'projectId (number, required): Project ID',
          'runId (number, optional): Filter by run ID',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error retrieving sections: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
