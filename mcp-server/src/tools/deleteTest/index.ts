import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Delete a test
 * 
 * Permanently deletes a test case from the project.
 */
export default function registerDeleteTest(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'delete-test',
    'Delete a test case from a project',
    {
      testId: z.number()
        .int()
        .positive()
        .describe('Test ID to delete'),
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
    },
    async ({ testId, projectId }) => {
      try {
        const body = { testId, projectId };

        const data = await makeRequest('api/v1/test/delete', {
          method: 'DELETE',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `delete test ${testId}`,
          [
            'testId (number, required): Test ID to delete',
            'projectId (number, required): Project ID',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error deleting test: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-tests to find valid test IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}

