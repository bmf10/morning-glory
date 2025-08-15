'use client'

import { DataTable } from '@/components/ui/datatable'
import { FilterPanel } from '@/components/ui/filter'
import { useQuery } from '@tanstack/react-query'
import { SortingState } from '@tanstack/react-table'
import axios from 'axios'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Cell {
  row: {
    original: {
        category: { name?: string }
    }
  }
}

export default function Product() {
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
    if (filters.category) params.category = filters.category
    if (filters.unit) params.unit = filters.unit
    if (filters.inStock !== 'all') params.inStock = filters.inStock

    return params
  }, [pageIndex, pageSize, sorting, filters])

  const { data } = useQuery({
    queryKey: ['products', apiParams],
    queryFn: () =>
      axios.get('/api/product', {
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
          { label: 'ID', name: 'id', type: 'text' },
          { label: 'Kode Barang', name: 'code', type: 'text' },
          { label: 'Nama Barang', name: 'name', type: 'text' },
          { label: 'Kategori', name: 'category', type: 'text' },
          { label: 'Satuan', name: 'unit', type: 'text' },
          {
            label: 'Ada Stock',
            name: 'inStock',
            type: 'select',
            options: [
              { label: 'Semua', value: 'all' },
              { label: 'Ada', value: 'true' },
              { label: 'Tidak Ada', value: 'false' },
            ],
          },
        ]}
        onApply={handleApplyFilters}
      />
      <DataTable
        showToggle
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
            header: 'Kode Barang',
          },
          {
            accessorKey: 'name',
            header: 'Nama Barang',
          },
          {
            accessorKey: 'createdAt',
            header: 'Tanggal Pembuatan',
            cell: ({ getValue }) => {
              const value = getValue() as string | Date | undefined
              if (!value) return '-'
              const date = typeof value === 'string' ? new Date(value) : value
              return format(date, 'dd MMM yyyy', { locale: id })
            },
          },
          {
            accessorKey: 'category.name',
            header: 'Kategori',
            cell: ({ row }: Cell) => row.original?.category?.name ?? '-',
            enableSorting: false,
          },
          {
            accessorKey: 'unit',
            header: 'Satuan',
          },
          {
            accessorKey: 'inStock',
            header: 'Ada Stock',
            cell: ({ getValue }) => {
              const value = getValue()
              if (value === true) return 'Ada'
              if (value === false) return 'Tidak Ada'
              return '-'
            },
          },
          {
            accessorKey: 'description',
            header: 'Keterangan',
            size: 20,
          },
        ]}
      />
    </>
  )
}
