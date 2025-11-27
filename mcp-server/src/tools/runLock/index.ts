import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerRunLock(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-lock',
    'Lock a run (sets its status from Active to Locked)',
    {
      runId: z.number().int().positive().describe('Run ID'),
      projectId: z.number().int().positive().describe('Project ID'),
    },
    async ({ runId, projectId }) => {
      try {
        const body = { runId, projectId };
        const data = await makeRequest('api/v1/run/lock', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `lock run ${runId}`, [
          'runId (number, required): Run ID to lock',
          'projectId (number, required): Project ID',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error locking run: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs. Note: Only Active runs can be locked.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
