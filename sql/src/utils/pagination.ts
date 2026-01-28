// utils/pagination.util.ts

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export const getPagination = (
  page?: string | number,
  limit?: string | number,
) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const pageNumber =
    Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const pageSize =
    Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;

  const skip = (pageNumber - 1) * pageSize;

  return { pageNumber, pageSize, skip };
};

export const paginate = async <TPlain, TDTO, TWhere extends object>(
  repositoryFn: (args: {
    where?: TWhere;
    skip: number;
    take: number;
  }) => Promise<{ items: TPlain[]; total: number }>,
  where: TWhere | undefined,
  page: string | number | undefined,
  limit: string | number | undefined,
  dtoMapper: (item: TPlain) => TDTO,
): Promise<PaginationResult<TDTO>> => {
  const { pageNumber, pageSize, skip } = getPagination(page, limit);

  const { items, total } = await repositoryFn({
    where,
    skip,
    take: pageSize,
  });

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: items.map(dtoMapper),
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    },
  };
};
