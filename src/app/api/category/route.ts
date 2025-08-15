import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
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
    'description',
    'createdAt',
    'updatedAt',
    'deletedAt',
  ]

  const orderByColumn = validSortColumns.includes(sortBy) ? sortBy : 'id'

  const filters: Prisma.CategoryWhereInput = { deletedAt: null }

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

  const description = searchParams.get('description')
  if (description !== null && description !== '') {
    filters.description = { contains: description }
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
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: filters,
        orderBy: { [orderByColumn]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.category.count({ where: filters }),
    ])

    return NextResponse.json({
      data: categories,
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
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    )
  }
}
