import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerRunRemoveTests(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-remove-tests',
    'Remove one or more tests from a run',
    {
      runId: z.number().int().positive().describe('Run ID'),
      projectId: z.number().int().positive().describe('Project ID'),
      testIds: z
        .array(z.number().int().positive())
        .nonempty()
        .describe('Array of Test IDs to remove'),
    },
    async ({ runId, projectId, testIds }) => {
      try {
        const body = { runId, projectId, testIds };
        const data = await makeRequest('api/v1/run/remove-tests', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `remove ${testIds.length} test(s) from run ${runId}`, [
          'runId (number, required): Run ID',
          'projectId (number, required): Project ID',
          'testIds (array, required): Array of test IDs to remove',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error removing tests from run: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-run-tests-list to find tests in this run.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
