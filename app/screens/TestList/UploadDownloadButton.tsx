import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useParams} from '@remix-run/react'
import {Upload, Download} from 'lucide-react'
import {useSearchParams} from 'react-router-dom'
import {API} from '~/routes/utilities/api'
import {Button} from '~/ui/button'
import {useState} from 'react'

export const UploadDownloadButton = ({projectName}: {projectName: string}) => {
  const projectId = useParams().projectId ? Number(useParams().projectId) : 0
  const navigate = useCustomNavigate()
  const [searchParams, _] = useSearchParams()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(
        `/${API.DownloadTests}?projectId=${projectId}&${searchParams}`,
      )
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${projectName}-tests.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={(e) => navigate(`/project/${projectId}/uploadTests`, {}, e)}
        className="shadow-sm">
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>
      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
        className="shadow-sm">
        <Download className="w-4 h-4 mr-2" />
        {isDownloading ? 'Downloading...' : 'Download'}
      </Button>
    </>
  )
}
