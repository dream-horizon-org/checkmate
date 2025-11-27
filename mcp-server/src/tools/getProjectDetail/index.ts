import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetProjectDetail(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-project-detail',
    'Fetch detailed information of a project',
    { projectId: z.number().int().positive().describe('Project ID') },
    async ({ projectId }) => {
      try {
        const data = await makeRequest(`api/v1/project/detail?projectId=${projectId}`);

        // Check if project was found
        if (data && typeof data === 'object' && 'data' in data) {
          const projectData = (data as Record<string, unknown>).data;
          if (!projectData || (Array.isArray(projectData) && projectData.length === 0)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `❌ Project not found\n\nProject ID ${projectId} does not exist or you don't have access to it.\n\n💡 Solution:\n- Use get-projects to list available projects\n- Verify the project ID is correct\n- Ensure you have access to this project`,
                },
              ],
              isError: true,
            };
          }
        }

        return handleApiResponse(data, `retrieve project ${projectId} details`, [
          'projectId (number, required): ID of the project to retrieve',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error retrieving project details: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-projects to find valid project IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
