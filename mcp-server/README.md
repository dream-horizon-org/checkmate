# Checkmate MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with programmatic access to the Checkmate Test Case Management API.

## 🎯 Overview

This MCP server allows AI assistants (like Claude, ChatGPT, etc.) to interact with your Checkmate instance to:
- Manage test cases, projects, and test runs
- Update test statuses and track progress
- Retrieve test details, history, and analytics
- Control run states (lock, reset, etc.)
- Access organizational and project information

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [With Claude Desktop](#with-claude-desktop)
  - [With Other MCP Clients](#with-other-mcp-clients)
- [Available Tools](#available-tools)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🔧 Prerequisites

- Node.js v18.x or higher
- A running Checkmate instance
- API authentication token from Checkmate

## 📦 Installation

### Option 1: Install from npm (Recommended)

```bash
npm install -g @d11/mcp-server
```

### Option 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/ds-horizon/checkmate.git
cd checkmate/mcp-server

# Install dependencies
npm install

# Build the server
npm run build

# Optional: Link globally
npm link
```

### Option 3: Docker (Production)

See [DOCKER.md](./DOCKER.md) for complete Docker deployment guide.

```bash
# Quick start with Docker Compose
cd checkmate
docker-compose up -d checkmate-mcp

# Check status
docker-compose ps checkmate-mcp
```

## ⚙️ Configuration

### 1. Set Environment Variables

Create a `.env` file in the mcp-server directory:

```bash
# Required: Base URL of your Checkmate API
CHECKMATE_API_BASE=http://localhost:3000

# Required: Authentication token for Checkmate API
# Obtain this from your Checkmate instance (User Settings > API Tokens)
CHECKMATE_API_TOKEN=your-api-token-here
```

### 2. Obtain API Token

To get your API token from Checkmate:

1. Log into your Checkmate instance
2. Navigate to **User Settings** → **API Tokens**
3. Click **Generate New Token**
4. Copy the token and add it to your `.env` file

**Security Note:** Keep your API token secure. Never commit it to version control.

## 🚀 Usage

### With Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "checkmate": {
      "command": "node",
      "args": ["/path/to/checkmate/mcp-server/build/index.js"],
      "env": {
        "CHECKMATE_API_BASE": "http://localhost:3000",
        "CHECKMATE_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

Or if installed globally via npm:

```json
{
  "mcpServers": {
    "checkmate": {
      "command": "checkmate-mcp",
      "env": {
        "CHECKMATE_API_BASE": "http://localhost:3000",
        "CHECKMATE_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### With Other MCP Clients

The server uses stdio transport and can be integrated with any MCP-compatible client. Pass the environment variables and execute the built index.js file.

## 🛠️ Available Tools

The MCP server provides the following tools. For detailed input requirements, validation rules, and troubleshooting, see [TOOL_INPUT_GUIDE.md](./TOOL_INPUT_GUIDE.md).

### Organization & Projects

#### Read Operations
- `get-orgs-list` - List all organizations
- `get-org-details` - Get details of a specific organization
- `get-projects` - List projects in an organization
- `get-project-detail` - Get details of a specific project

#### Write Operations
- `create-project` - Create a new project in an organization
- `edit-project` - Edit an existing project (name, description)
- `update-project-status` - Update project status (active/inactive)

### Tests

#### Read Operations
- `get-tests` - List tests in a project
- `get-test-details` - Get details of a specific test
- `get-tests-count` - Get test count with filters
- `get-test-status-history` - Get status history of a test
- `get-test-status-history-in-run` - Get test status history within a run
- `download-tests` - Download all tests in structured format (JSON/CSV)

#### Write Operations
- `create-test` - Create a new test case
- `update-test` - Update an existing test case
- `delete-test` - Delete a test case

#### Bulk Operations
- `bulk-add-tests` - Create multiple test cases at once
- `bulk-update-tests` - Update multiple test cases at once
- `bulk-delete-tests` - Delete multiple test cases at once

### Test Runs

#### Read Operations
- `get-runs` - List test runs in a project
- `run-detail` - Get details of a specific run
- `get-run-tests-list` - List tests in a run
- `get-run-test-status` - Get status of tests in a run
- `get-run-state-detail` - Get detailed state of a run
- `download-report` - Download comprehensive test run report (JSON/PDF/HTML)

#### Write Operations
- `create-run` - Create a new test run
- `edit-run` - Edit an existing run (name, description)
- `delete-run` - Delete a test run
- `run-update-test-status` - Update test status in a run (bulk)
- `run-lock` - Lock a run to prevent modifications
- `run-reset` - Reset a run to retest status
- `run-remove-tests` - Remove tests from a run

### Metadata & Configuration

#### Read Operations
- `get-labels` - List available labels
- `get-sections` - List available sections
- `get-squads` - List available squads
- `get-priority` - List priority levels
- `get-platforms` - List platforms
- `get-automation-status` - List automation statuses
- `get-type` - List test types
- `get-test-covered-by` - List coverage types

#### Write Operations
- `add-labels` - Add new labels to a project
- `add-squads` - Add new squads to a project
- `add-section` - Add a new section (test suite) to a project
- `edit-section` - Edit an existing section name

### Users
- `get-user-details` - Get user information
- `get-all-users` - List all users (with optional filters)

## 💻 Development

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts           # Main server entry point
│   └── tools/             # Tool definitions
│       ├── types.ts       # Shared types
│       ├── getProjects/
│       │   └── index.ts
│       ├── getTests/
│       │   └── index.ts
│       └── ... (other tools)
├── build/                 # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

### Running in Development Mode

```bash
# Install dependencies
npm install

# Build and watch for changes
npm run build -- --watch

# In another terminal, test the server
node build/index.js
```

### Adding a New Tool

1. Create a new directory in `src/tools/` (e.g., `src/tools/myNewTool/`)
2. Create an `index.ts` file with this structure:

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default function registerMyNewTool(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'my-new-tool',
    'Description of what this tool does',
    {
      // Define Zod schema for parameters
      param1: z.string().describe('Parameter description'),
      param2: z.number().optional().describe('Optional parameter'),
    },
    async ({ param1, param2 }) => {
      // Make API request
      const data = await makeRequest(`api/v1/your-endpoint?param1=${param1}`);
      
      if (!data) {
        return { 
          content: [{ 
            type: 'text', 
            text: 'Failed to retrieve data' 
          }] 
        };
      }
      
      return { 
        content: [{ 
          type: 'text', 
          text: JSON.stringify(data, null, 2) 
        }] 
      };
    },
  );
}
```

3. Rebuild the server: `npm run build`
4. The tool will be automatically loaded on next server start

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues

#### "Cannot find module 'dotenv/config'"

**Solution:** Install dotenv dependency:
```bash
cd mcp-server
npm install dotenv
```

#### "Failed to retrieve [resource]"

**Possible causes:**
1. Checkmate API is not running - Ensure your Checkmate instance is accessible
2. Invalid API token - Verify your `CHECKMATE_API_TOKEN` is correct
3. Wrong API base URL - Check that `CHECKMATE_API_BASE` points to the correct server

**Debug steps:**
```bash
# Check if Checkmate API is accessible
curl http://localhost:3000/api/v1/orgs

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/v1/orgs
```

#### "MCP Server not showing in Claude Desktop"

**Solution:**
1. Verify config file path is correct for your OS
2. Check JSON syntax is valid (use a JSON validator)
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

#### "Permission denied" when running the server

**Solution:**
```bash
# Make the built file executable
chmod +x build/index.js
```

### Debugging

Enable verbose logging by checking stderr output. The server logs all API requests:

```
MCP › Fetch http://localhost:3000/api/v1/projects?orgId=1 [auth header set]
```

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review server logs (stderr output)
3. Verify your Checkmate API is working correctly
4. Open an issue on [GitHub](https://github.com/ds-horizon/checkmate/issues)
5. Join our [Discord](https://discord.gg/wBQXeYAKNc) community

## 📚 Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Checkmate Documentation](https://checkmate.dreamsportslabs.com/)
- [Checkmate API Documentation](https://documenter.getpostman.com/view/23217307/2sAYXFgwRt)

## 🤝 Contributing

Contributions are welcome! Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes in `mcp-server/src/`
4. Build and test (`npm run build && npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Part of the [Checkmate](https://github.com/ds-horizon/checkmate) project
- Created by [DreamSportsLabs](https://www.dreamsportslabs.com/)

---

**Need help?** Join our [Discord community](https://discord.gg/wBQXeYAKNc) or [open an issue](https://github.com/ds-horizon/checkmate/issues).

