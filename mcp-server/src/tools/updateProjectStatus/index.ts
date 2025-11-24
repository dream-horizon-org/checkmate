import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Update project status
 *
 * Changes the active status of a project.
 */
export default function registerUpdateProjectStatus(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'update-project-status',
    'Update the status of a project (active/inactive)',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      isActive: z.boolean().describe('Whether the project should be active'),
    },
    async ({ projectId, isActive }) => {
      try {
        const body = { projectId, isActive };

        const data = await makeRequest('api/v1/project/update-status', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `update project ${projectId} status to ${isActive ? 'active' : 'inactive'}`,
          [
            'projectId (number, required): Project ID',
            'isActive (boolean, required): true for active, false for inactive',
          ],
        );
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error updating project status: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
