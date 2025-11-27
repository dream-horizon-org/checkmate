import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Edit section
 *
 * Updates a section name in a project.
 */
export default function registerEditSection(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'edit-section',
    'Edit an existing section name',
    {
      sectionId: z.number().int().positive().describe('Section ID'),
      sectionName: z.string().min(1).describe('New section name'),
    },
    async ({ sectionId, sectionName }) => {
      try {
        const body = { sectionId, sectionName };

        const data = await makeRequest('api/v1/section/edit', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `edit section ${sectionId} name to "${sectionName}"`, [
          'sectionId (number, required): Section ID to edit',
          'sectionName (string, required): New section name',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error editing section: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-sections to find valid section IDs.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
