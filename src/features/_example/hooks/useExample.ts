import { useCallback } from 'react';
import { useExampleStore, selectItems, selectIsLoading, selectError, selectPagination } from '../stores';
import type { ExampleFilter, ExampleSort } from '../types';

export function useExample() {
  const items = useExampleStore(selectItems);
  const isLoading = useExampleStore(selectIsLoading);
  const error = useExampleStore(selectError);
  const pagination = useExampleStore(selectPagination);

  const filter = useExampleStore((state) => state.filter);
  const page = useExampleStore((state) => state.page);

  const setFilter = useExampleStore((state) => state.setFilter);
  const setPage = useExampleStore((state) => state.setPage);

  const handleFilterChange = useCallback(
    (newFilter: ExampleFilter) => {
      setFilter(newFilter);
    },
    [setFilter],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage],
  );

  const handleSortChange = useCallback(
    (sort: ExampleSort, order: 'asc' | 'desc') => {
      setFilter({ ...filter, ...{ sort, order } });
    },
    [filter, setFilter],
  );

  return {
    items,
    isLoading,
    error,
    filter,
    page,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleSortChange,
  };
}
