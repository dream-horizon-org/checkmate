import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, isEmptyData, formatNotFoundError } from '../utils.js';

export default function registerGetRunDetail(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-run-detail',
    'Fetch detailed information of a run (basic run info)',
    {
      runId: z.number().int().positive().describe('Run ID'),
    },
    async ({ runId }) => {
      try {
        const qs = new URLSearchParams({ runId: String(runId) });
        const data = await makeRequest(`api/v1/run/detail?${qs.toString()}`);

        // Check for empty data
        if (isEmptyData(data)) {
          return formatNotFoundError('Run', runId, 'get-runs');
        }

        return handleApiResponse(data, `retrieve run ${runId} details`, [
          'runId (number, required): Run ID',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error retrieving run details: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
