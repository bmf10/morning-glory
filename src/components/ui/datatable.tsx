import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  PaginationState,
} from '@tanstack/react-table'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import clsx from 'clsx'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  pageIndex: number
  pageSize: number
  pageCount: number
  totalData: number
  onPaginationChange: (pagination: PaginationState) => void
  showToggle?: boolean
}

function DataTable<TData>({
  columns,
  data,
  sorting,
  onSortingChange,
  pageIndex,
  pageSize,
  pageCount,
  totalData,
  onPaginationChange,
  showToggle = false,
}: DataTableProps<TData>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      onSortingChange(newSorting)
    },
    [onSortingChange, sorting]
  )

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 0) {
      onPaginationChange({ pageIndex: pageIndex - 1, pageSize })
    }
  }, [pageIndex, pageSize, onPaginationChange])

  const handleNextPage = useCallback(() => {
    if (pageIndex < pageCount - 1) {
      onPaginationChange({ pageIndex: pageIndex + 1, pageSize })
    }
  }, [pageIndex, pageSize, pageCount, onPaginationChange])

  const handlePageClick = useCallback(
    (idx: number) => {
      if (idx !== pageIndex) {
        onPaginationChange({ pageIndex: idx, pageSize })
      }
    },
    [onPaginationChange, pageIndex, pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, pagination },
    onSortingChange: handleSortingChange,
    manualSorting: true,
    manualPagination: true,
    pageCount,
  })

  const renderPageNumbers = () => {
    const pages: number[] = Array.from({ length: pageCount }, (_, i) => i)
    return pages.map((p) => (
      <Button
        key={p}
        className={clsx(
          'rounded',
          p === pageIndex
            ? 'bg-blue-500 text-white'
            : 'bg-white text-black border-gray-200 hover:bg-gray-100'
        )}
        onClick={() => p !== pageIndex && handlePageClick(p)}
      >
        {p + 1}
      </Button>
    ))
  }

  const handleRowToggle = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }))
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {showToggle && (
                  <TableHead key="toggle" className="w-8"></TableHead>
                )}
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort?.()
                  const sortEntry = sorting.find(
                    (s) => s.id === header.column.id
                  )
                  const isSorted = sortEntry
                    ? sortEntry.desc
                      ? 'desc'
                      : 'asc'
                    : false
                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      style={{ width: header.column.getSize() }}
                      className={
                        canSort ? 'cursor-pointer select-none' : undefined
                      }
                    >
                      <div className="flex gap-2 items-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {canSort && (
                          <span className="flex flex-col -space-y-1 text-[8px] w-3">
                            <span
                              className={clsx({
                                'text-black': isSorted === 'asc',
                                'text-gray-200':
                                  !isSorted || isSorted === 'desc',
                              })}
                            >
                              ▲
                            </span>
                            <span
                              className={clsx({
                                'text-black': isSorted === 'desc',
                                'text-gray-200':
                                  !isSorted || isSorted === 'asc',
                              })}
                            >
                              ▼
                            </span>
                          </span>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const isExpanded = !!expandedRows[row.id]
                return (
                  <TableRow
                    key={row.id}
                    className={clsx(
                      isExpanded ? 'whitespace-normal' : 'whitespace-nowrap'
                    )}
                  >
                    {showToggle && (
                      <TableCell className="align-top w-8">
                        <Button
                          variant="outline"
                          onClick={() => handleRowToggle(row.id)}
                          className="border rounded w-6 h-6 border-primary text-primary hover:text-primary p-0 leading-none"
                        >
                          {isExpanded ? '−' : '+'}
                        </Button>
                      </TableCell>
                    )}

                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={clsx(
                          isExpanded
                            ? 'whitespace-normal'
                            : 'whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]',
                          'align-top'
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2 mt-2">
        <span>
          Menampilkan {pageIndex * pageSize + 1} -{' '}
          {Math.min((pageIndex + 1) * pageSize, totalData)} dari total{' '}
          {totalData} data pada kolom 1 dari {columns.length} kolom
        </span>
        <div>
          <Button
            variant="ghost"
            onClick={handlePrevPage}
            disabled={pageIndex === 0}
          >
            <ChevronLeft />
          </Button>
          {renderPageNumbers()}
          <Button
            variant="ghost"
            onClick={handleNextPage}
            disabled={pageIndex >= pageCount - 1 || pageCount === 0}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { DataTable }
