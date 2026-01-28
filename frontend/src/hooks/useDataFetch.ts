// src/hooks/useDataFetch.ts
import { useState, useEffect, useCallback } from 'react';
import { APIResponse, PaginatedResponse, IPaginationMeta } from '../types/api.d';
import usePagination from './usePagination';

interface UseDataFetchOptions {
  initialLimit?: number;
}

interface FetchFunction<T> {
  (page: number, limit: number): Promise<APIResponse<PaginatedResponse<T>>>;
}

const useDataFetch = <T>(
  fetcher: FetchFunction<T>,
  options?: UseDataFetchOptions
) => {
  const { page, limit, handlePageChange, setPage } = usePagination(options);
  const [data, setData] = useState<T[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetcher(page, limit);
      if (response.success && response.data) {
        setData(response.data.items);
        setPaginationMeta(response.data.pagination);
      } else {
        setError(response.message || "Failed to fetch data.");
      }
    } catch (err: any) { // Consider refining `any` type for errors
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    paginationMeta,
    loading,
    error,
    page,
    limit,
    handlePageChange,
    setPage,
    refetch: fetchData, // Provide a way to manually refetch
  };
};

export default useDataFetch;