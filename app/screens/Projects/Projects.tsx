import {useFetcher, useSearchParams} from '@remix-run/react'
import {useEffect, useRef, useCallback, useState} from 'react'
import {IProjectItem} from '~/screens/Projects/ProjectListColumnConfig'
import {ProjectCard} from './ProjectCard'

type ProjectTableProps = {
  projects: {
    projectCount: {count: number}[]
    projectsList: IProjectItem[]
  }
}

export const ProjectsTable = (props: ProjectTableProps) => {
  const [searchParams] = useSearchParams()
  const initialProjects = props?.projects?.projectsList ?? []
  const projectsCount = props?.projects?.projectCount?.[0].count
  const [allProjects, setAllProjects] = useState<IProjectItem[]>(initialProjects)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const hasMore = allProjects.length < projectsCount
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const fetcher = useFetcher<typeof props.projects>()

  // Reset projects when initial data changes (e.g., search query)
  useEffect(() => {
    setAllProjects(initialProjects)
    setCurrentPage(1)
  }, [initialProjects.length, searchParams.get('textSearch')])

  // Append newly fetched projects
  useEffect(() => {
    if (fetcher.data?.projectsList) {
      setAllProjects((prev) => {
        const newProjects = fetcher.data?.projectsList ?? []
        // Avoid duplicates by filtering out projects that already exist
        const existingIds = new Set(prev.map(p => p.projectId))
        const uniqueNewProjects = newProjects.filter(p => !existingIds.has(p.projectId))
        return [...prev, ...uniqueNewProjects]
      })
      loadingRef.current = false
    }
  }, [fetcher.data])

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current || fetcher.state !== 'idle') return
    
    loadingRef.current = true
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    
    // Build URL with current search params plus next page
    const params = new URLSearchParams(searchParams)
    params.set('page', nextPage.toString())
    params.set('pageSize', pageSize.toString())
    
    fetcher.load(`?${params.toString()}`)
  }, [hasMore, currentPage, pageSize, searchParams, fetcher])

  useEffect(() => {
    const container = scrollContainerRef.current?.parentElement
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      
      // Load more when user is 200px from bottom
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMore()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  return (
    <div ref={scrollContainerRef} className="flex flex-col h-full">
      {/* Projects Grid */}
      {allProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allProjects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
          
          {/* Loading indicator */}
          {(hasMore || fetcher.state === 'loading') && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg
                  className="animate-spin h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading more projects...</span>
              </div>
            </div>
          )}
          
          {/* End of list indicator */}
          {!hasMore && allProjects.length > 10 && fetcher.state === 'idle' && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-slate-500">
                You've reached the end of the list
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-slate-200">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-1">No projects found</p>
          <p className="text-sm text-slate-500">Try adjusting your search or create a new project</p>
        </div>
      )}
    </div>
  )
}
