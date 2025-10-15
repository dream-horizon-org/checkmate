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
    <div className="flex flex-col h-full w-full border border-slate-200 rounded-lg bg-white shadow-sm">
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
                  <TableHead key={header.id} className="text-slate-700 font-semibold px-6 py-3">
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
                    'hover:bg-slate-50 transition-colors cursor-default border-b border-slate-100 last:border-0',
                  )}
                  onClick={(event) => handleRowClick(row, event)}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'px-6 py-4',
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
                  className="h-40 text-center border-0 text-slate-500">
                  <div className="flex flex-col items-center gap-3 py-12">
                    <div className="rounded-full bg-slate-100 p-4">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-slate-900">No tests found</p>
                      <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
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
        <div className="flex-shrink-0 border-t border-slate-200">
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
