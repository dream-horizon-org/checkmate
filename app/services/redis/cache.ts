import { logger, LogType } from '~/utils/logger'
import { redisService } from './client'

export interface CacheOptions {
  ttl?: number // Time to live in seconds (default: 5 minutes)
  tags?: string[] // Tags for invalidation
}

export interface CacheKey {
  prefix: string
  orgId?: number
  projectId?: number
  runId?: number
  userId?: number
  additional?: string
}

export class CacheService {
  private static readonly DEFAULT_TTL = 300 // 5 minutes
  private static readonly CACHE_PREFIX = 'checkmate'

  /**
   * Generate a cache key from components
   */
  private static generateKey(keyComponents: CacheKey): string {
    const parts = [CacheService.CACHE_PREFIX, keyComponents.prefix]
    
    if (keyComponents.orgId) parts.push(`org:${keyComponents.orgId}`)
    if (keyComponents.projectId) parts.push(`project:${keyComponents.projectId}`)
    if (keyComponents.runId) parts.push(`run:${keyComponents.runId}`)
    if (keyComponents.userId) parts.push(`user:${keyComponents.userId}`)
    if (keyComponents.additional) parts.push(keyComponents.additional)
    
    return parts.join(':')
  }

  /**
   * Get cached data
   */
  public static async get<T>(keyComponents: CacheKey): Promise<T | null> {
    const client = redisService.getClient()
    if (!client || !redisService.isConnected()) return null

    try {
      const key = this.generateKey(keyComponents)
      const cached = await client.get(key)
      
      if (cached) {
        logger({
          type: LogType.INFO,
          tag: 'Cache Hit',
          message: `Key: ${key}`,
        })
        return JSON.parse(cached)
      }
      
      logger({
        type: LogType.INFO,
        tag: 'Cache Miss',
        message: `Key: ${key}`,
      })
      return null
    } catch (error) {
      logger({
        type: LogType.ERROR,
        tag: 'Cache Get Error',
        message: error instanceof Error ? error.message : String(error),
      })
      return null
    }
  }

  /**
   * Set cached data with options
   */
  public static async set<T>(
    keyComponents: CacheKey,
    data: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const client = redisService.getClient()
    if (!client || !redisService.isConnected()) return

    try {
      const key = this.generateKey(keyComponents)
      const ttl = options.ttl || this.DEFAULT_TTL
      const serialized = JSON.stringify(data)

      // Set main cache entry
      await client.setEx(key, ttl, serialized)

      // Set tags for invalidation
      if (options.tags) {
        for (const tag of options.tags) {
          const tagKey = `${this.CACHE_PREFIX}:tag:${tag}`
          await client.sAdd(tagKey, key)
          await client.expire(tagKey, ttl + 60) // Tags expire slightly later
        }
      }

      logger({
        type: LogType.INFO,
        tag: 'Cache Set',
        message: `Key: ${key}, TTL: ${ttl}s`,
      })
    } catch (error) {
      logger({
        type: LogType.ERROR,
        tag: 'Cache Set Error',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Delete specific cache entry
   */
  public static async delete(keyComponents: CacheKey): Promise<void> {
    const client = redisService.getClient()
    if (!client || !redisService.isConnected()) return

    try {
      const key = this.generateKey(keyComponents)
      await client.del(key)
      
      logger({
        type: LogType.INFO,
        tag: 'Cache Delete',
        message: `Key: ${key}`,
      })
    } catch (error) {
      logger({
        type: LogType.ERROR,
        tag: 'Cache Delete Error',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Invalidate cache entries by tag
   */
  public static async invalidateByTag(tag: string): Promise<void> {
    const client = redisService.getClient()
    if (!client || !redisService.isConnected()) return

    try {
      const tagKey = `${this.CACHE_PREFIX}:tag:${tag}`
      const keys = await client.sMembers(tagKey)
      
      if (keys.length > 0) {
        await client.del(keys)
        await client.del(tagKey)
        
        logger({
          type: LogType.INFO,
          tag: 'Cache Invalidate',
          message: `Tag: ${tag}, Deleted ${keys.length} keys`,
        })
      }
    } catch (error) {
      logger({
        type: LogType.ERROR,
        tag: 'Cache Invalidate Error',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * Invalidate all cache entries for an organization
   */
  public static async invalidateOrg(orgId: number): Promise<void> {
    await this.invalidateByTag(`org:${orgId}`)
  }

  /**
   * Invalidate all cache entries for a project
   */
  public static async invalidateProject(projectId: number): Promise<void> {
    await this.invalidateByTag(`project:${projectId}`)
  }

  /**
   * Invalidate all cache entries for a run
   */
  public static async invalidateRun(runId: number): Promise<void> {
    await this.invalidateByTag(`run:${runId}`)
  }

  /**
   * Get or set pattern with automatic caching
   */
  public static async getOrSet<T>(
    keyComponents: CacheKey,
    fetchFunction: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(keyComponents)
    if (cached !== null) {
      return cached
    }

    // Fetch fresh data
    const freshData = await fetchFunction()
    
    // Cache the result
    await this.set(keyComponents, freshData, options)
    
    return freshData
  }

  /**
   * Clear all cache entries (use with caution)
   */
  public static async clearAll(): Promise<void> {
    const client = redisService.getClient()
    if (!client || !redisService.isConnected()) return

    try {
      const keys = await client.keys(`${this.CACHE_PREFIX}:*`)
      if (keys.length > 0) {
        await client.del(keys)
        logger({
          type: LogType.INFO,
          tag: 'Cache Clear All',
          message: `Deleted ${keys.length} keys`,
        })
      }
    } catch (error) {
      logger({
        type: LogType.ERROR,
        tag: 'Cache Clear All Error',
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }
}
