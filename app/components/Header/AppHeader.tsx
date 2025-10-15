import {User} from '@dao/users.dao'
import {cn} from '~/ui/utils'
import {SideDrawer} from './SideDrawer'
import {UserComponent} from './UserComponent'
import {ProjectSwitcher} from './ProjectSwitcher'
import {Button} from '~/ui/button'
import {Menu, FileText, MessageCircle, AlertCircle} from 'lucide-react'
import {APP_NAME} from '~/constants'
import {useState, useEffect} from 'react'
import {useParams, useLocation} from '@remix-run/react'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {ORG_ID, SMALL_PAGE_SIZE} from '@route/utils/constants'

export const AppHeader = ({user}: {user: User | undefined}) => {
  const {projectId} = useParams()
  const location = useLocation()
  const navigate = useCustomNavigate()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved === 'true'
    }
    return false
  })

  // Check if we're on pages without sidebar (projects or tests list)
  const isProjectsPage = location.pathname.includes('/projects')
  const isTestsPage = location.pathname.match(/\/project\/\d+\/tests/)
  const noSidebar = isProjectsPage || isTestsPage
  
  // Initialize CSS variable on mount and update on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        noSidebar ? '0rem' : isCollapsed ? '4rem' : '16rem',
      )
    }
  }, [isCollapsed, noSidebar])

  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between px-8 sticky top-0 z-50',
          'bg-slate-900 border-b border-slate-800',
          'shadow-sm',
          'h-16',
        )}>
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Toggle Button - Only show if not on projects/tests page */}
          {!noSidebar && projectId && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white hover:bg-slate-800"
                onClick={() => setIsCollapsed(!isCollapsed)}>
                <Menu className="h-5 w-5" />
              </Button>

              {/* Separator */}
              <div className="h-6 w-px bg-slate-700"></div>
            </>
          )}

          {/* App Name - Clickable to go to projects */}
          <button
            onClick={(e) => {
              e.preventDefault()
              navigate(`/projects?orgId=${ORG_ID}&page=1&pageSize=${SMALL_PAGE_SIZE}`, {})
            }}
            className="text-xl font-semibold text-white tracking-tight hover:text-slate-300 transition-colors cursor-pointer">
            {APP_NAME}
          </button>

          {/* Project Switcher - Only show if in a project */}
          {projectId && (
            <>
              {/* Separator */}
              <div className="h-6 w-px bg-slate-700"></div>

              {/* Project Switcher */}
              <ProjectSwitcher />
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Documentation */}
          <a
            href="https://checkmate.dreamsportslabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <FileText className="h-4 w-4" />
            <span>Docs</span>
          </a>

          {/* Ask Question */}
          <a
            href="https://discord.gg/wBQXeYAKNc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>Discord</span>
          </a>

          {/* Report Issue */}
          <a
            href="https://github.com/dream-sports-labs/checkmate/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <AlertCircle className="h-4 w-4" />
            <span>Issues</span>
          </a>

          {/* Separator */}
          <div className="h-6 w-px bg-slate-700"></div>

          {/* User Component */}
          {user?.userId && UserComponent(user)}
        </div>
      </header>

      {/* Sidebar - Only show if not on projects/tests page */}
      {!noSidebar && projectId && (
        <SideDrawer isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
    </>
  )
}
