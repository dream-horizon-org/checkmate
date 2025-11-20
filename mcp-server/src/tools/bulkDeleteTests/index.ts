import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Bulk delete tests
 * 
 * Deletes multiple test cases at once from a project.
 */
export default function registerBulkDeleteTests(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'bulk-delete-tests',
    'Delete multiple test cases at once',
    {
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
      testIds: z.array(z.number().int().positive())
        .min(1)
        .describe('Array of test IDs to delete'),
    },
    async ({ projectId, testIds }) => {
      try {
        const body = { projectId, testIds };

        const data = await makeRequest('api/v1/test/bulk-delete', {
          method: 'DELETE',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `bulk delete ${testIds.length} tests`,
          [
            'projectId (number, required): Project ID',
            'testIds (array, required): Array of test IDs to delete',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error bulk deleting tests: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-tests to find valid test IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}

