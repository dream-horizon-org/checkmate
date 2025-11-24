import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetTests(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-tests',
    'Get tests of a project (not tied to a run)',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      page: z.number().int().positive().optional(),
      pageSize: z.number().int().positive().optional(),
      textSearch: z.string().optional(),
    },
    async ({ projectId, page, pageSize, textSearch }) => {
      try {
        const qs = new URLSearchParams({ projectId: String(projectId) });
        if (page) {
          qs.set('page', String(page));
        }
        if (pageSize) {
          qs.set('pageSize', String(pageSize));
        }
        if (textSearch) {
          qs.set('textSearch', textSearch);
        }

        const data = await makeRequest(`api/v1/project/tests?${qs.toString()}`);
        return handleApiResponse(
          data,
          `retrieve tests for project ${projectId}`,
          [
            'projectId (number, required): Project ID',
            'page (number, optional): Page number',
            'pageSize (number, optional): Items per page',
            'textSearch (string, optional): Search filter',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving tests: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
          }],
          isError: true,
        };
      }
    }
  );
}
