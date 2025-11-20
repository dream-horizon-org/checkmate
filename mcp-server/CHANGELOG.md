# Changelog

All notable changes to the Checkmate MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **PROJECT WRITE OPERATIONS:**
  - `create-project` - Create new projects
  - `edit-project` - Edit existing projects
  - `update-project-status` - Update project active status
  
- **TEST WRITE OPERATIONS:**
  - `create-test` - Create new test cases
  - `update-test` - Update existing test cases
  - `delete-test` - Delete test cases
  
- **TEST BULK OPERATIONS:**
  - `bulk-add-tests` - Create multiple tests at once
  - `bulk-update-tests` - Update multiple tests at once
  - `bulk-delete-tests` - Delete multiple tests at once
  
- **RUN WRITE OPERATIONS:**
  - `create-run` - Create new test runs
  - `edit-run` - Edit existing runs
  - `delete-run` - Delete test runs
  
- **METADATA WRITE OPERATIONS:**
  - `add-labels` - Add new labels to projects
  - `add-squads` - Add new squads to projects
  - `add-section` - Add new sections (test suites)
  - `edit-section` - Edit section names
  
- **DOWNLOAD OPERATIONS:**
  - `download-tests` - Export tests in JSON/CSV format
  - `download-report` - Export run reports in JSON/PDF/HTML format
  
- **USER OPERATIONS:**
  - `get-all-users` - List all users with filtering
  
- **DOCUMENTATION:**
  - Comprehensive API_REFERENCE.md with all tool details
  - Updated README with complete tool listing
  - Enhanced usage examples for all new tools

- Comprehensive README with setup instructions
- Environment configuration with `.env.example`
- Improved error handling and logging system
- Rate limiting and request retry logic
- Response caching utilities
- Unit tests with Jest
- ESLint and Prettier configuration
- MCP resource endpoints (server-info, health, api-docs)
- TypeScript strict mode
- CI/CD workflow with GitHub Actions
- CONTRIBUTING guide

### Changed
- Enhanced main server with config validation
- Improved tool response formatting
- Better error messages and debugging info
- Updated all tools with consistent error handling
- Expanded tool count from 27 to 48 tools (78% increase in functionality)

### Fixed
- Missing dotenv dependency
- Silent failures in API requests
- Security issue with token logging
- Query string building for URL parameters

## [1.0.0] - 2025-11-20

### Added
- Initial release
- 27 tool implementations for Checkmate API
- Dynamic tool loading
- Stdio transport for MCP protocol
- Basic TypeScript setup

[Unreleased]: https://github.com/ds-horizon/checkmate/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ds-horizon/checkmate/releases/tag/v1.0.0

