import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Add section
 * 
 * Creates a new section (test suite) in a project.
 */
export default function registerAddSection(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'add-section',
    'Add a new section (test suite) to a project',
    {
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
      sectionName: z.string()
        .min(1)
        .describe('Section name'),
      parentSectionId: z.number()
        .int()
        .positive()
        .optional()
        .describe('Parent section ID (for nested sections)'),
    },
    async ({ projectId, sectionName, parentSectionId }) => {
      try {
        const body: Record<string, unknown> = { projectId, sectionName };
        if (parentSectionId) {
          body.parentSectionId = parentSectionId;
        }

        const data = await makeRequest('api/v1/section/add', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `add section "${sectionName}" to project ${projectId}`,
          [
            'projectId (number, required): Project ID',
            'sectionName (string, required): Name of the section',
            'parentSectionId (number, optional): Parent section ID for nesting',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error adding section: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-sections to view existing sections.`,
          }],
          isError: true,
        };
      }
    },
  );
}

