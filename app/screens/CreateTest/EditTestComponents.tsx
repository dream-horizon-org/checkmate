import {Input} from '@ui/input'
import {Textarea} from '@ui/textarea'
import {InputLabels} from '../TestList/InputLabels'
import {OptionsDropdown} from './EditTestOptionsDropdown'
import {
  IOptionsInputComponent,
  IShortTextInputComponent,
  ITextInputComponent,
} from './interface'
import {cn} from '@ui/utils'

export const TextInputComponent = ({
  labelName,
  isMandatory = false,
  placeholder,
  id,
  value,
  onChange,
}: ITextInputComponent) => {
  return (
    <div className="flex flex-col">
      <InputLabels labelName={labelName} isMandatory={isMandatory} />
      <Textarea
        placeholder={placeholder ?? `Enter ${labelName.toLowerCase()}...`}
        id={id}
        value={value}
        onChange={onChange}
        className="mt-2.5 min-h-[120px] resize-y"
      />
    </div>
  )
}

export const ShortTextInputComponent = ({
  labelName,
  isMandatory = false,
  placeholder,
  id,
  value,
  onChange,
}: IShortTextInputComponent) => {
  return (
    <div className="flex gap-1 items-center">
      <InputLabels labelName={labelName} isMandatory={isMandatory} className="min-w-[120px] whitespace-nowrap" />
      <Input
        id={id}
        placeholder={placeholder ?? `Enter ${labelName.toLowerCase()}...`}
        value={value}
        onChange={onChange}
        className="flex-1"
      />
    </div>
  )
}

export const OptionsInputComponent = ({
  labelName,
  placeholder,
  list,
  isMandatory = false,
  handleCheckboxChange,
  createNewPropertyClicked,
  createNewToolTipString,
  addingNewValue,
  labelClassName,
  selectedItemId,
  listClassName,
}: IOptionsInputComponent) => (
  <div className="flex flex-col">
    <div className="flex gap-1 items-center">
      <InputLabels
        labelName={labelName}
        isMandatory={isMandatory}
        className={cn('whitespace-nowrap min-w-[140px]', labelClassName)}
      />
      <div className="w-40">
        <OptionsDropdown
          selectedItemId={selectedItemId}
          filterName={labelName}
          list={list}
          handleCheckboxChange={handleCheckboxChange}
          placeholder={placeholder}
          createNewPropertyClicked={createNewPropertyClicked}
          createNewToolTipString={createNewToolTipString}
          listClassName={listClassName}
        />
      </div>
    </div>
    {addingNewValue && (
      <p className="text-xs text-green-600 font-medium mt-2 ml-[132px]">
        Creating new {labelName.toLowerCase()}: {addingNewValue}
      </p>
    )}
  </div>
)
