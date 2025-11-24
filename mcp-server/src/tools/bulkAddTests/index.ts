import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

const TestObject = z.object({
  title: z.string().min(1).describe('Test title'),
  section: z.string().min(1).describe('Section name'),
  description: z.string().optional().describe('Test description'),
  squad: z.string().optional().describe('Squad name'),
  priority: z.string().optional().describe('Priority name'),
  platform: z.string().optional().describe('Platform name'),
  type: z.string().optional().describe('Test type name'),
  automationStatus: z.string().optional().describe('Automation status name'),
  steps: z.string().optional().nullable().describe('Test steps'),
  preConditions: z.string().optional().describe('Pre-conditions'),
  expectedResult: z.string().optional().describe('Expected result'),
  testCoveredBy: z.string().optional().describe('Test covered by'),
  additionalGroups: z.string().optional().describe('Additional groups'),
  automationId: z.string().optional().describe('Automation ID'),
  jiraTicket: z.string().optional().describe('JIRA ticket'),
  defects: z.string().optional().describe('Defects'),
  sectionDescription: z.string().optional().describe('Section description'),
});

/**
 * Bulk add tests
 *
 * Creates multiple test cases at once in a project.
 */
export default function registerBulkAddTests(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'bulk-add-tests',
    'Create multiple test cases at once',
    {
      projectId: z.number().int().positive().describe('Project ID'),
      orgId: z.number().int().positive().describe('Organization ID'),
      labelIds: z
        .array(z.number().int().positive())
        .optional()
        .describe('Array of label IDs to assign to all tests'),
      tests: z.array(TestObject).min(1).describe('Array of test objects to create'),
    },
    async ({ projectId, orgId, labelIds, tests }) => {
      try {
        const body = { projectId, orgId, labelIds, tests };

        const data = await makeRequest('api/v1/test/bulk-add', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(data, `bulk add ${tests.length} tests`, [
          'projectId (number): ID of the project',
          'orgId (number): ID of the organization',
          'tests (array): Array of test objects with the following fields:',
          '  - title (string, required): Test title',
          '  - section (string, required): Section name',
          '  - priority (string, optional): Priority name',
          '  - type (string, optional): Test type name',
          '  - squad (string, optional): Squad name',
          '  - steps (string, optional): Test steps',
          '  - expectedResult (string, optional): Expected result',
          '  - description (string, optional): Test description',
        ]);
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error bulk adding tests: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Make sure the server is running and accessible.`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
