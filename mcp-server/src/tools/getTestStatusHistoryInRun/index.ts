import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetTestStatusHistoryInRun(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-test-status-history-in-run',
    'Retrieve status history for a test within a specific run',
    {
      runId: z.number().int().positive().describe('Run ID'),
      testId: z.number().int().positive().describe('Test ID'),
    },
    async ({ runId, testId }) => {
      try {
        const qs = new URLSearchParams({ runId: String(runId), testId: String(testId) });
        const data = await makeRequest(`api/v1/run/test-status-history?${qs.toString()}`);
        return handleApiResponse(
          data,
          `retrieve status history for test ${testId} in run ${runId}`,
          ['runId (number, required): Run ID', 'testId (number, required): Test ID'],
        );
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error retrieving test status history: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-run-tests-list to find tests in this run.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
