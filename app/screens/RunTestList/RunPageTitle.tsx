import {RunDetails} from '@api/runData'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {LockKeyhole, LockKeyholeOpen} from 'lucide-react'

interface IRunPageTitle {
  runData: null | RunDetails
}
export const RunPageTitle = ({runData}: IRunPageTitle) => {
  return (
    <div className="flex items-center gap-3">
      <h1 className="text-2xl font-bold text-slate-900">
        {runData?.runName}
      </h1>

      {runData?.status === 'Active' ? (
        <Tooltip
          anchor={
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 border border-green-200">
              <LockKeyholeOpen size={16} className="text-green-600" />
              <span className="text-xs font-medium text-green-700">Active</span>
            </div>
          }
          content="Run is active and accepting results"
        />
      ) : (
        <Tooltip
          anchor={
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-200">
              <LockKeyhole size={16} className="text-red-600" />
              <span className="text-xs font-medium text-red-700">Locked</span>
            </div>
          }
          content="Run is locked and not accepting results"
        />
      )}
    </div>
  )
}
