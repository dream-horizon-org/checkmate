# Checkmate API Authentication & Authorization Guide

This guide explains how to authenticate and authorize requests to Checkmate APIs.

## 🔐 Authentication Methods

Checkmate supports **two authentication methods**:

### 1. **Session-Based Authentication (Primary Method)**
Used by the web application interface.

### 2. **API Token Authentication**
Used for programmatic API access.

---

## 📱 Method 1: Session-Based Authentication (Web App)

### How It Works:
1. User logs in via Google OAuth at `/login`
2. Server creates a session and stores it in a secure HTTP-only cookie
3. Cookie is automatically sent with each subsequent request
4. Cookie name: `user_session`

### Step-by-Step Authentication:

#### Step 1: Navigate to Login
```bash
# Open in browser
http://localhost:3000/login
```

#### Step 2: Authenticate with Google
- Click "Sign in with Google"
- Complete Google OAuth flow
- You'll be redirected back to the app

#### Step 3: Session Cookie is Set
The server automatically sets a cookie named `user_session` which contains:
- User information
- Session data
- Encrypted with secret: `checkmate_session`

#### Step 4: Make API Calls
The browser automatically includes the cookie in requests:

```javascript
// Example: Fetch projects using fetch API
fetch('http://localhost:3000/api/v1/projects?orgId=1&page=1&pageSize=10', {
  method: 'GET',
  credentials: 'include', // Important: Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => console.log(data));
```

### Using cURL with Session Cookies:

#### Step 1: Get Session Cookie
First, you need to authenticate via browser or extract the cookie.

#### Step 2: Use Cookie in cURL
```bash
# Save cookies to file during login
curl -c cookies.txt http://localhost:3000/login

# Use saved cookies
curl -b cookies.txt http://localhost:3000/api/v1/projects?orgId=1&page=1&pageSize=10

# Or specify cookie directly
curl -H "Cookie: user_session=your_session_value" \
  http://localhost:3000/api/v1/projects?orgId=1&page=1&pageSize=10
```

### Session Cookie Details:
- **Name:** `user_session`
- **Type:** HTTP-only (cannot be accessed via JavaScript)
- **Secure:** HTTPS only in production
- **SameSite:** Lax (CSRF protection)
- **Path:** `/` (all routes)

---

## 🔑 Method 2: API Token Authentication (Programmatic Access)

### How It Works:
1. Generate an API token via the web interface or API
2. Include the token in the `Authorization` header
3. Token is validated on each request

### Step 1: Generate an API Token

#### Via Web Interface:
1. Log in to Checkmate
2. Navigate to your profile/settings
3. Click "Generate API Token"
4. Copy and save the token securely

#### Via API:
```bash
# First, authenticate with session cookie
curl -X POST http://localhost:3000/api/v1/token/generate \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1
  }'
```

**Response:**
```json
{
  "data": {
    "token": "your_api_token_here_abc123xyz",
    "userId": 1,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "status": 201
}
```

### Step 2: Use API Token in Requests

#### Using cURL:
```bash
# Include token in Authorization header
curl -X GET http://localhost:3000/api/v1/projects?orgId=1&page=1&pageSize=10 \
  -H "Authorization: Bearer your_api_token_here_abc123xyz" \
  -H "Content-Type: application/json"
```

#### Using JavaScript/Fetch:
```javascript
const API_TOKEN = 'your_api_token_here_abc123xyz';

fetch('http://localhost:3000/api/v1/projects?orgId=1&page=1&pageSize=10', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Using Python (requests):
```python
import requests

API_TOKEN = 'your_api_token_here_abc123xyz'
BASE_URL = 'http://localhost:3000'

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

response = requests.get(
    f'{BASE_URL}/api/v1/projects',
    headers=headers,
    params={'orgId': 1, 'page': 1, 'pageSize': 10}
)

print(response.json())
```

#### Using Postman:
1. Create a new request
2. Go to "Authorization" tab
3. Select "Bearer Token" type
4. Paste your token
5. Send request

### Step 3: Delete/Revoke a Token

```bash
curl -X DELETE http://localhost:3000/api/v1/token/delete \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 123
  }'
```

---

## 🛡️ Authorization (RBAC)

Checkmate uses **Role-Based Access Control (RBAC)** powered by Casbin.

### User Roles:

#### 1. **Reader**
- **Permissions:** Read-only access
- **Can:** View projects, tests, runs
- **Cannot:** Create, update, or delete anything

#### 2. **User**
- **Permissions:** Read and write access
- **Can:** 
  - View projects, tests, runs
  - Create tests, runs
  - Update test status
  - Add labels, squads, sections
- **Cannot:** Delete projects, manage users

#### 3. **Admin**
- **Permissions:** Full access
- **Can:** 
  - Everything a User can do
  - Delete projects, tests, runs
  - Manage users and roles
  - Archive projects
  - Generate tokens

### How Authorization Works:

1. **User makes request** → Include session cookie or API token
2. **Authentication check** → Verify identity
3. **Authorization check** → Check if user's role has permission
4. **RBAC evaluation** → Casbin evaluates: `(role, resource, action)`
5. **Allow or Deny** → Request proceeds or returns 403 Forbidden

### Authorization Flow:
```
Request → checkForUserAndAccess() → getUser() + isUserAllowedToAccess()
                                         ↓
                                    Casbin Enforcer
                                         ↓
                           Check: (role, resource, method)
                                         ↓
                                  Allow or Deny
