import { useState, useMemo } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

const usePagination = (options?: UsePaginationOptions) => {
  const { initialPage = 1, initialLimit = 10 } = options || {};

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (newLimit > 0) {
      setLimit(newLimit);
      setPage(1);
    }
  };

  return {
    page,
    limit,
    offset,
    handlePageChange,
    handleLimitChange,
    setPage,
    setLimit,
  };
};

export default usePagination;
