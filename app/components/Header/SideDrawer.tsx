import {useLocation, useParams} from '@remix-run/react'
import {LARGE_PAGE_SIZE, SMALL_PAGE_SIZE} from '@route/utils/constants'
import {useEffect} from 'react'
import {ListChecks, Play} from 'lucide-react'
import {cn} from '~/ui/utils'
import {NavItem} from './SideDrawrComponents'

interface SideDrawerProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export const SideDrawer = ({isCollapsed}: SideDrawerProps) => {
  const {projectId} = useParams()
  const location = useLocation()
  const containsRun = location.pathname.includes('run')
  const containsRuns = location.pathname.includes('runs')

  useEffect(() => {
    // Save sidebar state to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(isCollapsed))
    }
  }, [isCollapsed])

  return (
    <div
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out z-40 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64',
      )}>
      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {projectId && (
            <>
              {!containsRuns && (
                <NavItem
                  icon={Play}
                  label="Runs"
                  to={`/project/${projectId}/runs?page=1&pageSize=${SMALL_PAGE_SIZE}&status=Active`}
                  isCollapsed={isCollapsed}
                />
              )}
              {containsRun && (
                <NavItem
                  icon={ListChecks}
                  label="Tests"
                  to={`/project/${projectId}/tests?page=1&pageSize=${LARGE_PAGE_SIZE}`}
                  isCollapsed={isCollapsed}
                />
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
