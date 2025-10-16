import React, {useEffect, useRef} from 'react'
import type {Row, Table as TableType} from '@tanstack/react-table'
import {flexRender} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/ui/table'
import {cn} from '~/ui/utils'
import {DataTablePagination} from '~/components/DataTable/Pagination'

export interface TableProps<T> {
  table: TableType<T>
  onPageSizeChange: (newPageSize: number) => void
  onPageChange: (newPage: number) => void
  onRowClick?: (
    row: any,
    event?: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => void
  pageSizeOptions?: number[]
  hideScrollBar?: boolean
  isConcise?: boolean
  columnStyle?: Record<string, string>
}

export function DataTable<T>({
  table,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  pageSizeOptions,
  hideScrollBar,
  isConcise,
  columnStyle,
}: TableProps<T>) {
  const rows = !!table.getRowModel().rows?.length

  const containerRef = useRef<HTMLDivElement>(null)

  const handleRowClick = (
    row: Row<T>,
    event?: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => {
    onRowClick && onRowClick(row, event)
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({top: 0, behavior: 'instant'})
    }
  }, [table.getState().pagination.pageIndex])

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Scrollable Table */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        style={
          hideScrollBar
            ? {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }
            : {}
        }>
        <Table
          className={cn(
            'table-fixed',
            'w-auto',
            'min-w-full',
          )}>
          <TableHeader
            className={cn(
              'sticky',
              'top-0',
              'left-0',
              'z-20',
              'h-12',
              'overflow-hidden',
              'bg-slate-50',
              'border-b',
              'border-slate-200',
            )}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-0 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-700 font-semibold text-sm px-4 py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {rows ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-200 last:border-b',
                  )}
                  onClick={(event) => handleRowClick(row, event)}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'px-4 py-4',
                          columnStyle?.[cell.column.id] ?? '',
                        )}
                        isConcise={isConcise}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
            <TableRow>
              <TableCell
                colSpan={table._getColumnDefs().length}
                className="h-96 text-center border-0 text-slate-500">
                <div className="flex flex-col items-center justify-center gap-4 py-16">
                  <div className="rounded-full bg-slate-100 p-5">
                    <svg
                      className="w-12 h-12 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-slate-900">No data found</p>
                    <p className="text-sm text-slate-500">Try adjusting your filters or search criteria</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Fixed Pagination */}
      {table.getRowCount() > 0 ? (
        <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50">
          <DataTablePagination
            table={table}
            onPageSizeChange={onPageSizeChange}
            onPageChange={onPageChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      ) : null}
    </div>
  )
}
