import {Label} from '@ui/label'
import {cn} from '@ui/utils'

interface IInputLabels {
  labelName: string
  isMandatory?: boolean
  className?: string
}

export const InputLabels = ({
  labelName,
  isMandatory = false,
  className,
}: IInputLabels) => {
  return (
    <Label className={cn('text-sm font-semibold text-slate-700', className)}>
      {labelName}
      {isMandatory && <sup className="text-red-600 ml-0.5">*</sup>}
    </Label>
  )
}
