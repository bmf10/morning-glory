'use client'

import { DataTable } from '@/components/ui/datatable'
import { FilterPanel } from '@/components/ui/filter'
import { useQuery } from '@tanstack/react-query'
import { SortingState } from '@tanstack/react-table'
import axios from 'axios'
import { useState, useMemo } from 'react'

export default function Category() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<Record<string, unknown>>({})

  const apiParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page: pageIndex + 1,
      pageSize,
      sortBy: sorting[0]?.id,
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    }

    if (filters.createdAt && Array.isArray(filters.createdAt)) {
      const [from, to] = filters.createdAt as [
        Date | undefined,
        Date | undefined
      ]
      if (from) params.createdAtFrom = from.toISOString()
      if (to) params.createdAtTo = to.toISOString()
    }
    if (filters.code) params.code = filters.code
    if (filters.id) params.id = filters.id
    if (filters.name) params.name = filters.name
    if (filters.description) params.description = filters.description

    return params
  }, [pageIndex, pageSize, sorting, filters])

  const { data } = useQuery({
    queryKey: ['categories', apiParams],
    queryFn: () =>
      axios.get('/api/category', {
        params: apiParams,
      }),
    select: (data) => data.data,
  })

  const handlePaginationChange = ({
    pageIndex: newPageIndex,
    pageSize: newPageSize,
  }: {
    pageIndex: number
    pageSize: number
  }) => {
    setPageIndex(newPageIndex)
    setPageSize(newPageSize)
  }

  const handleApplyFilters = (values?: Record<string, unknown>) => {
    setFilters(values || {})
    setPageIndex(0)
  }

  return (
    <>
      <FilterPanel
        defaultOpen={false}
        fields={[
          { label: 'Waktu', name: 'createdAt', type: 'dateRange' },
          { label: 'Kode', name: 'code', type: 'text' },
          { label: 'ID', name: 'id', type: 'text' },
          { label: 'Nama', name: 'name', type: 'text' },
          { label: 'Keterangan', name: 'description', type: 'text' },
        ]}
        onApply={handleApplyFilters}
      />
      <DataTable
        totalData={data?.pagination.total}
        pageCount={data?.pagination.totalPages}
        pageIndex={data?.pagination.page - 1}
        pageSize={data?.pagination.pageSize}
        onPaginationChange={handlePaginationChange}
        sorting={sorting}
        onSortingChange={(sorter) => setSorting(sorter)}
        data={data?.data ?? []}
        columns={[
          {
            accessorKey: 'code',
            header: 'Kode Kategori Barang',
          },
          {
            accessorKey: 'name',
            header: 'Nama Kategori Barang',
          },
          {
            accessorKey: 'description',
            header: 'Description',
          },
        ]}
      />
    </>
  )
}
