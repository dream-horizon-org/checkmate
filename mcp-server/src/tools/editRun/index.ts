import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Edit an existing run
 * 
 * Updates run details like name and description.
 */
export default function registerEditRun(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'edit-run',
    'Edit an existing test run',
    {
      runId: z.number()
        .int()
        .positive()
        .describe('Run ID'),
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
      runName: z.string()
        .min(1)
        .optional()
        .describe('New run name'),
      runDescription: z.string()
        .optional()
        .describe('New run description'),
    },
    async ({ runId, projectId, runName, runDescription }) => {
      try {
        const body: any = { runId, projectId };
        if (runName) body.runName = runName;
        if (runDescription !== undefined) body.runDescription = runDescription;

        const data = await makeRequest('api/v1/run/edit', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `edit run ${runId}`,
          [
            'runId (number, required): Run ID to edit',
            'projectId (number, required): Project ID',
            'runName (string, optional): New run name',
            'runDescription (string, optional): New description',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error editing run: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-runs to find valid run IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}

