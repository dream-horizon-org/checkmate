import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

/**
 * Create a new test
 * 
 * Creates a new test case in a project with specified details.
 */
export default function registerCreateTest(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'create-test',
    'Create a new test case in a project',
    {
      projectId: z.number()
        .int()
        .positive()
        .describe('Project ID'),
      testName: z.string()
        .min(1)
        .describe('Test name/title'),
      testDescription: z.string()
        .optional()
        .describe('Test description'),
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

        const data = await makeRequest('api/v1/test/create', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        return handleApiResponse(
          data,
          `create test "${params.testName}"`,
          [
            'projectId (number, required): ID of the project',
            'testName (string, required): Name/title of the test',
            'testDescription (string, optional): Description of the test',
            'sectionId (number, required): ID of the section',
            'priorityId (number, optional): ID of the priority level',
            'typeId (number, optional): ID of the test type',
            'automationStatusId (number, optional): ID of automation status',
            'platformId (number, optional): ID of the platform',
            'squadId (number, optional): ID of the squad',
            'testCoveredById (number, optional): ID of test coverage type',
            'labels (array of numbers, optional): Array of label IDs',
          ]
        );
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `❌ Error creating test: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Use get-sections, get-priority, get-type tools to find valid IDs.`,
          }],
          isError: true,
        };
      }
    },
  );
}

