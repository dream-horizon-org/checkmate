import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { CacheService } from '~/services/redis/cache'
import { redisService } from '~/services/redis/client'
import { getUserAndCheckAccess } from '~/routes/utilities/checkForUserAndAccess'
import { errorResponseHandler, responseHandler } from '~/routes/utilities/responseHandler'
import { API } from '../../utilities/api'

// Cache admin endpoint - for debugging and monitoring
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Only allow admin users to access cache stats
    await getUserAndCheckAccess({
      request,
      resource: API.GetAllUser, // Reuse admin-only API access
    })

    const client = redisService.getClient()
    if (!client || !redisService.isConnected()) {
      return responseHandler({
        data: { connected: false, message: 'Redis not connected' },
        status: 200,
      })
    }

    // Get cache statistics
    const info = await client.info('memory')
    const keys = await client.keys('checkmate:*')
    const keyCount = keys.length

    // Sample some keys to show cache structure
    const sampleKeys = keys.slice(0, 10)
    const samples = []
    
    for (const key of sampleKeys) {
      const ttl = await client.ttl(key)
      const type = await client.type(key)
      samples.push({ key, ttl, type })
    }

    return responseHandler({
      data: {
        connected: true,
        keyCount,
        memoryInfo: info,
        sampleKeys: samples,
        totalKeys: keys.length,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}

// Clear cache endpoint
export async function action({ request }: ActionFunctionArgs) {
  try {
    // Only allow admin users to clear cache
    await getUserAndCheckAccess({
      request,
      resource: API.GetAllUser,
    })

    const url = new URL(request.url)
    const action = url.searchParams.get('action')
    const tag = url.searchParams.get('tag')
    const orgId = url.searchParams.get('orgId')
    const projectId = url.searchParams.get('projectId')

    let message = ''
    
    if (action === 'clear-all') {
      await CacheService.clearAll()
      message = 'All cache entries cleared'
    } else if (action === 'clear-tag' && tag) {
      await CacheService.invalidateByTag(tag)
      message = `Cache entries with tag '${tag}' cleared`
    } else if (action === 'clear-org' && orgId) {
      await CacheService.invalidateOrg(parseInt(orgId))
      message = `Cache entries for org ${orgId} cleared`
    } else if (action === 'clear-project' && projectId) {
      await CacheService.invalidateProject(parseInt(projectId))
      message = `Cache entries for project ${projectId} cleared`
    } else {
      return responseHandler({
        error: 'Invalid action or missing parameters',
        status: 400,
      })
    }

    return responseHandler({
      data: { message },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
