import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

const TestUpdateObject = z.object({
  testId: z.number().int().positive().describe('Test ID'),
  testName: z.string().min(1).optional(),
  testDescription: z.string().optional(),
  sectionId: z.number().int().positive().optional(),
  priorityId: z.number().int().positive().optional(),
  typeId: z.number().int().positive().optional(),
  automationStatusId: z.number().int().positive().optional(),
  platformId: z.number().int().positive().optional(),
  testCoveredById: z.number().int().positive().optional(),
  squadId: z.number().int().positive().optional(),
  labels: z.array(z.number().int().positive()).optional(),
});

/**
 * Bulk update tests
 *
 * Updates multiple test cases at once.
 */
export default function registerBulkUpdateTests(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'bulk-update-tests',
    'Update multiple test cases at once',
    {
      tests: z
        .array(TestUpdateObject)
        .min(1)
        .describe('Array of test objects to update (each must include testId)'),
    },
    async ({ tests }) => {
      try {
        const body = { tests };

        const data = await makeRequest('api/v1/test/bulk-update', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `bulk update ${tests.length} tests`, [
          'tests (array, required): Array of test objects to update',
          '  Each test object must include:',
          '  - testId (number, required): Test ID',
          '  - testName (string, optional): New name',
          '  - testDescription (string, optional): New description',
          '  - sectionId, priorityId, typeId, etc. (optional): Metadata IDs',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error bulk updating tests: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Ensure all testIds exist using get-tests.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
