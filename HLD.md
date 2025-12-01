

# Checkmate - High-Level Design (HLD)

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Application Layers](#application-layers)
- [Request Flow](#request-flow)
- [Database Design](#database-design)
- [Authentication & Authorization](#authentication--authorization)
- [API Architecture](#api-architecture)
- [Security](#security)
- [Deployment](#deployment)

---

## System Overview

Checkmate is a full-stack test case management system built with modern web technologies, designed to help QA teams efficiently manage test cases, organize test runs, and track execution status.

### Architecture Style
- **Monolithic Full-Stack Application**
- **Server-Side Rendering (SSR)** with Remix
- **RESTful API** for external integrations
- **RBAC-based Authorization** with Casbin
- **MySQL Database** as single source of truth

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │  Browser   │  │  Postman   │  │  External Integrations │ │
│  │ (React UI) │  │  /cURL     │  │  (CI/CD, Scripts)      │ │
│  └────────────┘  └────────────┘  └────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Server                        │
│                      (Remix + Node.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Presentation Layer                   │  │
│  │  • React Components (UI)                             │  │
│  │  • Remix Routes (SSR)                                │  │
│  │  • Client-Side State Management                      │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────┴───────────────────────────────┐  │
│  │                  Business Logic Layer                 │  │
│  │  • Data Controllers (Business Logic)                 │  │
│  │  • Service Layer (Auth, RBAC, Config)                │  │
│  │  • Validation Layer (Zod Schemas)                    │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────┴───────────────────────────────┐  │
│  │                   Data Access Layer                   │  │
│  │  • Drizzle ORM                                        │  │
│  │  • DAO (Data Access Objects)                          │  │
│  │  • Database Client                                    │  │
│  └──────────────────────┬───────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    MySQL Database                     │  │
│  │  • Test Cases, Projects, Runs                        │  │
│  │  • Users, Organizations, Roles                       │  │
│  │  • Labels, Sections, Squads                          │  │
│  │  • Configuration Tables                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     External Services                        │
│  ┌────────────────────┐  ┌──────────────────────────────┐  │
│  │  Google OAuth 2.0  │  │  Casbin Policy Enforcer      │  │
│  │  (Authentication)  │  │  (Authorization)             │  │
│  └────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Remix** - Full-stack React framework with SSR
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **shadcn/ui** - Modern UI components
- **TailwindCSS** - Utility-first CSS
- **TanStack Table** - Advanced data tables

### Backend
- **Node.js** - JavaScript runtime
- **Remix** - Server-side rendering & routing
- **Drizzle ORM** - Type-safe database ORM
- **Zod** - Schema validation
- **Casbin** - RBAC authorization
- **Remix-Auth** - Authentication

### Database
- **MySQL 8** - Relational database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Container orchestration
- **Vite** - Build tool

---

## Application Layers

### 1. Presentation Layer (`app/`)
**Responsibilities:** UI rendering, user interactions, client routing

**Structure:**
```
app/
├── components/        # Reusable UI components
├── screens/           # Page-level components
├── ui/               # shadcn/ui primitives
├── routes/           # Remix route handlers
└── styles/           # Global styles
```

### 2. Business Logic Layer (`app/dataController/`)
**Responsibilities:** Business rules, data validation, orchestration

**Controllers:**
- `projects.controller.ts` - Project management
- `tests.controller.ts` - Test case operations
- `runs.controller.ts` - Test run management
- `users.controller.ts` - User operations
- `labels.controller.ts`, `sections.controller.ts`, `squads.controller.ts` - Configuration

### 3. Service Layer (`app/services/`)
**Responsibilities:** Cross-cutting concerns

**Services:**
- `auth/` - Authentication logic
- `rbac/` - Authorization (Casbin)
- `config.ts` - Environment configuration

### 4. Data Access Layer (`app/db/`)
**Responsibilities:** Database operations

**Structure:**
```
app/db/
├── client.ts         # Drizzle client
├── schema/           # Table schemas
└── dao/              # Data Access Objects
```

---

## Request Flow

### Web Interface Request Flow

```
User Action (Browser)
    ↓
React Component
    ↓
Remix Route (/api/v1/...)
    ↓
Authentication Check (Session/Token)
    ↓
Authorization Check (Casbin RBAC)
    ↓
Data Controller (Business Logic)
    ↓
DAO (Database Query)
    ↓
MySQL Database
    ↓
Response (JSON)
    ↓
UI Update
```

### API Request Flow

```
External Client (CI/CD, Postman)
    ↓
HTTP Request + Bearer Token
    ↓
API Endpoint
    ↓
Token Validation
    ↓
RBAC Permission Check
    ↓
Controller → DAO → Database
    ↓
JSON Response
```

---

## Database Design

### Core Entities

```
Organization (1) ──→ (N) Projects (1) ──→ (N) Tests
                 └──→ (N) Users

Projects (1) ──→ (N) Runs (M) ←──→ (N) Tests
                                  (via test_run_mapping)

Tests (M) ←──→ (N) Labels
Tests (M) ←──→ (N) Squads  
Tests (M) ←──→ (N) Platforms
Tests (N) ──→ (1) Section (hierarchical)
Tests (N) ──→ (1) Priority
```

### Key Tables

**projects**
- projectId, projectName, orgId
- description, createdBy, isArchived

**tests**
- testId, title, description, projectId
- sectionId, priorityId, automationStatusId
- steps, expectedResult, testData

**runs**
- runId, runName, projectId
- isLocked, lockedBy, createdBy

**test_run_mapping**
- mappingId, runId, testId
- status (Passed/Failed/Blocked/Untested/Retest)
- testedBy, testedOn, comment

**users**
- userId, email, firstName, lastName
- role (admin/user/reader)
- ssoId (Google OAuth), orgId

---

## Authentication & Authorization

### Authentication (Google OAuth)

```
User → /login
    ↓
Google OAuth 2.0
    ↓
User authenticates
    ↓
Remix Auth Handler (/callback)
    ↓
Find or Create User in DB
    ↓
Create Session (HTTP-only cookie)
    ↓
Redirect to Dashboard
```

### Authorization (RBAC with Casbin)

**Roles:**
- **admin** - Full access (CRUD all resources)
- **user** - Create/Update (no delete, no user management)
- **reader** - Read-only access

**Permission Model:**
```
Subject (role) + Object (resource) + Action (CRUD)
↓
Casbin Enforcer
↓
Allow or Deny
```

**Example:**
```
user.role = "user"
resource = "test"
action = "create"
→ Casbin: ALLOW

user.role = "reader"
resource = "project"
action = "delete"
→ Casbin: DENY
```

---

## API Architecture

### Endpoint Structure

```
/api/v1/{resource}/{action}
```

### API Layers

```
API Endpoint
    ↓
Authentication (Token/Session)
    ↓
Authorization (RBAC)
    ↓
Input Validation (Zod)
    ↓
Business Logic (Controller)
    ↓
Data Access (DAO)
    ↓
Response (JSON)
```

### Response Format

**Success:**
```json
{
  "data": { ... },
  "status": 200
}
```

**Error:**
```json
{
  "error": "Error message",
  "status": 400
}
```

### Total Endpoints: 48

| Category | Count |
|----------|-------|
| Projects | 5 |
| Tests | 7 |
| Runs | 9 |
| Labels, Squads, Sections | 12 |
| Configuration | 4 |
| Users & Auth | 5 |
| Reports | 2 |

---

## Security

### Multi-Layer Security

1. **Network Security**
   - HTTPS (TLS 1.3)
   - Secure headers
   - CORS configuration

2. **Authentication**
   - Google OAuth 2.0
   - Secure HTTP-only cookies
   - API token (Bearer)
   - Token rotation

3. **Authorization**
   - Casbin RBAC
   - Role-based permissions
   - Resource-level access control

4. **Input Validation**
   - Zod schema validation
   - Type checking
   - Sanitization

5. **Database Security**
   - Parameterized queries (Drizzle ORM)
   - SQL injection prevention
   - Encrypted connections

---

## Deployment

### Docker Architecture

```yaml
services:
  checkmate-db:
    - MySQL 8
    - Port: 3306
    - Volume: db_data
    
  db_seeder:
    - Seeds initial data
    - Depends on: checkmate-db
    
  checkmate-app:
    - Node.js + Remix
    - Port: 3000
    - Depends on: checkmate-db
```

### Build Process

```bash
# 1. Install dependencies
yarn install

# 2. Build application
yarn build

# 3. Start Docker containers
yarn docker:setup

# 4. Access
http://localhost:3000
```

### Environment Variables

```env
DATABASE_URL=mysql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NODE_ENV=production
SESSION_SECRET=...
```

---

## Performance Optimizations

1. **Server-Side Rendering (SSR)**
   - Faster initial page load
   - Better SEO

2. **Code Splitting**
   - Lazy loading
   - Smaller bundles

3. **Database Optimization**
   - Indexed columns
   - Pagination
   - Optimized queries

4. **Caching**
   - Browser caching
   - Static asset caching

---

## Scalability

### Current Architecture
- **Vertical Scaling** - Increase container resources
- **Database Connection Pooling**
- **Optimized Queries**

### Future Enhancements
- **Horizontal Scaling** - Multiple app instances with load balancer
- **Caching Layer** - Redis for session & data caching
- **CDN** - Static asset delivery
- **Read Replicas** - Database read scaling
- **Message Queue** - Async processing

---

## Testing Strategy

```
Test Pyramid:
    
    E2E Tests        (Few)
    ↑
    Integration      (Some)
    ↑
    Unit Tests       (Many)
```

**Test Coverage:**
- Controllers (unit tests)
- Utilities (unit tests)
- Routes (integration tests)
- API endpoints (integration tests)

---

## Monitoring & Logging

### Logging
```typescript
logger.info('Test created', { testId, userId });
logger.error('Failed to create test', error);
logger.warn('Performance degradation', metrics);
```

### Error Handling
- Centralized error handler
- Structured error responses
- Error logging
- User-friendly messages

---

## Key Design Decisions

### Why Remix?
- ✅ Full-stack framework
- ✅ Built-in SSR
- ✅ File-based routing
- ✅ Built-in data loading
- ✅ Progressive enhancement

### Why Drizzle ORM?
- ✅ Type-safe queries
- ✅ SQL-like syntax
- ✅ Lightweight
- ✅ Excellent TypeScript support
- ✅ Migration support

### Why Casbin?
- ✅ Flexible RBAC
- ✅ Policy-based authorization
- ✅ Multiple model support
- ✅ Well-maintained
- ✅ Language agnostic

### Why MySQL?
- ✅ Mature and stable
- ✅ Strong community
- ✅ Excellent tooling
- ✅ ACID compliance
- ✅ Good performance

---

## Future Roadmap

1. **Enhanced Reporting**
   - Dashboards with charts
   - Trend analysis
   - Custom reports

2. **Real-Time Collaboration**
   - WebSocket integration
   - Live updates
   - @mentions

3. **Webhooks**
   - Event notifications
   - External integrations

4. **Advanced Filtering**
   - Saved filters
   - Query builder

5. **Mobile App**
   - React Native
   - Offline support

---

## Resources

- **Documentation:** https://checkmate.dreamhorizon.org
- **API Docs:** https://checkmate.dreamhorizon.org/guides/api
- **GitHub:** https://github.com/dream-horizon-org/checkmate
- **Discord:** https://discord.gg/wBQXeYAKNc
- **Postman:** https://documenter.getpostman.com/view/23217307/2sAYXFgwRt

---

## Conclusion

Checkmate is architected as a modern, secure, and scalable test case management system with:

✅ **Clean Architecture** - Clear separation of concerns  
✅ **Type Safety** - End-to-end TypeScript  
✅ **Security First** - Multi-layer security with RBAC  
✅ **API-Driven** - RESTful APIs for integrations  
✅ **Developer-Friendly** - Modern tools and practices  
✅ **Well-Documented** - Comprehensive documentation  

The architecture supports current requirements while remaining flexible for future enhancements and scale.

