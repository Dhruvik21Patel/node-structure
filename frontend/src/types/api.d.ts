// frontend/src/types/api.d.ts

export interface IPaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: IPaginationMeta;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: IPaginationMeta;
}
