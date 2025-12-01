# Contributing to Checkmate MCP Server

Thank you for your interest in contributing to the Checkmate MCP Server! This guide will help you get started.

## 🚀 Quick Start

1. **Fork and clone** the repository
2. **Navigate** to the MCP server directory: `cd mcp-server`
3. **Install** dependencies: `npm install`
4. **Configure** environment: `cp .env.example .env` and fill in values
5. **Build**: `npm run build`
6. **Test**: `npm test`

## 📁 Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── resources.ts          # MCP resource endpoints
│   ├── rateLimiter.ts        # Rate limiting and caching
│   ├── tools/                # Tool definitions
│   │   ├── utils.ts          # Shared utilities
│   │   ├── types.ts          # Shared types
│   │   └── [toolName]/
│   │       └── index.ts      # Individual tool implementation
│   └── __tests__/            # Test files
├── build/                    # Compiled output (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Follow these guidelines:

- **Code Style**: Use TypeScript with strict mode enabled
- **Formatting**: Run `npm run format` before committing
- **Linting**: Run `npm run lint:fix` to auto-fix issues
- **Type Checking**: Run `npm run typecheck` to verify types
- **Testing**: Add tests for new features

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage

# Lint and format
npm run lint
npm run format:check
```

### 4. Build and Test Locally

```bash
# Build the server
npm run build

# Test the built server
node build/index.js
```

### 5. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add new tool for retrieving test metrics"
git commit -m "fix: resolve timeout issue in API requests"
git commit -m "docs: update README with new examples"
git commit -m "test: add tests for rate limiter"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Adding a New Tool

To add a new tool to the MCP server:

### 1. Create Tool Directory

```bash
mkdir -p src/tools/myNewTool
```

### 2. Create Tool Implementation

Create `src/tools/myNewTool/index.ts`:

```typescript
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { handleApiResponse, buildQueryString } from '../utils.js';

/**
 * My new tool description
 *
 * Detailed explanation of what this tool does,
 * including use cases and examples.
 */
export default function registerMyNewTool(
  server: McpServer,
  makeRequest: <T>(path: string, init?: RequestInit) => Promise<T | null>,
) {
  server.tool(
    'my-new-tool',
    'Short description of what this tool does',
    {
      // Define parameters with Zod schemas
      param1: z.string().describe('Description of param1'),
      param2: z.number().optional().describe('Optional param2'),
    },
    async ({ param1, param2 }) => {
      try {
        // Build query string or request body
        const queryParams = buildQueryString({ param1, param2 });

        // Make API request
        const data = await makeRequest(`api/v1/your-endpoint?${queryParams}`);

        // Return formatted response
        return handleApiResponse(data, 'Failed to retrieve data from my-new-tool');
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
```

### 3. Add Tests

Create `src/tools/myNewTool/__tests__/index.test.ts`:

```typescript
import registerMyNewTool from '../index';

describe('myNewTool', () => {
  it('should register the tool', () => {
    // Add your tests here
  });
});
```

### 4. Build and Test

```bash
npm run build
npm test
```

The tool will be automatically loaded on server start!

## ✅ Code Quality Standards

### TypeScript

- Use strict TypeScript mode
- Avoid `any` types when possible
- Document complex types and interfaces
- Use Zod for runtime validation

### Error Handling

```typescript
try {
  const data = await makeRequest('api/v1/endpoint');
  return handleApiResponse(data, 'Specific error message');
} catch (error) {
  return {
    content: [
      {
        type: 'text' as const,
        text: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
      },
    ],
    isError: true,
  };
}
```

### Documentation

- Add JSDoc comments for functions and complex logic
- Update README.md when adding new features
- Include examples in tool descriptions

### Testing

- Write unit tests for utilities and helpers
- Write integration tests for tools
- Aim for >80% code coverage
- Use meaningful test descriptions

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Node.js version
   - Operating system
   - Checkmate version
   - MCP server version
6. **Logs**: Relevant error messages or logs

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check existing issues first
2. Provide detailed use case
3. Explain expected behavior
4. Consider implementation approach

## 📚 Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Checkmate API Docs](https://documenter.getpostman.com/view/23217307/2sAYXFgwRt)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zod Documentation](https://zod.dev/)

## 🤝 Code of Conduct

Please be respectful and constructive in all interactions. See the main [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) for details.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- Join our [Discord](https://discord.gg/wBQXeYAKNc)
- Open a [GitHub Discussion](https://github.com/dream-horizon-org/checkmate/discussions)
- Check the [main README](../README.md)

Thank you for contributing! 🎉
