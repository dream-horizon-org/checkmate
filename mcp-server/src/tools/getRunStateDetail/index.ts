import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetRunStateDetail(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-run-state-detail',
    'Get meta information / state summary for a run',
    {
      runId: z.number().int().positive().describe('Run ID'),
      projectId: z.number().int().positive().optional().describe('Project ID (optional)'),
      groupBy: z.enum(['squads']).optional().describe('Group by field (optional)'),
    },
    async ({ runId, projectId, groupBy }) => {
      try {
        const qs = new URLSearchParams({ runId: String(runId) });
        if (projectId) qs.set('projectId', String(projectId));
        if (groupBy) qs.set('groupBy', groupBy);

        const data = await makeRequest(`api/v1/run/state-detail?${qs.toString()}`);
        return handleApiResponse(
          data,
          `retrieve state details for run ${runId}`,
          [
            'runId (number, required): Run ID',
            'projectId (number, optional): Project ID',
            'groupBy (enum, optional): Group results by "squads"',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving run state: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs.`,
          }],
          isError: true,
        };
      }
    }
  );
}
