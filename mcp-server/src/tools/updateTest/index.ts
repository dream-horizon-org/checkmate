import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Update an existing test
 * 
 * Updates test case details and metadata.
 */
export default function registerUpdateTest(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'update-test',
    'Update an existing test case',
    {
      testId: z.number()
        .int()
        .positive()
        .describe('Test ID'),
      testName: z.string()
        .min(1)
        .optional()
        .describe('New test name'),
      testDescription: z.string()
        .optional()
        .describe('New test description'),
      sectionId: z.number()
        .int()
        .positive()
        .optional()
        .describe('Section ID'),
      priorityId: z.number()
        .int()
        .positive()
        .optional()
        .describe('Priority ID'),
      typeId: z.number()
        .int()
        .positive()
        .optional()
        .describe('Test type ID'),
      automationStatusId: z.number()
        .int()
        .positive()
        .optional()
        .describe('Automation status ID'),
      platformId: z.number()
        .int()
        .positive()
        .optional()
        .describe('Platform ID'),
      testCoveredById: z.number()
        .int()
        .positive()
        .optional()
        .describe('Test covered by ID'),
      squadId: z.number()
        .int()
        .positive()
        .optional()
        .describe('Squad ID'),
      labels: z.array(z.number().int().positive())
        .optional()
        .describe('Array of label IDs'),
    },
    async (params) => {
      try {
        const body: any = { ...params };

        const data = await makeRequest('api/v1/test/update', {
          method: 'PUT',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `update test ${params.testId}`,
          [
            'testId (number, required): Test ID to update',
            'testName (string, optional): New test name',
            'testDescription (string, optional): New description',
            'sectionId (number, optional): Section ID',
            'priorityId (number, optional): Priority ID',
            'typeId (number, optional): Test type ID',
            'automationStatusId (number, optional): Automation status ID',
            'platformId (number, optional): Platform ID',
            'squadId (number, optional): Squad ID',
            'testCoveredById (number, optional): Test covered by ID',
            'labels (array, optional): Array of label IDs',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error updating test: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-test-details to verify the test exists and get-sections, get-priority to find valid IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}

