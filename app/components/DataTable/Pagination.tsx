import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import {Table} from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/ui/select'
import {Button} from '~/ui/button'

interface DataTablePaginationProps<T> {
  table: Table<T>
  onPageSizeChange: (newPageSize: number) => void
  onPageChange: (newPage: number) => void
  pageSizeOptions?: number[]
}

export const DataTablePagination = <T,>({
  table,
  onPageSizeChange,
  onPageChange,
  pageSizeOptions = [10, 30, 50],
}: DataTablePaginationProps<T>) => {
  const {pageSize, pageIndex} = table.getState().pagination

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="text-sm text-gray-700">
        Showing <span className="font-semibold">{pageIndex * pageSize + 1}</span> - <span className="font-semibold">{Math.min((pageIndex + 1) * pageSize, table.getRowCount())}</span> of <span className="font-semibold">{table.getRowCount()}</span> rows.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value))
              table.setPageSize(Number(value))
              table.setPageIndex(0)
            }}>
            <SelectTrigger className="h-8 w-[70px] bg-white border-gray-300">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm text-gray-700">
          Page <span className="mx-1 font-semibold">{pageIndex + 1}</span> of <span className="ml-1 font-semibold">{table.getPageCount()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex bg-white hover:bg-gray-100 border-gray-300"
            onClick={() => {
              table.setPageIndex(0)
              onPageChange(1)
            }}
            disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border-gray-300"
            onClick={() => {
              onPageChange(table.getState().pagination.pageIndex)
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border-gray-300"
            onClick={() => {
              onPageChange(table.getState().pagination.pageIndex + 2)
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}>
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex bg-white hover:bg-gray-100 border-gray-300"
            onClick={() => {
              onPageChange(table.getPageCount())
              table.setPageIndex(table.getPageCount() - 1)
            }}
            disabled={!table.getCanNextPage()}>
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
