import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, buildQueryString } from '../utils.js';

/**
 * Download tests
 *
 * Gets all tests from a project in a structured format for export/download.
 */
export default function registerDownloadTests(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'download-tests',
    'Download all tests from a project in a structured format',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      format: z
        .enum(['json', 'csv'])
        .optional()
        .default('json')
        .describe('Export format (json or csv)'),
    },
    async ({ projectId, format }) => {
      try {
        const query = buildQueryString({ projectId, format });
        const data = await makeRequest(`api/v1/test/download${query}`, {
          method: 'GET',
        });

        return handleApiResponse(
          data,
          `download tests from project ${projectId} in ${format} format`,
          [
            'projectId (number, required): Project ID',
            'format (enum, optional): Export format - "json" or "csv" (default: json)',
          ],
        );
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error downloading tests: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
