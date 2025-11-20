import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, isEmptyData, formatNotFoundError } from '../utils.js';

export default function registerGetTestDetails(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-test-details',
    'Get details of a test',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      testId: z.number().int().positive().describe('Test ID'),
    },
    async ({ projectId, testId }) => {
      try {
        const qs = new URLSearchParams({ projectId: String(projectId), testId: String(testId) });
        const data = await makeRequest(`api/v1/test/details?${qs.toString()}`);
        
        // Check for empty data
        if (isEmptyData(data)) {
          return formatNotFoundError('Test', testId, 'get-tests');
        }
        
        return handleApiResponse(
          data,
          `retrieve test ${testId} details`,
          [
            'projectId (number, required): Project ID',
            'testId (number, required): Test ID',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving test details: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-tests to find valid test IDs.`,
          }],
          isError: true,
        };
      }
    }
  );
} 