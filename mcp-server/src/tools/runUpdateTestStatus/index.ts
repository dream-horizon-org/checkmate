import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

const TestStatusObject = z.object({
  testId: z.number().int().positive().optional().describe('Test ID'),
  status: z.string().optional().describe('New status'),
  comment: z.string().optional().describe('Comment for this test'),
});

export default function registerRunUpdateTestStatus(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'run-update-test-status',
    'Update status for one or more tests inside a run',
    {
      runId: z.number().int().positive().describe('Run ID'),
      testIdStatusArray: z
        .array(TestStatusObject)
        .nonempty()
        .describe('Array of objects mapping testId to new status'),
      projectId: z.number().int().positive().optional().describe('Project ID (optional)'),
      comment: z.string().optional().describe('Overall comment (optional)'),
    },
    async ({ runId, testIdStatusArray, projectId, comment }) => {
      try {
        const body: Record<string, unknown> = { runId, testIdStatusArray };
        if (projectId) {
          body.projectId = projectId;
        }
        if (comment) {
          body.comment = comment;
        }

        const data = await makeRequest('api/v1/run/update-test-status', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `update status for ${testIdStatusArray.length} test(s) in run ${runId}`,
          [
            'runId (number, required): Run ID',
            'testIdStatusArray (array, required): Array of {testId, status, comment}',
            'projectId (number, optional): Project ID',
            'comment (string, optional): Overall comment',
          ],
        );
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error updating test statuses: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-run-tests-list to find tests in this run.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
