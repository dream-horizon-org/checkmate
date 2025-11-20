import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Create a new run
 * 
 * Creates a new test run in a project with specified tests.
 */
export default function registerCreateRun(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'create-run',
    'Create a new test run in a project',
    {
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
      runName: z.string()
        .min(1)
        .describe('Run name'),
      runDescription: z.string()
        .optional()
        .describe('Run description'),
      testIds: z.array(z.number().int().positive())
        .min(1)
        .describe('Array of test IDs to include in the run'),
    },
    async ({ projectId, runName, runDescription, testIds }) => {
      try {
        const body = {
          projectId,
          runName,
          runDescription,
          testIds,
        };

        const data = await makeRequest('api/v1/run/create', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `create run "${runName}"`,
          [
            'projectId (number, required): Project ID',
            'runName (string, required): Name of the run',
            'runDescription (string, optional): Description of the run',
            'testIds (array, required): Array of test IDs to include in run',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error creating run: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-tests to find valid test IDs to include in the run.`,
          }],
          isError: true,
        };
      }
    },
  );
}

