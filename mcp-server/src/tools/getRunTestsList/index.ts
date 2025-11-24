import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetRunTestsList(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-run-tests-list',
    'Get list of tests inside a run',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      runId: z.number().int().positive().describe('Run ID'),
      page: z.number().int().positive().optional(),
      pageSize: z.number().int().positive().optional(),
      textSearch: z.string().optional(),
    },
    async ({ projectId, runId, page, pageSize, textSearch }) => {
      try {
        const qs = new URLSearchParams({ projectId: String(projectId), runId: String(runId) });
        if (page) {
          qs.set('page', String(page));
        }
        if (pageSize) {
          qs.set('pageSize', String(pageSize));
        }
        if (textSearch) {
          qs.set('textSearch', textSearch);
        }

        const data = await makeRequest(`api/v1/run/tests?${qs.toString()}`);
        return handleApiResponse(
          data,
          `retrieve tests for run ${runId}`,
          [
            'projectId (number, required): Project ID',
            'runId (number, required): Run ID',
            'page (number, optional): Page number',
            'pageSize (number, optional): Items per page',
            'textSearch (string, optional): Search filter',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving run tests: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs.`,
          }],
          isError: true,
        };
      }
    }
  );
}
