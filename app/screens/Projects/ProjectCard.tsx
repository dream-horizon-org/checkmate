import {API} from '~/routes/utilities/api'
import {TrashIcon} from '@components/Button/TrashIcon'
import {CustomDialog} from '@components/Dialog/Dialog'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher} from '@remix-run/react'
import {Button} from '@ui/button'
import {useToast} from '@ui/use-toast'
import {Pencil, FileText, PlayCircle, Calendar, User} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import {DialogClose, DialogDescription, DialogTitle} from '~/ui/dialog'
import {Input} from '~/ui/input'
import {Label} from '~/ui/label'
import {getDateDetail} from '~/utils/getDate'
import {IProjectItem} from './ProjectListColumnConfig'
import {LARGE_PAGE_SIZE, SMALL_PAGE_SIZE} from '@route/utils/constants'

type ProjectCardProps = {
  project: IProjectItem
}

export const ProjectCard = ({project}: ProjectCardProps) => {
  const navigate = useCustomNavigate()
  const {toast} = useToast()
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
  })

  const handleEditClick = () => {
    setProjectData({
      name: project.projectName,
      description: project.projectDescription,
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
    const postData = {
      projectName: projectData.name,
      projectDescription: projectData.description,
      projectId: project.projectId,
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
    const status = 'Archived'

    updateProjectStatus.submit(
      {projectId: project.projectId, status},
      {
        method: 'put',
        action: `/${API.EditProjectStatus}`,
        encType: 'application/json',
      },
    )
  }

  const createdOn = getDateDetail(new Date(project.createdOn))

  // Generate a consistent color based on project name
  const generateColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const projectInitial = project.projectName.charAt(0).toUpperCase()
  const iconColor = generateColor(project.projectName)

  return (
    <div className="group bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full">
      {/* Header Section */}
      <div className="flex items-start gap-3 mb-4">
        {/* Dynamic Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-md ${iconColor} flex items-center justify-center text-white font-semibold text-lg`}>
          {projectInitial}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3
            onClick={(e) => {
              navigate(
                `/project/${project.projectId}/tests?page=1&pageSize=${LARGE_PAGE_SIZE}`,
                {},
                e,
              )
            }}
            className="text-lg font-semibold text-slate-900 hover:text-slate-700 cursor-pointer mb-1 line-clamp-1">
            {project.projectName}
          </h3>
          {project.projectDescription && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {project.projectDescription}
            </p>
          )}
        </div>

        {/* Action Icons - Top Right */}
        <div className="flex items-center gap-1">
          <CustomDialog
            variant={'edit'}
            anchorComponent={
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50">
                <TrashIcon size={16} />
              </Button>
            }
            headerComponent={
              <>
                <DialogTitle>Archive Project?</DialogTitle>
                <DialogDescription>
                  This will archive the project "{project.projectName}". It will no longer be
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
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          <span>{project.createdByName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{createdOn}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex items-center gap-2">
        <Button
          onClick={(e) => {
            navigate(
              `/project/${project.projectId}/tests?page=1&pageSize=250`,
              {},
              e,
            )
          }}
          variant="outline"
          className="flex-1 h-9 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 text-sm font-medium">
          <FileText className="w-3.5 h-3.5 mr-1.5" />
          Tests
        </Button>
        <Button
          onClick={(event) => {
            navigate(
              `/project/${project.projectId}/runs?page=1&pageSize=${SMALL_PAGE_SIZE}&status=Active`,
              {},
              event,
            )
          }}
          variant="outline"
          className="flex-1 h-9 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 text-sm font-medium">
          <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
          Runs
        </Button>
      </div>
    </div>
  )
}

