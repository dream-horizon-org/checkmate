import {API} from '~/routes/utilities/api'
import {TrashIcon} from '@components/Button/TrashIcon'
import {CustomDialog} from '@components/Dialog/Dialog'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher} from '@remix-run/react'
import {ColumnDef} from '@tanstack/react-table'
import {Button} from '@ui/button'
import {toast, useToast} from '@ui/use-toast'
import {Pencil} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import {DialogClose, DialogDescription, DialogTitle} from '~/ui/dialog'
import {Input} from '~/ui/input'
import {Label} from '~/ui/label'
import {cn} from '~/ui/utils'
import {getDateDetail} from '~/utils/getDate'
import {HeaderComponent} from '../TestList/TestListRowColumns'
import {LARGE_PAGE_SIZE, SMALL_PAGE_SIZE} from '@route/utils/constants'

export interface IProjectItem {
  projectId: number
  projectName: string
  projectDescription: string
  createdByName: string
  createdOn: Date
  Tests: string
  Runs: string
}

export const centered = (title: string) => {
  return () => {
    return (
      <div
        className={cn(
          'text-center',
          'm-0',
          'text-sm font-extrabold',
          'text-black',
        )}>
        {title}
      </div>
    )
  }
}
export const PROJECT_LIST_COLUMN_CONFIG: ColumnDef<IProjectItem>[] = [
  {
    header: () => (
      <HeaderComponent position={'left'} heading="ID" className="pl-2" />
    ),
    cell: ({row}) => {
      return (
        <div className="text-left font-semibold text-gray-700">
          #{row.original.projectId}
        </div>
      )
    },
    accessorKey: 'id',
    size: 80,
  },
  {
    header: () => (
      <div className="text-left text-sm font-extrabold text-black">
        Project Name
      </div>
    ),
    cell: ({row}) => {
      const content = row?.original?.projectDescription
        ? row?.original?.projectDescription
        : 'No Description'

      const navigate = useCustomNavigate()
      return (
        <div className="flex flex-col gap-1">
          <Tooltip
            anchor={
              <div
                onClick={(e) => {
                  navigate(
                    `/project/${row.original.projectId}/tests?page=1&pageSize=${LARGE_PAGE_SIZE}`,
                    {},
                    e,
                  )
                }}
                className="font-semibold text-slate-900 hover:text-slate-700 cursor-pointer hover:underline transition-colors">
                {row.original.projectName}
              </div>
            }
            content={<div className="text-center max-w-xs">{content}</div>}
          />
          {row.original.projectDescription && (
            <span className="text-xs text-gray-500 line-clamp-1">
              {row.original.projectDescription}
            </span>
          )}
        </div>
      )
    },
    accessorKey: 'name',
    size: 300,
  },
  {
    header: () => (
      <div className="text-left text-sm font-extrabold text-black">
        Created By
      </div>
    ),
    cell: ({row}) => {
      const createdOn = getDateDetail(new Date(row.original.createdOn))
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-gray-800">
            {row.original.createdByName}
          </span>
          <span className="text-xs text-gray-500">{createdOn}</span>
        </div>
      )
    },
    accessorKey: 'createdBy',
    size: 200,
  },
  {
    header: centered('Tests'),
    cell: ({row}) => {
      const navigate = useCustomNavigate()
      return (
        <Button
          onClick={(e) => {
            navigate(
              `/project/${row.original.projectId}/tests?page=1&pageSize=250`,
              {},
              e,
            )
          }}
          size="sm"
          className="w-full max-w-[100px] mx-auto"
          variant="outline">
          View Tests
        </Button>
      )
    },
    accessorKey: 'Tests',
    size: 120,
  },
  {
    header: centered('Runs'),
    cell: ({row}) => {
      const navigate = useCustomNavigate()
      return (
        <Button
          onClick={(event) => {
            navigate(
              `/project/${row.original.projectId}/runs?page=1&pageSize=${SMALL_PAGE_SIZE}&status=Active`,
              {},
              event,
            )
          }}
          size="sm"
          className="w-full max-w-[100px] mx-auto"
          variant="outline">
          View Runs
        </Button>
      )
    },
    accessorKey: 'Runs',
    size: 120,
  },
  {
    id: 'edit',
    header: () => <div className="text-center text-sm font-extrabold">Actions</div>,
    cell: ({row}) => {
      const {toast} = useToast()
      const [projectData, setProjectData] = useState({
        name: '',
        description: '',
      })

      const handleEditClick = () => {
        const projectData = row.original
        setProjectData({
          name: projectData.projectName,
          description: projectData.projectDescription,
        })
      }

      const saveChanges = useFetcher<any>()

      useEffect(() => {
        if (saveChanges.data?.data) {
          const message = saveChanges.data?.data?.message
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

      const handleSaveChanges = async () => {
        const projectId = row.original.projectId
        const postData = {
          projectName: projectData.name,
          projectDescription: projectData.description,
          projectId,
        }
        saveChanges.submit(postData, {
          method: 'PUT',
          action: `/${API.EditProject}`,
          encType: 'application/json',
        })
      }

      const handleChange = (e: {target: {id: string; value: string}}) => {
        const {id, value} = e.target
        setProjectData((prevData) => ({...prevData, [id]: value}))
      }

      const updateProjectStatus = useFetcher<any>()

      useEffect(() => {
        if (updateProjectStatus.data?.data) {
          const message = updateProjectStatus.data?.data?.message
          toast({
            title: 'Success',
            description: message,
            variant: 'success',
          })
        } else if (updateProjectStatus.data?.error) {
          const message = updateProjectStatus.data?.error
          toast({
            title: 'Failed',
            description: message,
            variant: 'destructive',
          })
        }
      }, [updateProjectStatus.data])

      const handleConfirmDelete = async () => {
        const projectId = row.original.projectId
        const status = 'Archived'

        updateProjectStatus.submit(
          {projectId, status},
          {
            method: 'put',
            action: `/${API.EditProjectStatus}`,
            encType: 'application/json',
          },
        )
      }

      return (
        <div className="flex items-center justify-center gap-2">
          <CustomDialog
            variant={'edit'}
            anchorComponent={
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleEditClick}>
                <Pencil className="h-4 w-4" />
              </Button>
            }
            headerComponent={
              <>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogDescription>
                  Make changes to your project here. Click save when you're done.
                </DialogDescription>
              </>
            }
            contentComponent={
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Project
                  </Label>
                  <Input
                    id="name"
                    value={projectData.name}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={projectData.description}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
              </div>
            }
            footerComponent={
              <DialogClose asChild>
                <Button type="submit" onClick={handleSaveChanges}>
                  Save changes
                </Button>
              </DialogClose>
            }
          />
          <CustomDialog
            variant={'delete'}
            anchorComponent={
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700">
                <TrashIcon size={16} />
              </Button>
            }
            headerComponent={
              <>
                <DialogTitle>Archive Project?</DialogTitle>
                <DialogDescription>
                  This will archive the project "{row.original.projectName}". It will no longer be
                  visible in the projects list.
                </DialogDescription>
              </>
            }
            footerComponent={
              <DialogClose asChild>
                <Button
                  type="submit"
                  variant={'destructive'}
                  onClick={handleConfirmDelete}>
                  Yes, Archive
                </Button>
              </DialogClose>
            }
          />
        </div>
      )
    },
    size: 100,
  },
]
