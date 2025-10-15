'use client'
import {PlusCircledIcon} from '@radix-ui/react-icons'
import {
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useSearchParams,
} from '@remix-run/react'
import {Skeleton} from '@ui/skeleton'
import {useToast} from '@ui/use-toast'
import {memo, useEffect, useState} from 'react'
import {SearchBar} from '~/components/SearchBar/SearchBar'
import {API} from '~/routes/utilities/api'
import {checkForValidId} from '~/routes/utilities/utils'
import {ProjectsTable} from '~/screens/Projects/Projects'
import {cn} from '~/ui/utils'
import {loader as projectApiLoader} from './api/v1/projects'

export const loader = projectApiLoader

export function Projects() {
  const resp: any = useLoaderData()
  const [data, setData] = useState<any>([])

  useEffect(() => {
    if (resp && resp?.data && data !== resp.data) setData(resp.data)
  }, [resp.data])

  const [searchParams, setSearchParams] = useSearchParams()
  const {toast} = useToast()

  const orgId = Number(searchParams?.get('orgId'))
    ? Number(searchParams?.get('orgId'))
    : 1

  const location = useLocation()
  const {state} = location
  const orgNameFetcher = useFetcher<any>()
  const [orgName, setorgName] = useState<string | null>(null)

  useEffect(() => {
    if (state && state?.projectCreated) {
      const data = state.projectCreated
      const message = `Project ${data.projectName} with Id:${data.projectId},  created successfully`
      toast({
        title: 'Project Added',
        description: message,
      })
    }
  }, [state])

  useEffect(() => {
    orgNameFetcher.load(`/${API.GetOrgDetails}?orgId=${orgId}`)
  }, [])

  useEffect(() => {
    if (orgNameFetcher?.data?.data?.orgName) {
      setorgName(orgNameFetcher?.data?.data?.orgName)
    }
  }, [orgNameFetcher.data])

  if (!checkForValidId(orgId)) {
    toast({
      variant: 'destructive',
      description: 'orgId not provided in search param',
    })
  }

  const onChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value === '') {
          prev.delete('textSearch')
          prev.set('page', (1).toString())
          return prev
        }
        prev.set('textSearch', value)
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )
  }

  return (
    <div className="flex flex-col h-full gap-6 py-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          {orgName ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-600">
                Manage projects for <span className="font-semibold">{orgName}</span>
              </p>
            </>
          ) : (
            <Skeleton className="w-64 h-10" />
          )}
        </div>
        <Link
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md transition-colors border border-slate-700"
          to={`/org/${orgId}/createProject`}>
          <PlusCircledIcon className="size-5" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md">
        <SearchBar
          handlechange={onChange}
          placeholdertext={'Search projects...'}
          searchstring={searchParams.get('textSearch') ?? ''}
        />
      </div>

      {/* Projects Table */}
      <div className="flex-1 overflow-auto">
        <ProjectsTable projects={data} />
      </div>
    </div>
  )
}

const ProjectListing = memo(Projects)

export default ProjectListing
