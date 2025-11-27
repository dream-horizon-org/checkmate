import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse } from '../utils.js';

export default function registerGetUserDetails(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool('get-user-details', 'Retrieve details of the authenticated user', {}, async () => {
    try {
      const data = await makeRequest('api/v1/user/details');

      return handleApiResponse(data, 'retrieve authenticated user details', [
        'No parameters required - uses authentication token',
      ]);
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Error retrieving user details: ${error instanceof Error ? error.message : 'Unknown error'}\n\n💡 Tip: Check that your authentication token is valid.`,
          },
        ],
        isError: true,
      };
    }
  });
}
