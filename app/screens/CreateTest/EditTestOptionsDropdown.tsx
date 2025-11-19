import {IDropdownMenuCheckboxes} from '@components/TestsFilter/DropdownMenuCheckboxes'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {CaretSortIcon} from '@radix-ui/react-icons'
import {Input} from '@ui/input'
import {useEffect, useRef, useState} from 'react'
import {Button} from '~/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu'
import {cn} from '~/ui/utils'
import {IOptionsDropdown} from './interface'
import {dropDownItemChecked} from './utils'

export const OptionsDropdown = ({
  filterName,
  list,
  handleCheckboxChange,
  placeholder,
  createNewPropertyClicked,
  createNewToolTipString,
  selectedItemId,
  listClassName,
}: IOptionsDropdown) => {
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [filteredOptions, setFilteredOptions] =
    useState<IDropdownMenuCheckboxes[]>(list)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setFilteredOptions(
      list.filter((option) =>
        option.name.toLowerCase().includes(searchFilter.toLowerCase()),
      ),
    )
  }, [searchFilter, list])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [filteredOptions])

  useEffect(() => {
    if (isDropdownOpen) {
      const firstCheckedIndex = filteredOptions.findIndex((item) =>
        placeholder.split(', ').includes(item.name),
      )

      if (firstCheckedIndex !== -1 && itemRefs.current[firstCheckedIndex]) {
        itemRefs.current[firstCheckedIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }
  }, [isDropdownOpen, filteredOptions, placeholder])

  return (
    <DropdownMenu onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full justify-between h-10"
          variant="outline">
          <span className="truncate text-left">
            {placeholder.includes('>')
              ? placeholder.split('>').pop()
              : placeholder}
          </span>
          <CaretSortIcon className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px]">
        <div className="p-2 border-b border-slate-200 bg-white sticky top-0 z-10">
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            key={'SelectFilter'}
            className="h-9"
          />
        </div>
        {searchFilter && createNewPropertyClicked && (
          <Tooltip
            anchor={
              <DropdownMenuCheckboxItem
                onClick={() => {
                  createNewPropertyClicked(searchFilter)
                }}
                className="border-2 border-green-200 flex items-start cursor-pointer hover:bg-green-50">
                <div>
                  <span className="font-medium text-green-700">{searchFilter}</span>
                </div>
              </DropdownMenuCheckboxItem>
            }
            content={
              createNewToolTipString
                ? createNewToolTipString
                : `Select to create new ${filterName}`
            }
          />
        )}
        <div
          className={cn(
            'max-h-[300px] overflow-y-auto',
            listClassName,
          )}>
          {filteredOptions.map((item, index) => (
            <DropdownMenuCheckboxItem
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              key={item.id}
              checked={dropDownItemChecked({
                filterName,
                placeholder,
                item,
                selectedItemId,
              })}
              onClick={(e) => {
                handleCheckboxChange({
                  filterName,
                  id: item.id,
                  value: item.name,
                  property: item.property,
                })
                e.preventDefault()
              }}
              id={item.id.toString()}
              className="cursor-pointer">
              {item.name || 'None'}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
