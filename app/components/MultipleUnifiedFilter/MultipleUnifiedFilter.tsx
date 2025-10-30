import {CustomDialog} from '@components/Dialog/Dialog'
import {PopoverClose} from '@radix-ui/react-popover'
import {DialogClose, DialogTitle} from '@ui/dialog'
import {RotateCcw} from 'lucide-react'
import {useEffect, useState} from 'react'
import {
  AND_SELECTION,
  MULTIPLE_SELECTED,
  NONE_SELECTED,
  OR_SELECTION,
} from '~/constants'
import {FilterNames} from '~/screens/TestList/testTable.interface'
import {Button} from '~/ui/button'
import {Label} from '~/ui/label'
import {Popover, PopoverContent, PopoverTrigger} from '~/ui/popover'
import {RadioGroup, RadioGroupItem} from '~/ui/radio-group'
import {cn} from '~/ui/utils'
import {FilterDropdown} from './FilterDropdown'

interface FilterOption {
  id?: number
  optionName: string
  checked: boolean
}

type FilterOptons = FilterOption[]

export interface TestListFilter {
  filterName: FilterNames
  filterOptions: FilterOptons
}

export interface MultipleUnifiedFilterProps {
  filters: TestListFilter[]
  onFilterApply: (updatedFilters: TestListFilter[], filterType?: string) => void
  filterType?: 'and' | 'or'
  variant?: 'popover' | 'dialog'
}

export const MultipleUnifiedFilter = ({
  filters,
  onFilterApply,
  filterType = 'and',
  variant = 'popover',
}: MultipleUnifiedFilterProps) => {
  const [selectedFilters, setSelectedFilters] =
    useState<TestListFilter[]>(filters)

  const [selectedType, setSelectedType] = useState<string>(filterType)

  useEffect(() => {
    setSelectedFilters(filters)
  }, [filters])

  const handleCheckboxChange = ({
    filterName,
    optionName,
    optionId,
  }: {
    filterName: FilterNames
    optionName: string
    optionId?: number
  }) => {
    const updatedFilters = selectedFilters.map((filter) => {
      if (filter.filterName === filterName) {
        return {
          ...filter,
          filterOptions: filter.filterOptions.map((option) => {
            if (option.optionName === optionName) {
              return {
                ...option,
                checked: !option.checked,
              }
            }
            return option
          }),
        }
      }
      return filter
    })
    setSelectedFilters(updatedFilters)
  }

  const resetFilter = (filterName: FilterNames) => {
    const updatedFilters = selectedFilters.map((filter) => {
      if (filter.filterName === filterName) {
        return {
          ...filter,
          filterOptions: filter.filterOptions.map((option) => {
            return {
              ...option,
              checked: false,
            }
          }),
        }
      }
      return filter
    })
    setSelectedFilters(updatedFilters)
  }

  const applyFilterClick = () => {
    onFilterApply(selectedFilters, selectedType)
  }

  const ContentCompenent = () => {
    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          {selectedFilters.map((filter, index) => {
            return (
              <div key={index} className="flex items-center gap-1">
                <FilterDropdown
                  key={filter.filterName}
                  filter={filter}
                  handleCheckboxChange={handleCheckboxChange}
                />
                {!!filter.filterOptions.some((option) => option.checked) ? (
                  <button
                    onClick={() => resetFilter(filter.filterName)}
                    className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                    <RotateCcw
                      className="text-slate-500 hover:text-slate-700"
                      size={14}
                      strokeWidth={2}
                    />
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="mt-5 pt-5 border-t border-slate-200">
          <h4 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Match Criteria</h4>
          <RadioGroup
            defaultValue={filterType}
            onValueChange={(value) => {
              setSelectedType(value)
            }}>
            <div className="flex items-center space-x-2 py-1.5">
              <RadioGroupItem value="and" id="and" />
              <Label className="text-sm text-slate-600 font-normal cursor-pointer" htmlFor="and">
                {AND_SELECTION}
              </Label>
            </div>
            <div className="flex items-center space-x-2 py-1.5">
              <RadioGroupItem value="or" id="or" />
              <Label className="text-sm text-slate-600 font-normal cursor-pointer" htmlFor="or">
                {OR_SELECTION}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </>
    )
  }

  return variant === 'popover' ? (
    <Popover>
      <PopoverTrigger asChild>
        <div className="px-4 text-sm font-medium">Filter</div>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] border-slate-200 shadow-lg p-5">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Filter Options</h3>
          <ContentCompenent />
          <PopoverClose className="flex w-full mt-5">
            <Button
              className="flex bg-slate-900 hover:bg-slate-800 w-full"
              onClick={applyFilterClick}>
              Apply Filters
            </Button>
          </PopoverClose>
          <div className="text-xs flex flex-col mt-4 pt-4 border-t border-slate-200 text-slate-500 gap-1.5">
            <p className="leading-relaxed">{NONE_SELECTED}</p>
            <p className="leading-relaxed">{MULTIPLE_SELECTED}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <CustomDialog
      anchorComponent={<Button className="px-4">Apply Filter</Button>}
      headerComponent={
        <DialogTitle className="mb-4 text-slate-900 text-base font-semibold">Filter Options</DialogTitle>
      }
      contentComponent={<ContentCompenent />}
      footerComponent={
        <div className="flex flex-col w-full">
          <DialogClose className="mt-5">
            <Button
              className="flex bg-slate-900 hover:bg-slate-800 w-full"
              onClick={applyFilterClick}>
              Apply Filters
            </Button>
          </DialogClose>
          <div className="text-xs flex flex-col mt-4 pt-4 border-t border-slate-200 text-slate-500 gap-1.5">
            <p className="leading-relaxed">{NONE_SELECTED}</p>
            <p className="leading-relaxed">{MULTIPLE_SELECTED}</p>
          </div>
        </div>
      }
    />
  )
}
