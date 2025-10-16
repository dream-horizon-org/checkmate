# 🚀 Quick Start - API Documentation

## View the Documentation Locally

```bash
# Navigate to docs folder
cd docs

# Install dependencies (if not already done)
yarn install

# Start development server
yarn dev
```

**Open in browser:** http://localhost:4321

**Navigate to:** User Guide → API Documentation

## What You'll Find

### 📖 API Documentation Section

```
API Documentation/
├── REST API Overview        ← Start here!
├── Authentication          ← Learn how to auth
├── API Reference           ← All endpoints
├── Code Examples           ← Copy-paste examples
└── OpenAPI Specification   ← Download OpenAPI spec
```

### ✨ Features

- **Interactive Navigation** - Click through organized sidebar
- **Syntax Highlighting** - Beautiful code blocks
- **Multi-Language Examples** - JavaScript, Python, cURL
- **Search** - Find anything quickly (Cmd/Ctrl + K)
- **Mobile Responsive** - Works on all devices
- **Dark Mode** - Toggle theme in top right

## Quick Test

### 1. Generate an API Token

```bash
# Login to Checkmate web interface
# Then generate a token:

curl -X POST http://localhost:3000/api/v1/token/generate \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

### 2. Try Your First API Call

```bash
# Set your token
export CHECKMATE_TOKEN="your_token_here"

# Get all projects
curl -X GET "http://localhost:3000/api/v1/projects?orgId=1&page=1&pageSize=10" \
  -H "Authorization: Bearer $CHECKMATE_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Explore the Docs

Visit the following sections in order:

1. **API Overview** - Understand the basics
2. **Authentication** - Set up your auth
3. **API Reference** - Browse all endpoints
4. **Code Examples** - See real-world use cases

## Import to Postman

### Option 1: Via URL (Once Deployed)
1. Open Postman
2. Import → Link
3. Paste: `https://your-docs-site.com/openapi.yaml`

### Option 2: Via File
1. Open Postman
2. Import → File
3. Select: `/Users/mayank.kush/Documents/workspace/checkmate/openapi.yaml`

## Deploy to Production

```bash
# Commit your changes
git add .
git commit -m "Add comprehensive API documentation"
git push origin master

# Auto-deploy will handle the rest!
```

Visit: https://checkmate.dreamsportslabs.com/guides/api

## Need Help?

- **Discord:** https://discord.gg/wBQXeYAKNc
- **GitHub Issues:** https://github.com/dream-sports-labs/checkmate/issues
- **Postman Collection:** https://documenter.getpostman.com/view/23217307/2sAYXFgwRt

---

**That's it! Your API documentation is ready.** 🎉

