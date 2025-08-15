import { NextResponse } from 'next/server'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

  const sortBy = searchParams.get('sortBy') || 'id'
  const sortOrder =
    (searchParams.get('sortOrder') || 'asc').toLowerCase() === 'desc'
      ? 'desc'
      : 'asc'

  const validSortColumns = [
    'id',
    'code',
    'name',
    'unit',
    'inStock',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]

  const orderByColumn = validSortColumns.includes(sortBy) ? sortBy : 'id'

  const filters: Prisma.ProductWhereInput = { deletedAt: null }

  const id = searchParams.get('id')
  if (id !== null && id !== '') {
    const idNum = Number(id)
    if (!isNaN(idNum)) {
      filters.id = idNum
    }
  }

  const code = searchParams.get('code')
  if (code !== null && code !== '') {
    filters.code = { contains: code }
  }

  const name = searchParams.get('name')
  if (name !== null && name !== '') {
    filters.name = { contains: name }
  }

  const category = searchParams.get('category')
  if (category !== null && category !== '') {
    filters.category = {
      name: { contains: category }
    }
  }

  const unit = searchParams.get('unit')
  if (unit !== null && unit !== '') {
    filters.unit = { contains: unit }
  }

  const inStock = searchParams.get('inStock')
  if (inStock !== null && inStock !== '') {
    if (inStock === 'true' || inStock === 'false') {
      filters.inStock = inStock === 'true'
    }
  }

  const createdAtFrom = searchParams.get('createdAtFrom')
  const createdAtTo = searchParams.get('createdAtTo')
  if (createdAtFrom || createdAtTo) {
    filters.createdAt = {}
    if (createdAtFrom) {
      filters.createdAt.gte = new Date(createdAtFrom)
    }
    if (createdAtTo) {
      filters.createdAt.lte = new Date(createdAtTo)
    }
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        orderBy: { [orderByColumn]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: true,
          stock: { take: 1 },
        },
      }),
      prisma.product.count({ where: filters }),
    ])

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    )
  }
}
