import ProjectsDao from '~/db/dao/projects.dao'
import {CacheService} from '~/services/redis/cache'

export interface ICreateProject {
  projectName: string
  projectDescription?: string
  orgId: number
  createdBy: number
}

export interface IEditProject {
  projectName: string
  projectDescription?: string
  projectId: number
  userId: number
}

export interface IGetAllProjects {
  orgId: number
  page: number
  pageSize: number
  status?: 'Active' | 'Archived' | 'Deleted'
  textSearch?: String
  projectDescription?: string
}
export interface IArchiveProjects {
  projectId: number
  status: 'Active' | 'Archived' | 'Deleted'
  userId: number
  projectName?: string
}

const ProjectsController = {
  getAllProjects: async (params: IGetAllProjects) => {
    // Generate cache key based on parameters
    const cacheKey = {
      prefix: 'projects:all',
      orgId: params.orgId,
      additional: `page:${params.page}:size:${params.pageSize}:status:${
        params.status || 'all'
      }:search:${params.textSearch || ''}:desc:${
        params.projectDescription || ''
      }`,
    }

    return CacheService.getOrSet(cacheKey, () => ProjectsDao.getAll(params), {
      ttl: 300, // 5 minutes
      tags: [`org:${params.orgId}`, 'projects'],
    })
  },

  getProjectInfo: async (projectId: number) => {
    const cacheKey = {
      prefix: 'project:info',
      projectId,
    }

    return CacheService.getOrSet(
      cacheKey,
      () => ProjectsDao.getProjectInfo(projectId),
      {
        ttl: 600, // 10 minutes (project info changes less frequently)
        tags: [`project:${projectId}`, 'projects'],
      },
    )
  },

  createProject: async (params: ICreateProject) => {
    const result = await ProjectsDao.createProject(params)

    // Invalidate related caches
    await CacheService.invalidateByTag(`org:${params.orgId}`)
    await CacheService.invalidateByTag('projects')

    return result
  },

  editProject: async (params: IEditProject) => {
    const result = await ProjectsDao.editProject(params)

    // Invalidate specific project and org-level caches
    await CacheService.invalidateByTag(`project:${params.projectId}`)
    await CacheService.invalidateByTag('projects')

    return result
  },
  updateProjectStatus: async (params: IArchiveProjects) => {
    const {projectId, status} = params

    if (status === 'Archived') {
      // Use cached or fresh project info
      const projectInfo = await ProjectsController.getProjectInfo(projectId)
      const project = projectInfo?.[0]
      const projectName = project?.projectName

      if (!project || !projectName) {
        return Promise.reject({
          data: null,
          message: 'Project not found',
          status: 404,
        })
      }
      if (project.status !== 'Active') {
        return Promise.reject({
          data: null,
          message: 'Project is not active',
          status: 400,
        })
      }
      const timestamp = new Date().toISOString()
      const updatedName = `${projectName}_${timestamp}`

      const result = await ProjectsDao.updateProjectStatus({
        ...params,
        projectName: updatedName,
      })

      // Invalidate caches after successful update
      await CacheService.invalidateByTag(`project:${projectId}`)
      await CacheService.invalidateByTag('projects')

      return result
    } else {
      const result = await ProjectsDao.updateProjectStatus(params)

      // Invalidate caches after successful update
      await CacheService.invalidateByTag(`project:${projectId}`)
      await CacheService.invalidateByTag('projects')

      return result
    }
  },
}

export default ProjectsController
