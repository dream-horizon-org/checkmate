import {checkProjectOwnership} from '../projectOwnership'
import ProjectsDao from '~/db/dao/projects.dao'
import {AccessType} from '../api'

jest.mock('~/db/dao/projects.dao')

describe('checkProjectOwnership', () => {
  const mockProjectInfo = [
    {
      projectId: 1,
      projectName: 'Test Project',
      createdBy: 100,
      orgId: 1,
      status: 'Active',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow ADMIN to access any project', async () => {
    const result = await checkProjectOwnership({
      projectId: 1,
      userId: 200,
      userRole: AccessType.ADMIN,
    })

    expect(result.hasAccess).toBe(true)
    expect(result.message).toBeUndefined()
    // Should not even query the database for admin
    expect(ProjectsDao.getProjectInfo).not.toHaveBeenCalled()
  })

  it('should deny READER role from modifying projects', async () => {
    const result = await checkProjectOwnership({
      projectId: 1,
      userId: 100,
      userRole: AccessType.READER,
    })

    expect(result.hasAccess).toBe(false)
    expect(result.message).toBe(
      'Reader role does not have permission to modify projects',
    )
  })

  it('should allow USER to access their own project', async () => {
    ;(ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue(
      mockProjectInfo,
    )

    const result = await checkProjectOwnership({
      projectId: 1,
      userId: 100, // Same as createdBy in mockProjectInfo
      userRole: AccessType.USER,
    })

    expect(result.hasAccess).toBe(true)
    expect(result.message).toBeUndefined()
    expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(1)
  })

  it('should deny USER from accessing project they did not create', async () => {
    ;(ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue(
      mockProjectInfo,
    )

    const result = await checkProjectOwnership({
      projectId: 1,
      userId: 200, // Different from createdBy (100)
      userRole: AccessType.USER,
    })

    expect(result.hasAccess).toBe(false)
    expect(result.message).toBe(
      'You do not have permission to modify this project. Only the project creator or an admin can perform this action.',
    )
  })

  it('should deny access when project is not found', async () => {
    ;(ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue([])

    const result = await checkProjectOwnership({
      projectId: 999,
      userId: 100,
      userRole: AccessType.USER,
    })

    expect(result.hasAccess).toBe(false)
    expect(result.message).toBe('Project not found')
  })

  it('should handle database errors gracefully', async () => {
    ;(ProjectsDao.getProjectInfo as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    )

    const result = await checkProjectOwnership({
      projectId: 1,
      userId: 100,
      userRole: AccessType.USER,
    })

    expect(result.hasAccess).toBe(false)
    expect(result.message).toBe('Error verifying project ownership')
  })
})

