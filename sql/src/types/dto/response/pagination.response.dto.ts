export interface IPaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export class PaginatedResponseDTO<T> {
  items: T[];
  pagination: IPaginationInfo;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.pagination = {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pageSize: limit,
    };
  }
}
