import {useLoaderData, useParams, useSearchParams} from '@remix-run/react'
import {SearchBar} from '~/components/SearchBar/SearchBar'
import {Button} from '@ui/button'
import {FileText, Plus, PlayCircle, Lock} from 'lucide-react'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import RunList from './RunsList'

export default function RunListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const projectId = useParams().projectId
  const navigate = useCustomNavigate()
  const response = useLoaderData<any>()
  const runsCount = response?.data?.runsData?.runsCount?.[0]?.count || 0
  const currentStatus = searchParams.get('status') || 'Active'

  const handleChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value === '') {
          prev.delete('search')
          prev.set('page', (1).toString())
          return prev
        }
        prev.set('search', value)
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )
  }

  return (
    <div className="flex flex-col h-full pt-6">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 pb-4 mb-4 border-b border-slate-200">
        {/* Title and Action Buttons Row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Runs</h1>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-sm text-slate-500">{runsCount} total runs</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="default"
              className="shadow-sm"
              onClick={() => navigate(`/project/${projectId}/tests?page=1&pageSize=100`, {})}>
              <PlayCircle className="mr-2 h-4 w-4" />
              View Tests
            </Button>
            <Button
              variant="default"
              size="default"
              className="shadow-sm"
              onClick={() => navigate(`/project/${projectId}/createRun`, {})}>
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar
              handlechange={handleChange}
              placeholdertext={'Search by run name...'}
              searchstring={searchParams.get('search') ?? ''}
            />
          </div>
          <Button
            variant="outline"
            size="default"
            className={currentStatus === 'Active' ? 'shadow-sm border-slate-900 bg-slate-50' : 'shadow-sm'}
            onClick={() => navigate(`/project/${projectId}/runs?page=1&pageSize=10&status=Active`, {})}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Active
          </Button>
          <Button
            variant="outline"
            size="default"
            className={currentStatus === 'Locked' ? 'shadow-sm border-slate-900 bg-slate-50' : 'shadow-sm'}
            onClick={() => navigate(`/project/${projectId}/runs?page=1&pageSize=10&status=Locked`, {})}>
            <Lock className="mr-2 h-4 w-4" />
            Locked
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <RunList />
      </div>
    </div>
  )
}
