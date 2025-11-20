import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Add labels
 * 
 * Creates new labels in a project.
 */
export default function registerAddLabels(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'add-labels',
    'Add new labels to a project',
    {
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
      labels: z.array(z.string().min(1))
        .min(1)
        .describe('Array of label names to create'),
    },
    async ({ projectId, labels }) => {
      try {
        const body = { projectId, labels };

        const data = await makeRequest('api/v1/labels/add', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `add ${labels.length} labels to project ${projectId}`,
          [
            'projectId (number, required): Project ID',
            'labels (array, required): Array of label names (strings)',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error adding labels: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}