```

---

## 📝 Complete Examples

### Example 1: Create a Test Case

```bash
# Using session cookie
curl -X POST http://localhost:3000/api/v1/test/create \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Verify user login functionality",
    "projectId": 1,
    "sectionId": 5,
    "priorityId": 2,
    "automationStatusId": 1,
    "labelIds": [1, 3],
    "steps": "1. Open login page\n2. Enter credentials\n3. Click login",
    "expectedResult": "User should be logged in successfully"
  }'
```

```bash
# Using API token
curl -X POST http://localhost:3000/api/v1/test/create \
  -H "Authorization: Bearer your_api_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Verify user login functionality",
    "projectId": 1,
    "sectionId": 5,
    "priorityId": 2,
    "automationStatusId": 1,
    "labelIds": [1, 3],
    "steps": "1. Open login page\n2. Enter credentials\n3. Click login",
    "expectedResult": "User should be logged in successfully"
  }'
```

### Example 2: Update Test Status in Run

```bash
curl -X PUT http://localhost:3000/api/v1/run/update-test-status \
  -H "Authorization: Bearer your_api_token" \
  -H "Content-Type: application/json" \
  -d '{
    "runId": 15,
    "testIdStatusArray": [
      { "testId": 101, "status": "Passed" },
      { "testId": 102, "status": "Failed" },
      { "testId": 103, "status": "Blocked" }
    ],
    "comment": "Tested on staging environment"
  }'
```

### Example 3: Get Tests with Filters

```bash
curl -X GET "http://localhost:3000/api/v1/project/tests?projectId=1&page=1&pageSize=50&priority=2,3&status=1&textSearch=login" \
  -H "Authorization: Bearer your_api_token" \
  -H "Content-Type: application/json"
```

---

## 🚫 Common Authentication Errors

### Error 401: Unauthorized
```json
{
  "error": "Unauthorized - Please login",
  "status": 401
}
```
**Solution:** 
- Session cookie expired or missing
- Invalid or expired API token
- Log in again or generate a new token

### Error 403: Forbidden
```json
{
  "error": "User does not have access",
  "status": 403
}
```
**Solution:**
- User role doesn't have permission for this action
- Contact admin to update your role
- Readers cannot perform write operations

### Error 400: Bad Request
```json
{
  "error": "Invalid param orgId",
  "status": 400
}
```
**Solution:**
- Check request parameters
- Validate required fields
- Review API documentation

---

## 🔒 Security Best Practices

### 1. **Protect Your Tokens**
- Never commit tokens to git
- Store tokens in environment variables
- Use secret management tools (Vault, AWS Secrets Manager)
- Rotate tokens regularly

### 2. **Use HTTPS in Production**
```bash
# Environment variable
NODE_ENV=production
```
- Session cookies automatically set `Secure` flag
- All traffic encrypted

### 3. **Token Storage**
```bash
# Good: Environment variable
export CHECKMATE_API_TOKEN="your_token_here"

# Good: .env file (gitignored)
CHECKMATE_API_TOKEN=your_token_here

# Bad: Hardcoded in source code
const token = "abc123xyz"; // Don't do this!
```

### 4. **Minimal Permissions**
- Use "Reader" role for read-only access
- Only grant "Admin" when necessary
- Regularly audit user permissions

---

## 🧪 Testing Authentication

### Test Session Authentication:
```bash
# 1. Login and save cookies
curl -c cookies.txt -L http://localhost:3000/login

# 2. Use cookies in API call
curl -b cookies.txt http://localhost:3000/api/v1/user/details

# Expected: Your user details
```

### Test Token Authentication:
```bash
# 1. Generate token (requires session)
TOKEN=$(curl -X POST http://localhost:3000/api/v1/token/generate \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}' | jq -r '.data.token')

# 2. Use token in API call
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/user/details

# Expected: Your user details
```

### Test Authorization (RBAC):
```bash
# Try an admin-only endpoint with non-admin user
curl -H "Authorization: Bearer your_reader_token" \
  http://localhost:3000/api/v1/all-users

# Expected: 403 Forbidden
```

---

## 📚 Additional Resources

- **OpenAPI Spec:** `openapi.yaml`
- **API Documentation:** `API_DOCUMENTATION.md`
- **Auth Service:** `app/services/auth/Auth.server.ts`
- **RBAC Config:** `rbac_model.conf`
- **Session Management:** `app/services/auth/session.ts`

---

## ❓ FAQ

### Q: How long do session cookies last?
A: Session cookies last until the browser is closed (session cookie) or the user logs out.

### Q: Do API tokens expire?
A: Currently, tokens don't expire automatically. You can manually revoke them via the API.

### Q: Can I use both methods simultaneously?
A: Yes, but typically:
- Web interface → Session cookies
- API/Scripts → API tokens

### Q: How do I change my role?
A: Contact an admin user who can update roles via:
```bash
PUT /api/v1/user/update-role
```

### Q: What if I forget my API token?
A: Tokens cannot be retrieved. You must:
1. Delete the old token
2. Generate a new token

### Q: Can I have multiple API tokens?
A: Yes, you can generate multiple tokens for different applications/environments.

---

## 🆘 Need Help?

If you encounter authentication issues:
1. Check server logs for detailed error messages
2. Verify your role has required permissions
3. Ensure token/cookie is valid and not expired
4. Review RBAC policies in `rbac_model.conf`
5. Contact your Checkmate administrator

---

**Last Updated:** 2024
**API Version:** 1.0.0

