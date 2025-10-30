import {Input} from '@ui/input'
import {useEffect, useRef, useState} from 'react'
import {FilterNames} from '~/screens/TestList/testTable.interface'
import {Button} from '~/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu'
import {TestListFilter} from './MultipleUnifiedFilter'

interface IFilterView {
  filter: TestListFilter
  handleCheckboxChange: (param: {
    filterName: FilterNames
    optionName: string
    optionId?: number
  }) => void
}

export const FilterDropdown = ({filter, handleCheckboxChange}: IFilterView) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const numberOfSelected = filter.filterOptions.reduce((count, item) => {
    return item.checked ? count + 1 : count
  }, 0)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<
    TestListFilter['filterOptions']
  >(filter.filterOptions)

  useEffect(() => {
    setFilteredOptions(
      filter.filterOptions.filter((option) =>
        option.optionName.toLowerCase().includes(searchFilter.toLowerCase()),
      ),
    )
  }, [searchFilter, filter])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [filteredOptions])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="w-full shadow-sm justify-between" 
          variant="outline">
          <span>{filter.filterName}</span>
          {numberOfSelected > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-900 text-white rounded-md font-medium">
              {numberOfSelected}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto border-slate-200 shadow-lg">
        <div className="p-2 border-b border-slate-200 bg-white sticky top-0 z-10">
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value)
            }}
            key={'SelectFilter'}
            className="h-8"
          />
        </div>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            return (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={option.checked}
                className="cursor-pointer"
                onClick={(e) => {
                  handleCheckboxChange({
                    filterName: filter.filterName,
                    optionName: option.optionName,
                    optionId: option.id,
                  })
                  e.preventDefault()
                }}>
                {option.optionName ? option.optionName : 'None'}
              </DropdownMenuCheckboxItem>
            )
          })
        ) : (
          <div className="px-2 py-6 text-center text-sm text-slate-500">
            No options found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
