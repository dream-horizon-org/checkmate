import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {Button} from '@ui/button'
import {cn} from '~/ui/utils'
import {LucideIcon} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/ui/tooltip'
import {useLocation} from '@remix-run/react'

interface NavItemProps {
  icon: LucideIcon
  label: string
  to: string
  isCollapsed: boolean
}

export const NavItem = ({icon: Icon, label, to, isCollapsed}: NavItemProps) => {
  const navigate = useCustomNavigate()
  const location = useLocation()
  
  // Check if current route matches this nav item
  const isActive = location.pathname.includes(to.split('?')[0])

  const button = (
    <Button
      onClick={(e) => navigate(to, {}, e)}
      variant="ghost"
      size="sm"
      className={cn(
        'w-full transition-all font-medium',
        isCollapsed
          ? 'justify-center px-0'
          : 'justify-start gap-3',
        isActive
          ? 'bg-slate-900 text-white hover:bg-slate-800'
          : 'hover:bg-slate-100 text-slate-700',
      )}>
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Button>
  )

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

