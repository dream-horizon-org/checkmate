import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, buildQueryString } from '../utils.js';

/**
 * Download report
 *
 * Gets a comprehensive report of a test run with all results and metrics.
 */
export default function registerDownloadReport(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'download-report',
    'Download a comprehensive test run report',
    {
      runId: z.number().int().positive().describe('Run ID'),
      projectId: z.number().int().positive().describe('Project ID'),
      format: z
        .enum(['json', 'pdf', 'html'])
        .optional()
        .default('json')
        .describe('Report format (json, pdf, or html)'),
    },
    async ({ runId, projectId, format }) => {
      try {
        const query = buildQueryString({ runId, projectId, format });
        const data = await makeRequest(`api/v1/run/report${query}`, {
          method: 'GET',
        });

        return handleApiResponse(data, `download report for run ${runId} in ${format} format`, [
          'runId (number, required): Run ID',
          'projectId (number, required): Project ID',
          'format (enum, optional): Report format - "json", "pdf", or "html" (default: json)',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error downloading report: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
