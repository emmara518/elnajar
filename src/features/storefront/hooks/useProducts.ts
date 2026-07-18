import { useState, useCallback } from 'react';
import type { Product, ProductListParams, ProductSortOption, ProductFilters } from '../types';
import { STOREFRONT_PAGE_SIZE } from '../constants';

export function useProducts(initialParams?: Partial<ProductListParams>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ProductListParams>({
    page: 1,
    pageSize: STOREFRONT_PAGE_SIZE,
    ...initialParams,
  });
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setSort = useCallback((sort: ProductSortOption) => {
    setParams((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: ProductFilters) => {
    setParams((prev) => ({ ...prev, filters, page: 1 }));
  }, []);

  const setQuery = useCallback((query: string) => {
    setParams((prev) => ({
      ...prev,
      filters: { ...prev.filters, query },
      page: 1,
    }));
  }, []);

  return {
    products,
    isLoading,
    error,
    params,
    total,
    hasMore,
    setPage,
    setSort,
    setFilters,
    setQuery,
    setProducts,
    setIsLoading,
    setError,
    setTotal,
    setHasMore,
  };
}
