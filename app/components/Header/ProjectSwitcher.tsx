import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useParams, useFetcher} from '@remix-run/react'
import {FolderKanban, Check, ChevronsUpDown} from 'lucide-react'
import {Button} from '~/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '~/ui/popover'
import {cn} from '~/ui/utils'
import {useState, useEffect} from 'react'
import {API} from '~/routes/utilities/api'
import {ORG_ID, LARGE_PAGE_SIZE} from '@route/utils/constants'

export const ProjectSwitcher = () => {
  const [open, setOpen] = useState(false)
  const {projectId} = useParams()
  const navigate = useCustomNavigate()
  const projectsFetcher = useFetcher<any>()

  useEffect(() => {
    // Fetch projects list only if in a project context and not already loading
    if (projectId && projectsFetcher.state === 'idle' && !projectsFetcher.data) {
      projectsFetcher.load(`/${API.GetProjects}?orgId=${ORG_ID}&page=1&pageSize=100`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const projects = projectsFetcher.data?.data?.projectsList || []
  const currentProject = projects.find(
    (p: any) => String(p.projectId) === String(projectId),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-9 text-white hover:bg-slate-800 justify-between min-w-[200px]">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span className="truncate">
              {currentProject?.projectName || 'Select Project'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {projects.map((project: any) => (
                <CommandItem
                  key={project.projectId}
                  value={project.projectName}
                  onSelect={() => {
                    navigate(
                      `/project/${project.projectId}/tests?page=1&pageSize=${LARGE_PAGE_SIZE}`,
                      {},
                    )
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      String(projectId) === String(project.projectId)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{project.projectName}</span>
                    {project.projectDescription && (
                      <span className="text-xs text-muted-foreground truncate">
                        {project.projectDescription}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

