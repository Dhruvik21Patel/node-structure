import { useState, useEffect, useCallback } from "react";
import {
  APIResponse,
  PaginatedResponse,
  IPaginationMeta,
} from "../types/api.d";
import usePagination from "./usePagination";

interface FetchFunction<T, P> {
  (
    params: P & { page: number; limit: number },
  ): Promise<APIResponse<PaginatedResponse<T>>>;
}

const useDataFetch = <T, P extends object>(
  fetcher: FetchFunction<T, P>,
  params: P,
) => {
  const { page, limit, handlePageChange } = usePagination();

  const [data, setData] = useState<T[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetcher({
        ...params,
        page,
        limit,
      });

      if (response.success && response.data) {
        setData(response.data.items);
        setPaginationMeta(response.data.pagination);
      } else {
        setError(response.message || "Failed to fetch data.");
      }
    } catch {
      setError("Error while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [fetcher, params, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    paginationMeta,
    loading,
    error,
    page,
    handlePageChange,
    refetch: fetchData,
  };
};

export default useDataFetch;
