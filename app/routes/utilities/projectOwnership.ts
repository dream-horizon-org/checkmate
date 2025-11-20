import ProjectsDao from '~/db/dao/projects.dao'
import {AccessType} from './api'

export interface ICheckProjectOwnership {
  projectId: number
  userId: number
  userRole: string
}

/**
 * Check if a user has permission to modify a project
 * - ADMIN users can modify any project
 * - USER role can only modify projects they created
 * - READER role cannot modify any project
 */
export async function checkProjectOwnership({
  projectId,
  userId,
  userRole,
}: ICheckProjectOwnership): Promise<{
  hasAccess: boolean
  message?: string
}> {
  // ADMIN users have access to all projects
  if (userRole === AccessType.ADMIN) {
    return {hasAccess: true}
  }

  // READER role should not reach here, but handle it
  if (userRole === AccessType.READER) {
    return {
      hasAccess: false,
      message: 'Reader role does not have permission to modify projects',
    }
  }

  // For USER role, check if they created the project
  try {
    const projectInfo = await ProjectsDao.getProjectInfo(projectId)
    const project = projectInfo?.[0]

    if (!project) {
      return {
        hasAccess: false,
        message: 'Project not found',
      }
    }

    // Check if user is the creator
    if (project.createdBy === userId) {
      return {hasAccess: true}
    }

    return {
      hasAccess: false,
      message:
        'You do not have permission to modify this project. Only the project creator or an admin can perform this action.',
    }
  } catch (error) {
    console.error('Error checking project ownership:', error)
    return {
      hasAccess: false,
      message: 'Error verifying project ownership',
    }
  }
}

