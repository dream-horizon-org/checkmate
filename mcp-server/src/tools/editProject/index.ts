import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Edit an existing project
 * 
 * Updates project details like name and description.
 */
export default function registerEditProject(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'edit-project',
    'Edit an existing project',
    {
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
      projectName: z.string()
        .min(1)
        .optional()
        .describe('New project name'),
      projectDescription: z.string()
        .optional()
        .describe('New project description'),
    },
    async ({ projectId, projectName, projectDescription }) => {
      try {
        const body: any = { projectId };
        if (projectName) body.projectName = projectName;
        if (projectDescription !== undefined) body.projectDescription = projectDescription;

        const data = await makeRequest('api/v1/project/edit', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `edit project ${projectId}`,
          [
            'projectId (number, required): Project ID to edit',
            'projectName (string, optional): New project name',
            'projectDescription (string, optional): New description',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error editing project: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}

