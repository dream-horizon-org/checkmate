import {CustomDialog} from '@components/Dialog/Dialog'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotFilledIcon,
  HeightIcon,
} from '@radix-ui/react-icons'
import {useFetcher} from '@remix-run/react'
import {ColumnDef} from '@tanstack/react-table'
import {DialogClose} from '@ui/dialog'
import {toast} from '@ui/use-toast'
import {LockIcon, OctagonXIcon, Trash2} from 'lucide-react'
import {useEffect} from 'react'
import {Tooltip} from '~/components/Tooltip/Tooltip'
import {API} from '~/routes/utilities/api'
import {Button} from '~/ui/button'
import {getFormatedDate} from '~/utils/getDate'
import {IRunListTable} from './runTable.interface'

const AnimatedPulse = () => {
  return (
    <div className={'relative flex'}>
      <DotFilledIcon
        strokeWidth={5}
        stroke={'#27a805'}
        className={'absolute animate-ping'}
      />
      <DotFilledIcon
        className={'relative'}
        stroke={'#27a805'}
        strokeWidth={5}
      />
    </div>
  )
}

const RUN_STATUS_ICON: any = {
  Active: <AnimatedPulse />,
  Locked: <LockIcon stroke={'grey'} height={16} width={16} />,
  Deleted: <OctagonXIcon stroke={'red'} height={16} width={16} />,
}

export const RunListColumnConfig: ColumnDef<IRunListTable>[] = [
  {
    accessorKey: 'status',
    header: () => <div className="text-center">Status</div>,
    cell: ({row}) => {
      return (
        <div className="flex items-center justify-center">
          <Tooltip
            anchor={RUN_STATUS_ICON[row.original.status]}
            content={row.original.status}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'runId',
    header: () => <div className="text-left">Run ID</div>,
    cell: ({row}) => {
      return <div className="text-left text-slate-600 text-sm">{row.original.runId}</div>
    },
  },
  {
    accessorKey: 'runName',
    header: () => <div className="text-left">Name</div>,
    cell: ({row}) => {
      return (
        <div className="text-left text-sm text-slate-700 font-medium cursor-pointer hover:text-slate-900">
          {row.original.runName}
        </div>
      )
    },
  },
  {
    accessorKey: 'info',
    header: ({table, column}) => {
      return (
        <div className="text-left">
          <Button
            className="h-auto p-0 hover:bg-transparent justify-start"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {table?.getRowModel()?.rows[0]?.original?.status === 'Locked'
              ? 'Locked By'
              : 'Created By'}
            {column.getIsSorted() === false ? (
              <HeightIcon className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowDownIcon className="ml-1.5 h-3.5 w-3.5 text-slate-600" />
            ) : (
              <ArrowUpIcon className="ml-1.5 h-3.5 w-3.5 text-slate-600" />
            )}
          </Button>
        </div>
      )
    },
    cell: ({row}) => {
      const createdBy =
        row.original.status === 'Locked' && row.original.lockedBy
          ? row.original.lockedBy
          : row.original.createdByUserName
      const createdOn =
        row.original.status === 'Locked' && row.original.lockedOn
          ? getFormatedDate(new Date(row.original.lockedOn))
          : getFormatedDate(new Date(row.original.createdOn))

      return (
        <div className="text-left">
          <div className="text-sm text-slate-700">{createdBy}</div>
          <div className="text-xs text-slate-500">{createdOn}</div>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      return (
        new Date(rowA.original.createdOn).getTime() -
        new Date(rowB.original.createdOn).getTime()
      )
    },
  },
  {
    accessorKey: 'runId',
    header: () => <div className="text-center">Actions</div>,
    cell: ({row}) => {
      const fetcher = useFetcher<{data: {success: boolean}; error: string}>()
      const onSubmit = () => {
        fetcher.submit(
          {runId: row.original.runId, projectId: row.original.projectId},
          {
            method: 'POST',
            action: `/${API.DeleteRun}`,
            encType: 'application/json',
          },
        )
      }

      useEffect(() => {
        if (fetcher.data?.data?.success) {
          toast({
            variant: 'success',
            description: 'Run deleted successfully',
          })
        } else if (fetcher.data?.error) {
          toast({
            variant: 'destructive',
            description: fetcher.data?.error,
          })
        }
      }, [fetcher.data])

      return (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
          <CustomDialog
            variant="delete"
            anchorComponent={
              <button className="h-8 w-8 inline-flex items-center justify-center hover:bg-slate-100 rounded-md transition-colors">
                <Trash2 size={16} className="text-red-600" />
              </button>
            }
            contentComponent={
              <>
                <div className="text-lg font-semibold text-slate-900">
                  Are you sure you want to delete{' '}
                  <span className="text-red-600 font-semibold">
                    {row.original.runName}
                  </span>
                  ?
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  This action cannot be undone. It will permanently delete this
                  run and all its associated data.
                </div>
              </>
            }
            footerComponent={
              <>
                <DialogClose>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    className="bg-red-600 hover:bg-red-700 font-semibold"
                    onClick={onSubmit}>
                    Delete
                  </Button>
                </DialogClose>
              </>
            }
          />
        </div>
      )
    },
  },
]
