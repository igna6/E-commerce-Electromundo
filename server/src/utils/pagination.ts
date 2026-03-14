export function paginate<T>(items: T[], total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)
  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}
