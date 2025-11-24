import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Delete a run
 *
 * Permanently deletes a test run from the project.
 */
export default function registerDeleteRun(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'delete-run',
    'Delete a test run from a project',
    {
      runId: z.number().int().positive().describe('Run ID to delete'),
      projectId: z.number().int().positive().describe('Project ID'),
    },
    async ({ runId, projectId }) => {
      try {
        const body = { runId, projectId };

        const data = await makeRequest('api/v1/run/delete', {
          method: 'DELETE',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `delete run ${runId}`, [
          'runId (number, required): Run ID to delete',
          'projectId (number, required): Project ID',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error deleting run: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
