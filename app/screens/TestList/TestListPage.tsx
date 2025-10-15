import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher, useLoaderData, useLocation, useParams, useSearchParams} from '@remix-run/react'
import {Skeleton} from '@ui/skeleton'
import {useToast} from '@ui/use-toast'
import {useEffect, useState} from 'react'
import {Loader} from '~/components/Loader/Loader'
import {API} from '~/routes/utilities/api'
import {cn} from '~/ui/utils'
import {ProjectActions} from './ProjectActions'
import TestList from './TestList'
import {UploadDownloadButton} from './UploadDownloadButton'
import {createTestAddedMessage} from './utils'
import {Button} from '~/ui/button'
import {PlayCircle, FileText, CheckCircle2} from 'lucide-react'
import {SMALL_PAGE_SIZE} from '@route/utils/constants'

export default function TestListPage() {
  const projectId = useParams().projectId ? Number(useParams().projectId) : 0
  const location = useLocation()
  const {state} = location
  const {toast} = useToast()
  const projectNameFetcher = useFetcher<any>()
  const [projectName, setProjectName] = useState<string | null>(null)
  const navigate = useCustomNavigate()
  const saveChanges = useFetcher<any>()
  const createRun = useFetcher<any>()
  const loaderData: any = useLoaderData()
  const testsCount = loaderData?.data?.count?.count || 0

  useEffect(() => {
    projectNameFetcher.load(`/${API.GetProjectDetail}?projectId=${projectId}`)
  }, [])

  useEffect(() => {
    if (state) {
      if ((state.isCreateTestPage || state.isEditTestPage) && state.data) {
        toast({
          title: state.data.testTitle,
          description: state.data.message,
        })
      } else {
        const message = createTestAddedMessage(state.data)
        toast({
          title: state.title,
          description: message,
        })
      }
    }
  }, [state])

  useEffect(() => {
    if (projectNameFetcher?.data?.data[0]?.projectName) {
      setProjectName(projectNameFetcher?.data?.data[0]?.projectName)
    }
  }, [projectNameFetcher.data])

  useEffect(() => {
    if (saveChanges.data?.error === null) {
      const message = 'Successfully added'
      toast({
        title: 'Success',
        description: message,
        variant: 'success',
      })
    } else if (saveChanges.data?.error) {
      const message = saveChanges.data?.error
      toast({
        title: 'Failed',
        description: message,
        variant: 'destructive',
      })
    }
  }, [saveChanges.data])

  useEffect(() => {
    if (createRun.data?.data?.runId) {
      const runId = createRun.data?.data?.runId
      navigate(
        `/project/${projectId}/run/${runId}?page=1&pageSize=100&sortOrder=asc`,
      )
    } else if (createRun.data?.error) {
      toast({
        title: 'Failed',
        description: createRun.data?.error,
        variant: 'destructive',
      })
    }
  }, [createRun.data])

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Test Cases</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{testsCount}</span>
                  <span className="text-slate-500">total tests</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={(e) => {
                navigate(
                  `/project/${projectId}/runs?page=1&pageSize=${SMALL_PAGE_SIZE}&status=Active`,
                  {},
                  e,
                )
              }}
              className="shadow-sm">
              <PlayCircle className="w-4 h-4 mr-2" />
              View Runs
            </Button>
            <UploadDownloadButton projectName={projectName ?? ''} />
            <ProjectActions />
          </div>
        </div>
      </div>

      {/* Test List */}
      <div className="flex-1 overflow-auto pb-6">
        <TestList />
      </div>
      {createRun.state !== 'idle' && <Loader />}
    </div>
  )
}
