import {BulkAddTestRequestAPIType} from '@api/bulkAddTest'
import {CreateTestRequestAPIType} from '@api/createTest'
import {UpdateTestRequestAPIType} from '@api/updateTest'
import AutomationStatusDao from '@dao/automationStatus.dao'
import PlatformDao from '@dao/platform.dao'
import PriorityDao from '@dao/priority.dao'
import SectionsDao from '@dao/sections.dao'
import SquadsDao from '@dao/squads.dao'
import TestCoveredByDao from '@dao/testCoveredBy.dao'
import TestsDao, {IBulkAddTestsDao} from '~/db/dao/test.dao'
import {handleNewSectionAndSquad} from './utils'
import SectionsController, {ICreateSectionResponse} from './sections.controller'
import SquadsController from './squads.controller'
import {addSectionHierarchy} from '@components/SectionList/utils'
import {SectionWithHierarchy} from '@components/SectionList/interfaces'
import {CacheService} from '~/services/redis/cache'

export interface ITestStatus {
  projectId: number
  testId: number
  runId: number
}

export interface ITestsController {
  projectId: number
  labelIds?: number[]
  squadIds?: number[]
  sectionIds?: number[]
  platformIds?: number[]
  page: number
  pageSize: number
  textSearch?: string
  filterType?: 'and' | 'or'
  status?: 'Active' | 'Archived' | 'Deleted'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ITestsCountController {
  projectId: number
  labelIds?: number[]
  squadIds?: number[]
  filterType?: 'and' | 'or'
  includeTestIds?: boolean
  status?: 'Active' | 'Archived' | 'Deleted'
  textSearch?: string
  sectionIds?: number[]
  platformIds?: number[]
}

export interface IUpdateTests {
  testIds: number[]
  property: string
  value?: null | any
  projectId?: null | number
  userId: number
}

export interface ICreateTestController extends CreateTestRequestAPIType {
  createdBy: number
  assignedTo: number
}

export interface IDeleteTestController {
  testId: number
  userId: number
}

export type IUpdateTestController = UpdateTestRequestAPIType & {
  updatedBy: number
}

export interface IUpdateLabelTestMapController {
  labelIds: number[]
  testId: number
  createdBy: number
  projectId: number
}

interface IBulkAddTestsController extends BulkAddTestRequestAPIType {
  createdBy: number
  orgId: number
}

export interface IBulkDeleteTests {
  testIds: number[]
  projectId: number
  userId: number
}

const TestsController = {
  getTests: async (params: ITestsController) => {
    const cacheKey = {
      prefix: 'tests:list',
      projectId: params.projectId,
      additional: `page:${params.page}:size:${params.pageSize}:labels:${
        params.labelIds?.join(',') || ''
      }:squads:${params.squadIds?.join(',') || ''}:sections:${
        params.sectionIds?.join(',') || ''
      }:platforms:${params.platformIds?.join(',') || ''}:search:${
        params.textSearch || ''
      }:filter:${params.filterType || ''}:status:${params.status || ''}:sort:${
        params.sortBy || ''
      }:order:${params.sortOrder || ''}`,
    }

    return CacheService.getOrSet(
      cacheKey,
      async () => {
        const [testData, count] = await Promise.all([
          TestsDao.getTests(params),
          TestsDao.getTestsCount(params),
        ])
        return {testData, count}
      },
      {
        ttl: 180, // 3 minutes (tests change frequently)
        tags: [`project:${params.projectId}`, 'tests'],
      },
    )
  },
  getTestsCount: async (params: ITestsCountController) => {
    const cacheKey = {
      prefix: 'tests:count',
      projectId: params.projectId,
      additional: `labels:${params.labelIds?.join(',') || ''}:squads:${
        params.squadIds?.join(',') || ''
      }:sections:${params.sectionIds?.join(',') || ''}:platforms:${
        params.platformIds?.join(',') || ''
      }:search:${params.textSearch || ''}:filter:${
        params.filterType || ''
      }:status:${params.status || ''}:includeIds:${
        params.includeTestIds || false
      }`,
    }

    return CacheService.getOrSet(
      cacheKey,
      () => TestsDao.getTestsCount(params),
      {
        ttl: 300, // 5 minutes
        tags: [`project:${params.projectId}`, 'tests'],
      },
    )
  },
  createTest: async (params: ICreateTestController) => {
    const results = await handleNewSectionAndSquad(params)
    if (results?.newSection) params.sectionId = results.newSection.sectionId
    if (results?.newSquad) params.squadId = results.newSquad.squadId

    const result = await TestsDao.createTest(params)

    // Invalidate project-level test caches
    await CacheService.invalidateByTag(`project:${params.projectId}`)
    await CacheService.invalidateByTag('tests')

    return result
  },
  deleteTest: async (params: IDeleteTestController) => {
    const result = await TestsDao.deleteTest(params)

    // Invalidate caches for the deleted test
    await CacheService.invalidateByTag(`project:${params.projectId}`)
    await CacheService.invalidateByTag(`test:${params.testId}`)
    await CacheService.invalidateByTag('tests')

    return result
  },
  updateTest: async (params: IUpdateTestController) => {
    const results = await handleNewSectionAndSquad({
      new_section: params.new_section,
      new_squad: params.new_squad,
      projectId: params.projectId,
      createdBy: params.updatedBy,
    })
    if (results?.newSection) params.sectionId = results.newSection.sectionId
    if (results?.newSquad) params.squadId = results.newSquad.squadId

    const result = await TestsDao.updateTest(params)

    // Invalidate caches for the updated test
    await CacheService.invalidateByTag(`project:${params.projectId}`)
    await CacheService.invalidateByTag(`test:${params.testId}`)
    await CacheService.invalidateByTag('tests')

    return result
  },
  updateLabelTestMap: (params: IUpdateLabelTestMapController) =>
    TestsDao.updateLabelTestMap(params),
  updateTests: async (params: IUpdateTests) => {
    const result = await TestsDao.updateTests(params)

    // Invalidate caches for bulk test updates
    if (params.projectId) {
      await CacheService.invalidateByTag(`project:${params.projectId}`)
    }
    // Invalidate individual test caches if test IDs provided
    for (const testId of params.testIds) {
      await CacheService.invalidateByTag(`test:${testId}`)
    }
    await CacheService.invalidateByTag('tests')

    return result
  },

  bulkAddTests: async (param: IBulkAddTestsController) => {
    try {
      const squadsAdded = []
      const sectionsAdded: ICreateSectionResponse[] = []

      const allSquads = await SquadsDao.getAllSquads({
        projectId: param.projectId,
      })
      let squadsData: {
        squadName: string
        squadId: number
        projectId: number
      }[] = []
      if (allSquads) {
        squadsData = allSquads.map((squad) => {
          return {
            squadName: squad.squadName,
            squadId: squad.squadId,
            projectId: squad.projectId,
          }
        })
      }

      const allSections = await SectionsDao.getAllSections({
        projectId: param.projectId,
      })
      let sectionsData: {
        sectionName: string
        sectionId: number
        projectId: number
        parentId: number | null
        sectionHierarchy: string
      }[] = []
      if (allSections) {
        sectionsData = addSectionHierarchy({
          sectionsData: allSections,
        }).map((item) => {
          return {
            sectionName: item.sectionName,
            sectionId: item.sectionId,
            projectId: item.projectId,
            parentId: item.parentId,
            sectionHierarchy: item.sectionHierarchy,
          }
        })
      }

      const allPriority = await PriorityDao.getAllPriority({
        orgId: param.orgId,
      })
      const allAutomationStatus =
        await AutomationStatusDao.getAllAutomationStatus({
          orgId: param.orgId,
        })
      const allPlatforms = await PlatformDao.getAllPlatform({
        orgId: param.orgId,
      })
      const allTestCoveredBy = await TestCoveredByDao.getAllTestCoveredBy({
        orgId: param.orgId,
      })

      const defaultPriorityId = allPriority?.find(
        (priority) => priority.priorityName === 'Medium',
      )?.priorityId
      const defaultAutomationStatusId = allAutomationStatus?.find(
        (automationStatus) =>
          automationStatus.automationStatusName === 'Automatable',
      )?.automationStatusId
      const defaultPlatformId = allPlatforms?.find(
        (platform) => platform.platformName === 'All Platforms',
      )?.platformId
      const defaultTestCoveredById = allTestCoveredBy?.find(
        (testCoveredBy) => testCoveredBy.testCoveredByName === 'Manual',
      )?.testCoveredById

      const insertTest: IBulkAddTestsDao[] = []

      for (const test of param.tests) {
        let squadId = squadsData.find(
          (squad) => squad.squadName === test.squad?.trim(),
        )?.squadId
        if (!squadId && test.squad) {
          const newSquad = await SquadsController.checkAndCreateSquad({
            squadName: test.squad?.trim(),
            projectId: param.projectId,
            createdBy: param.createdBy,
          })
          if (newSquad) {
            squadsData.push(newSquad)
            squadsAdded.push(newSquad)
            squadId = newSquad.squadId
          }
        }

        const testSectionHierarchy = test.section
          .split('>')
          .map((item) => item?.trim())
          .join(' > ')

        let sectionId = sectionsData.find((section) => {
          return (
            section.sectionHierarchy === testSectionHierarchy &&
            section.projectId === param.projectId
          )
        })?.sectionId
        if (!sectionId) {
          const newSection =
            await SectionsController.createSectionFromHierarchy({
              createdBy: param.createdBy,
              projectId: param.projectId,
              sectionHierarchyString: testSectionHierarchy,
              sectionDescription: test.sectionDescription,
            })

          if (newSection) {
            sectionsData.push({
              ...newSection,
              sectionHierarchy: testSectionHierarchy,
            })
            sectionsAdded.push(newSection)
            sectionId = newSection.sectionId
          }
        }

        const priorityId =
          allPriority?.find(
            (priority) => priority.priorityName === test?.priority?.trim(),
          )?.priorityId ?? defaultPriorityId

        const automationStatusId =
          allAutomationStatus?.find(
            (automationStatus) =>
              automationStatus.automationStatusName ===
              test?.automationStatus?.trim(),
          )?.automationStatusId ?? defaultAutomationStatusId

        const platformId =
          allPlatforms?.find(
            (platform) => platform.platformName === test?.platform?.trim(),
          )?.platformId ?? defaultPlatformId

        const testCoveredById =
          allTestCoveredBy?.find(
            (testCoveredBy) =>
              testCoveredBy.testCoveredByName === test?.testCoveredBy?.trim(),
          )?.testCoveredById ?? defaultTestCoveredById

        const testId = test.testId ? Number(test.testId) : undefined

        if (
          priorityId &&
          platformId &&
          automationStatusId &&
          sectionId &&
          testCoveredById
        )
          insertTest.push({
            testId,
            title: test.title?.trim(),
            squadId,
            priorityId,
            platformId,
            testCoveredById,
            automationStatusId,
            steps: test.steps?.trim(),
            preConditions: test.preConditions?.trim(),
            expectedResult: test.expectedResult?.trim(),
            sectionId,
            projectId: param.projectId,
            createdBy: param.createdBy,
            automationId: test.automationId,
            additionalGroups: test.additionalGroups,
            description: test.description,
            jiraTicket: test.jiraTicket,
            defects: test.defects,
          })
      }

      const resp = await TestsDao.bulkAddTests({
        insertTest,
        labelIds: param.labelIds,
        projectId: param.projectId,
        createdBy: param.createdBy,
      })
      return {
        testData: resp,
        squadsAdded,
        sectionsAdded,
      }
    } catch (error: any) {
      throw error
    }
  },

  getTestStatus: (param: ITestStatus) => TestsDao.getTestStatus(param),

  getTestDetails: async (projectId: number, testId: number) => {
    const cacheKey = {
      prefix: 'test:details',
      projectId,
      additional: `testId:${testId}`,
    }

    return CacheService.getOrSet(
      cacheKey,
      () => TestsDao.getTestDetails({projectId, testId}),
      {
        ttl: 600, // 10 minutes
        tags: [`project:${projectId}`, `test:${testId}`, 'tests'],
      },
    )
  },

  downloadTests: (params: ITestsController) => TestsDao.downloadTests(params),
  bulkDeleteTests: (params: IBulkDeleteTests) =>
    TestsDao.bulkDeleteTests(params),
}

export default TestsController
