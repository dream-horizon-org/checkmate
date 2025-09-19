import { createClient, RedisClientType } from 'redis'
import { logger, LogType } from '~/utils/logger'

class RedisService {
  private static instance: RedisService
  private client: RedisClientType | null = null
  private connected: boolean = false

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  public async connect(): Promise<void> {
    if (this.connected && this.client) return

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
      
      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
      })

      this.client.on('error', (err) => {
        logger({
          type: LogType.ERROR,
          tag: 'Redis Connection Error',
          message: err,
        })
      })

      this.client.on('connect', () => {
        logger({
          type: LogType.INFO,
          tag: 'Redis',
          message: 'Connected to Redis server',
        })
      })

      this.client.on('reconnecting', () => {
        logger({
          type: LogType.INFO,
          tag: 'Redis',
          message: 'Reconnecting to Redis server',
        })
      })

      await this.client.connect()
      this.connected = true
    } catch (error) {
      logger({
        type: LogType.ERROR,
        tag: 'Redis Connection Failed',
        message: error instanceof Error ? error.message : String(error),
      })
      // Don't throw - app should work without Redis
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client && this.connected) {
      await this.client.quit()
      this.connected = false
    }
  }

  public getClient(): RedisClientType | null {
    return this.connected ? this.client : null
  }

  public isConnected(): boolean {
    return this.connected
  }
}

export const redisService = RedisService.getInstance()
