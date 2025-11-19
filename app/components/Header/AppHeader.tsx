import {User} from '@dao/users.dao'
import {cn} from '~/ui/utils'
import {UserComponent} from './UserComponent'
import {ProjectSwitcher} from './ProjectSwitcher'
import {FileText, MessageCircle, AlertCircle} from 'lucide-react'
import {APP_NAME} from '~/constants'
import {useEffect} from 'react'
import {useParams} from '@remix-run/react'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {ORG_ID, SMALL_PAGE_SIZE} from '@route/utils/constants'

export const AppHeader = ({user}: {user: User | undefined}) => {
  const {projectId} = useParams()
  const navigate = useCustomNavigate()
  
  // Always set CSS variable to 0 (no sidebar)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--sidebar-width', '0rem')
    }
  }, [])

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
          {/* App Logo - Clickable to go to projects */}
          <button
            onClick={(e) => {
              e.preventDefault()
              navigate(`/projects?orgId=${ORG_ID}&page=1&pageSize=${SMALL_PAGE_SIZE}`, {})
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <img 
              src="/logo.svg" 
              alt={APP_NAME}
              className="h-10 w-auto"
            />
            <span className="text-xl font-semibold text-white tracking-tight">
              {APP_NAME}
            </span>
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
    </>
  )
}
