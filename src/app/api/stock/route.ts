import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

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
    'productId',
    'amount',
    'unit',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'product_name',
  ]

  const filters: Prisma.StockWhereInput = { deletedAt: null }

  const id = searchParams.get('id')
  if (id !== null && id !== '') {
    const idNum = Number(id)
    if (!isNaN(idNum)) {
      filters.id = idNum
    }
  }

  const product = searchParams.get('product')
  if (product !== null && product !== '') {
    filters.product = {
      name: {
        contains: product,
      },
    }
  }

  const amount = searchParams.get('amount')
  if (amount !== null && amount !== '') {
    const amountNum = Number(amount)
    if (!isNaN(amountNum)) {
      filters.amount = amountNum
    }
  }

  const unit = searchParams.get('unit')
  if (unit !== null && unit !== '') {
    filters.unit = { contains: unit }
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

  let orderBy:
    | Prisma.StockOrderByWithRelationInput
    | Prisma.StockOrderByWithRelationInput[]
  if (sortBy === 'product_name') {
    orderBy = {
      product: {
        name: sortOrder,
      },
    }
  } else {
    const orderByColumn = validSortColumns.includes(sortBy) ? sortBy : 'id'
    orderBy = { [orderByColumn]: sortOrder }
  }

  try {
    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        where: filters,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.stock.count({ where: filters }),
    ])

    return NextResponse.json({
      data: stocks,
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
        error: 'Failed to fetch stocks',
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    )
  }
}
