import {API} from '~/routes/utilities/api'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {zodResolver} from '@hookform/resolvers/zod'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher, useParams} from '@remix-run/react'
import {Input} from '@ui/input'
import {useToast} from '@ui/use-toast'
import {useEffect} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {z} from 'zod'
import {Button} from '~/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/ui/form'
import {Textarea} from '~/ui/textarea'
import {cn} from '~/ui/utils'
import './../styles/test.css'

const formSchema = z.object({
  projectName: z
    .string()
    .min(5, {message: 'Project name must be at least 5 characters'})
    .max(50, {message: 'Project name must be at most 50 characters'}),
  projectDescription: z.string(),
})

export default function CreateProject() {
  const createProjectFetcher = useFetcher<any>()
  const navigate = useCustomNavigate()
  const pathParams = useParams()
  const orgId = Number(pathParams.orgId)
  const {toast} = useToast()

  useEffect(() => {
    if (createProjectFetcher.data) {
      if (createProjectFetcher.data.error === null) {
        navigate(`/projects?orgId=${orgId}&page=1&pageSize=10`, {
          replace: true,
          state: {
            from: 'createProject',
            projectCreated: createProjectFetcher.data?.data,
          },
        })
      } else {
        if (createProjectFetcher?.data?.error) {
          const message = createProjectFetcher.data.error.includes('Entry')
            ? 'Project Name already exists'
            : `Error: ${createProjectFetcher.data.error}`
          toast({
            variant: 'destructive',
            title: 'Project Creation Failed',
            description: message,
          })
        }
      }
    }
  }, [createProjectFetcher.data])

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    let postData = {
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      orgId,
    }
    createProjectFetcher.submit(postData, {
      method: 'POST',
      action: `/${API.AddProjects}`,
      encType: 'application/json',
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      projectDescription: '',
    },
  })

  const isCreatingProject = createProjectFetcher.state !== 'idle'

  const handleClick = () => {
    navigate(`/projects?orgId=${orgId}&page=1&pageSize=10`, {
      replace: true,
    })
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] py-12">
      <div className="w-full max-w-xl bg-white rounded-lg border border-slate-200 shadow-sm p-8">
        {/* Header */}
        <div className="pb-6 mb-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Create Project</h1>
          <p className="text-sm text-slate-500 mt-1">
            Add a new project to your organization
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectName"
              render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel
                      htmlFor="project-name-input"
                      className="text-sm font-medium text-slate-700">
                      Project Name
                    </FormLabel>
                    <FormControl id="project-name-input">
                      <>
                        <Input
                          type="text"
                          placeholder="Enter project name"
                          {...field}
                          className="border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg"
                        />
                        <FormMessage className="text-xs text-red-600">
                          {form.formState.errors.projectName?.message}
                        </FormMessage>
                      </>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            
            <FormField
              control={form.control}
              name="projectDescription"
              render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Project Description
                    </FormLabel>
                    <FormControl>
                      <>
                        <Textarea
                          style={{resize: 'none'}}
                          placeholder="Enter project description (optional)"
                          {...field}
                          className="border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg min-h-[100px]"
                        />
                        <FormMessage className="text-xs text-red-600">
                          {form.formState.errors.projectDescription?.message}
                        </FormMessage>
                      </>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            
            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isCreatingProject}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-lg shadow-sm">
                {isCreatingProject ? 'Creating Project...' : 'Create Project'}
              </Button>
              <Button
                variant="outline"
                onClick={handleClick}
                type="button"
                className="border-slate-300 hover:bg-slate-50 text-slate-700 px-6 rounded-lg">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
