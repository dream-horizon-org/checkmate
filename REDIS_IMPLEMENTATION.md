# Redis Cache Implementation

This document explains the Redis caching layer implementation added to the Checkmate application.

## 🚀 Overview

Redis caching has been integrated to significantly improve application performance by:
- Reducing database queries for frequently accessed data
- Improving response times for complex queries
- Enabling better horizontal scaling
- Providing intelligent cache invalidation

## 📁 File Structure

```
app/services/redis/
├── client.ts          # Redis connection management
├── cache.ts           # Cache service with utilities
```

## 🔧 Configuration

### Environment Variables
Add to your `.env` file:
```env
REDIS_URL=redis://localhost:6379
```

### Docker Setup
Redis is included in the `docker-compose.yml`:
```yaml
checkmate-redis:
  image: redis:7.2-alpine
  container_name: checkmate-redis
  ports:
    - 6379:6379
  volumes:
    - checkmate-redis:/data
```

## 🎯 Cache Strategy

### Cache Keys Structure
```
checkmate:{prefix}:{context}:{additional}
```

Examples:
- `checkmate:projects:all:org:1:page:1:size:10`
- `checkmate:test:details:project:123:testId:456`
- `checkmate:tests:count:project:123:labels:1,2,3`

### Cache Tags for Invalidation
- `org:{orgId}` - Organization-level data
- `project:{projectId}` - Project-specific data
- `test:{testId}` - Individual test data
- `tests` - General test-related data
- `projects` - General project-related data

### TTL (Time To Live) Strategy
- **Project listings**: 5 minutes (300s)
- **Project info**: 10 minutes (600s)
- **Test listings**: 3 minutes (180s) - changes frequently
- **Test details**: 10 minutes (600s)
- **Test counts**: 5 minutes (300s)

## 📊 Cached Operations

### Projects Controller
- `getAllProjects()` - Cached with pagination and search parameters
- `getProjectInfo()` - Cached per project with longer TTL
- Cache invalidation on: create, edit, updateStatus

### Tests Controller
- `getTests()` - Cached with complex filter parameters
- `getTestsCount()` - Cached count queries
- `getTestDetails()` - Individual test details
- Cache invalidation on: create, update, delete, bulk operations

## 🔄 Cache Invalidation

### Automatic Invalidation
Cache is automatically invalidated when:
- **Projects**: Created, edited, or status changed
- **Tests**: Created, updated, deleted, or bulk operations
- **Cross-entity**: Project changes invalidate related test caches

### Manual Cache Management
Admin endpoint for cache monitoring and management:
```
GET  /api/v1/cache        # View cache stats
POST /api/v1/cache        # Clear cache operations
```

Clear operations:
```bash
# Clear all cache
POST /api/v1/cache?action=clear-all

# Clear by tag
POST /api/v1/cache?action=clear-tag&tag=projects

# Clear by organization
POST /api/v1/cache?action=clear-org&orgId=1

# Clear by project
POST /api/v1/cache?action=clear-project&projectId=123
```

## 🛡️ Error Handling

The cache implementation is **resilient**:
- Application continues to work if Redis is unavailable
- All cache operations are wrapped in try-catch blocks
- Fallback to database queries when cache fails
- Logging for cache hits/misses and errors

## 📈 Performance Impact

### Before Caching
- Every page load = multiple database queries
- Project listing: ~200ms response time
- Test listing with filters: ~500ms response time

### After Caching (Expected)
- Cached responses: ~50ms response time
- Database load reduced by ~70%
- Better concurrent user handling

## 🔍 Monitoring & Debugging

### Cache Statistics
```javascript
// View cache info via admin endpoint
const stats = await fetch('/api/v1/cache')
```

### Logs
Cache operations are logged with:
- Cache hits/misses
- Cache set operations
- Invalidation operations
- Connection errors

### Redis CLI Commands
```bash
# Connect to Redis
redis-cli

# View all cache keys
KEYS checkmate:*

# Check key TTL
TTL checkmate:projects:all:org:1

# View key content
GET checkmate:project:info:1

# Monitor Redis operations
MONITOR
```

## 🚀 Usage Examples

### Cached Data Fetching
```typescript
// Automatic cache usage in controllers
const projects = await ProjectsController.getAllProjects({
  orgId: 1,
  page: 1,
  pageSize: 10
})
// First call: Database query + cache set
// Subsequent calls: Cache hit (fast response)
```

### Manual Cache Operations
```typescript
import { CacheService } from '~/services/redis/cache'

// Manual cache set
await CacheService.set(
  { prefix: 'custom', orgId: 1 },
  data,
  { ttl: 300, tags: ['custom'] }
)

// Manual cache invalidation
await CacheService.invalidateByTag('projects')
await CacheService.invalidateProject(123)
```

## ⚙️ Installation & Setup

1. **Install Redis dependency**:
   ```bash
   yarn add redis@^4.6.0
   ```

2. **Start with Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Environment setup**:
   ```env
   REDIS_URL=redis://localhost:6379
   ```

4. **Verify connection**:
   Server logs will show Redis connection status on startup.

## 🔧 Configuration Options

### Redis Client Settings
```typescript
// In client.ts
const client = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
})
```

### Cache Service Settings
```typescript
// Default TTL
const DEFAULT_TTL = 300 // 5 minutes

// Cache key prefix
const CACHE_PREFIX = 'checkmate'
```

## 🚨 Important Notes

1. **Graceful Degradation**: App works without Redis
2. **Tag-based Invalidation**: Ensures data consistency
3. **Admin Only**: Cache management requires admin access
4. **Memory Usage**: Monitor Redis memory consumption
5. **Key Expiration**: All keys have TTL to prevent memory bloat

This implementation provides a robust caching layer that improves performance while maintaining data consistency and application reliability.
