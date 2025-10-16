import {Button} from '@ui/button'
import {Download, LoaderCircle} from 'lucide-react'
import {throttle} from '../TestList/utils'
import {useState} from 'react'
import {downloadReport} from './utils'

interface IDownLoadTests {
  tooltipText: string
  style?: {
    size: number
    strokeWidth: number
  }
  fetchUrl: string
  fileName?: string
  className?: string
}

export const DownLoadTests = ({
  style,
  tooltipText,
  fetchUrl,
  fileName,
  className,
}: IDownLoadTests) => {
  const [downloading, setDownloading] = useState<boolean>(false)

  const debouncedDownloadTestsExecution = throttle(
    () => downloadReport({fetchUrl, fileName, setDownloading}),
    5000,
  )

  return (
    <Button
      variant="outline"
      size="default"
      onClick={debouncedDownloadTestsExecution}
      disabled={downloading}
      className="shadow-sm">
      {downloading ? (
        <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {tooltipText}
    </Button>
  )
}
