# Checkmate API Documentation

This document provides comprehensive API documentation for the Checkmate Test Management System in OpenAPI 3.0 format.

## 📄 Documentation Files

- **openapi.yaml** - Complete OpenAPI 3.0 specification for all API endpoints

## 🚀 Viewing the Documentation

### Option 1: Swagger UI (Recommended)

1. **Using Swagger Editor Online:**
   - Visit [https://editor.swagger.io/](https://editor.swagger.io/)
   - Copy the contents of `openapi.yaml`
   - Paste into the editor
   - View the interactive documentation on the right

2. **Using Local Swagger UI:**
   ```bash
   # Install swagger-ui-watcher globally
   npm install -g swagger-ui-watcher
   
   # Run in the project directory
   swagger-ui-watcher openapi.yaml
   ```

3. **Using Docker:**
   ```bash
   docker run -p 8080:8080 -e SWAGGER_JSON=/openapi.yaml -v $(pwd):/openapi swaggerapi/swagger-ui
   ```
   Then visit http://localhost:8080

### Option 2: Redoc

```bash
# Install redoc-cli
npm install -g redoc-cli

# Generate static HTML
redoc-cli bundle openapi.yaml -o api-docs.html

# Open in browser
open api-docs.html
```

### Option 3: VS Code Extensions

Install one of these VS Code extensions:
- **OpenAPI (Swagger) Editor** by 42Crunch
- **Swagger Viewer** by Arjun G

Then open `openapi.yaml` to view and test the API.

## 📋 API Overview

### Base URL
- **Development:** `http://localhost:3000` (default port, configurable via `PORT` env var)
- **Production:** `https://your-production-domain.com` (replace with your actual production URL)

### Authentication
All endpoints require authentication via session cookies from Google OAuth.

### Authorization (RBAC)
Three role levels:
- **Admin**: Full access to all resources
- **User**: Can create, read, update resources
- **Reader**: Read-only access

## 📚 API Categories

### 1. Projects
- `GET /api/v1/projects` - List all projects
- `POST /api/v1/project/create` - Create a project
- `PUT /api/v1/project/edit` - Update a project
- `PUT /api/v1/project/update-status` - Archive/activate project
- `GET /api/v1/project/detail` - Get project details

### 2. Tests
- `GET /api/v1/project/tests` - List all tests (with filters)
- `POST /api/v1/test/create` - Create a test case
- `PUT /api/v1/test/update` - Update a test case
- `DELETE /api/v1/test/delete` - Delete a test case
- `POST /api/v1/test/bulk-add` - Bulk create tests
- `DELETE /api/v1/test/bulk-delete` - Bulk delete tests
- `PUT /api/v1/test/bulk-update` - Bulk update tests
- `GET /api/v1/test/details` - Get test details
- `GET /api/v1/project/tests-count` - Get test count
- `GET /api/v1/test/test-status-history` - Get status history

### 3. Runs
- `GET /api/v1/runs` - List all test runs
- `POST /api/v1/run/create` - Create a test run
- `PUT /api/v1/run/edit` - Update a run
- `DELETE /api/v1/run/delete` - Delete a run
- `GET /api/v1/run/detail` - Get run details
- `GET /api/v1/run/tests` - Get tests in run
- `GET /api/v1/run/state-detail` - Get run status summary
- `PUT /api/v1/run/update-test-status` - Update test status in run
- `PUT /api/v1/run/lock` - Lock/unlock a run
- `PUT /api/v1/run/reset` - Reset run (Passed → Retest)
- `PUT /api/v1/run/remove-tests` - Remove tests from run
- `GET /api/v1/run/test-status` - Get test status in run
- `GET /api/v1/run/test-status-history` - Get test status history in run

### 4. Configuration
- `GET /api/v1/labels` - Get labels
- `POST /api/v1/project/add-labels` - Add label
- `GET /api/v1/project/squads` - Get squads
- `POST /api/v1/project/add-squads` - Add squad
- `GET /api/v1/project/sections` - Get sections
- `POST /api/v1/project/add-section` - Add section
- `PUT /api/v1/project/edit-section` - Edit section
- `GET /api/v1/priority` - Get priorities
- `GET /api/v1/automation-status` - Get automation statuses
- `GET /api/v1/platform` - Get platforms
- `GET /api/v1/test-covered-by` - Get test coverage types
- `GET /api/v1/type` - Get test types

### 5. Organizations
- `GET /api/v1/orgs` - List organizations
- `GET /api/v1/org/detail` - Get organization details

### 6. Users
- `GET /api/v1/user/details` - Get current user details
- `GET /api/v1/all-users` - Get all users (Admin only)
- `PUT /api/v1/user/update-role` - Update user role (Admin only)
- `POST /api/v1/token/generate` - Generate API token
- `DELETE /api/v1/token/delete` - Delete API token

### 7. Reports
- `GET /api/v1/run/report-download` - Download run report (CSV)
- `GET /api/v1/tests/download` - Download tests (CSV)

## 🔄 Test Statuses

Valid test statuses for runs:
- `Passed` - Test executed successfully
- `Failed` - Test failed
- `Blocked` - Test cannot be executed
- `Untested` - Test not yet executed
- `Retest` - Test needs to be re-executed
- `Archived` - Test archived
- `Skipped` - Test skipped
- `InProgress` - Test execution in progress

## 📝 Common Request Examples

### Create a Test Case

```bash
curl -X POST http://localhost:3000/api/v1/test/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Login with valid credentials",
    "projectId": 1,
    "sectionId": 5,
    "priorityId": 2,
    "automationStatusId": 1,
    "labelIds": [1, 3],
    "steps": "1. Navigate to login page\n2. Enter valid username\n3. Enter valid password\n4. Click login",
    "expectedResult": "User should be logged in successfully"
  }'
```

### Create a Test Run

```bash
curl -X POST http://localhost:3000/api/v1/run/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "runName": "Sprint 23 Regression",
    "projectId": 1,
    "testIds": [101, 102, 103, 104]
  }'
```

### Update Test Status in Run

```bash
curl -X PUT http://localhost:3000/api/v1/run/update-test-status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "runId": 15,
    "testIdStatusArray": [
      { "testId": 101, "status": "Passed" },
      { "testId": 102, "status": "Failed" }
    ],
    "comment": "Test execution completed"
  }'
```

### Get Tests with Filters

```bash
curl "http://localhost:3000/api/v1/project/tests?projectId=1&page=1&pageSize=50&priority=2,3&status=1&textSearch=login" \
  -b cookies.txt
```

## 🛠️ Testing the API

### Using Postman

1. Import the `openapi.yaml` file into Postman
2. Postman will automatically create a collection with all endpoints
3. Set up authentication cookies
4. Start testing!

### Using Insomnia

1. Create a new request collection
2. Import from URL or file: `openapi.yaml`
3. Configure authentication
4. Test endpoints

### Using cURL

See the examples above for cURL usage patterns.

## 📊 Response Formats

### Success Response
```json
{
  "data": {
    // Response data object
  },
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong",
  "status": 400
}
```

## 🔐 Authentication Flow

1. User navigates to `/login`
2. Redirected to Google OAuth
3. After successful authentication, session cookie is set
4. Cookie is automatically sent with subsequent requests
5. Session validated on each API call

## ⚙️ Pagination

Paginated endpoints support these parameters:
- `page` (default: 1) - Page number
- `pageSize` (default: 100) - Items per page

Response includes:
- `data.items` - Array of items
- `data.totalCount` - Total number of items

## 🔍 Filtering

Test and run list endpoints support various filters:
- `textSearch` - Search by text
- `priority` - Filter by priority IDs (comma-separated)
- `status` - Filter by status IDs (comma-separated)
- `squad` - Filter by squad IDs (comma-separated)
- `label` - Filter by label IDs (comma-separated)
- `platform` - Filter by platform IDs (comma-separated)
- `section` - Filter by section IDs (comma-separated)

## 📦 Data Models

### Test Case
A test case contains:
- Basic info (title, description)
- Classification (section, squad, priority, type)
- Technical details (automation status, platform, test covered by)
- Test content (preconditions, steps, expected result)
- Metadata (labels, Jira ticket, defects, automation ID)

### Test Run
A test run contains:
- Run info (name, status)
- Test collection (linked tests with execution status)
- Metadata (created by, created on)

### Project
A project contains:
- Project info (name, description)
- Organization link
- Configuration (labels, squads, sections)

## 🚨 Error Codes

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 📖 Additional Resources

- [Checkmate GitHub Repository](https://github.com/your-org/checkmate)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger Documentation](https://swagger.io/docs/)

## 🤝 Contributing

To update the API documentation:
1. Modify the `openapi.yaml` file
2. Validate using a linter: `npx @apidevtools/swagger-cli validate openapi.yaml`
3. Test the changes in Swagger UI
4. Submit a pull request

## 📝 License

This API documentation is part of the Checkmate project and is licensed under the MIT License.

