import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetTestStatusHistory(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-test-status-history',
    'Retrieve status history for a test (across runs)',
    { testId: z.number().int().positive().describe('Test ID') },
    async ({ testId }) => {
      try {
        const data = await makeRequest(`api/v1/test/test-status-history?testId=${testId}`);
        return handleApiResponse(
          data,
          `retrieve status history for test ${testId}`,
          ['testId (number, required): Test ID']
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving test status history: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-tests to find valid test IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}
