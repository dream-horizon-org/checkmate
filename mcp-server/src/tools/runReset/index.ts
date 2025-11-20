import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerRunReset(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-reset',
    'Reset a run by marking all Passed tests as Retest (RunReset endpoint)',
    {
      runId: z.number().int().positive().describe('Run ID'),
    },
    async ({ runId }) => {
      try {
        const body = { runId };
        const data = await makeRequest('api/v1/run/reset', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `reset run ${runId}`,
          ['runId (number, required): Run ID to reset']
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error resetting run: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs. This will mark all Passed tests as Retest.`,
          }],
          isError: true,
        };
      }
    },
  );
}
