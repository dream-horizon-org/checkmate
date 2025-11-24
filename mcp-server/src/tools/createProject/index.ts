import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Create a new project
 *
 * Creates a new project in an organization with specified configuration.
 */
export default function registerCreateProject(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'create-project',
    'Create a new project in an organization',
    {
      orgId: z.number().int().positive().describe('Organization ID'),
      projectName: z.string().min(1).describe('Project name'),
      projectDescription: z.string().optional().describe('Project description'),
    },
    async ({ orgId, projectName, projectDescription }) => {
      try {
        const body = {
          orgId,
          projectName,
          projectDescription,
        };

        const data = await makeRequest('api/v1/project/create', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `create project "${projectName}"`, [
          'orgId (number, required): Organization ID',
          'projectName (string, required): Name of the project',
          'projectDescription (string, optional): Description of the project',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error creating project: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-orgs-list to find valid organization IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
