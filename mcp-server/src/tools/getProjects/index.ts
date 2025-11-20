import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, buildQueryString } from '../utils.js';

/**
 * Get projects for an organization
 * 
 * This tool retrieves a paginated list of projects within a specified organization.
 * Supports filtering by text search and project description.
 */
export default function registerGetProjects(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'get-projects',
    'Retrieve paginated list of projects for an organisation',
    {
      orgId: z.number()
        .int()
        .positive()
        .describe('Organisation ID'),
      page: z.number()
        .int()
        .positive()
        .default(1)
        .optional()
        .describe('Page number (default 1)'),
      pageSize: z.number()
        .int()
        .positive()
        .max(100)
        .default(100)
        .optional()
        .describe('Page size (default 100, max 100)'),
      textSearch: z.string()
        .optional()
        .describe('Text search filter for project name'),
      projectDescription: z.string()
        .optional()
        .describe('Filter by project description'),
    },
    async ({ orgId, page, pageSize, textSearch, projectDescription }) => {
      try {
        const queryParams = buildQueryString({
          orgId,
          page,
          pageSize,
          textSearch,
          projectDescription,
        });

        const data = await makeRequest(`api/v1/projects${queryParams}`);
        return handleApiResponse(
          data,
          `retrieve projects for organization ${orgId}`,
          [
            'orgId (number, required): Organization ID',
            'page (number, optional): Page number (default: 1)',
            'pageSize (number, optional): Page size (default: 100, max: 100)',
            'textSearch (string, optional): Filter by project name',
            'projectDescription (string, optional): Filter by description',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error retrieving projects: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-orgs-list to find valid organization IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}
