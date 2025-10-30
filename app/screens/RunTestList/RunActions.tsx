import {RunDetails} from '@api/runData'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useParams} from '@remix-run/react'
import {Table} from '@tanstack/react-table'
import {Button} from '@ui/button'
import {
  Download,
  Edit,
  Trash2,
  RotateCcw,
  Lock,
  LoaderCircle,
} from 'lucide-react'
import {useEffect, useState} from 'react'
import {LockRunDialog} from './LockRunDialog'
import {RemoveTestsDialog} from './RemoveTestsDialog'
import {ResetRunsDialog} from './ResetRunDialog'
import React from 'react'
import {toast} from '@ui/use-toast'
import {downloadReport} from './utils'
import {API} from '@route/utils/api'
import {Tests} from '@api/runTestsList'

interface IRunActions {
  table: Table<Tests>
  runData: RunDetails
}

export const RunActions = React.memo(({table, runData}: IRunActions) => {
  const [resetRunDialog, setResetRunDialog] = useState<boolean>(false)
  const [lockRunDialog, setLockRunDialog] = useState<boolean>(false)
  const [removeTestDialog, setRemoveTestDialog] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)
  const navigate = useCustomNavigate()
  const [apiResponse, setApiResponse] = useState<{
    success: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    if (apiResponse && apiResponse?.success) {
      toast({
        variant: 'success',
        description: apiResponse?.message,
      })
    } else if (apiResponse && !apiResponse?.success) {
      toast({
        variant: 'destructive',
        description: apiResponse?.message,
      })
    }
  }, [apiResponse])

  const handleEdit = () => {
    navigate(`/project/${projectId}/editRun/${runData?.runId ?? 0}`)
  }

  const handleDownload = () => {
    downloadReport({
      fetchUrl: `/${API.DownloadReport}?runId=${runData.runId}`,
      fileName: `${runData.runName}-run`,
      setDownloading,
    })
  }

  const isRemoveTestDisabled = !(
    table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected()
  )

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="default"
        onClick={handleEdit}
        className="shadow-sm">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={() => setRemoveTestDialog(true)}
        disabled={isRemoveTestDisabled}
        className="shadow-sm hover:bg-red-50 hover:border-red-300 hover:text-red-700">
        <Trash2 className="h-4 w-4 mr-2" />
        Remove Tests
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={() => setResetRunDialog(true)}
        className="shadow-sm">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={() => setLockRunDialog(true)}
        className="shadow-sm">
        <Lock className="h-4 w-4 mr-2" />
        Lock
      </Button>

      <Button
        variant="outline"
        size="default"
        onClick={handleDownload}
        disabled={downloading}
        className="shadow-sm">
        {downloading ? (
          <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Download
      </Button>

      <ResetRunsDialog
        state={resetRunDialog}
        setState={setResetRunDialog}
        runId={runData?.runId ?? 0}
        setResponse={setApiResponse}
      />
      <LockRunDialog
        state={lockRunDialog}
        setState={setLockRunDialog}
        runId={runData?.runId ?? 0}
        setResponse={setApiResponse}
      />
      <RemoveTestsDialog
        state={removeTestDialog}
        setState={setRemoveTestDialog}
        runData={runData}
        table={table}
        setResponse={setApiResponse}
      />
    </div>
  )
})
