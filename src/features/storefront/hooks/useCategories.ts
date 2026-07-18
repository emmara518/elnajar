import { useState, useCallback } from 'react';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCategoryById = useCallback((id: string) => {
    return categories.find((c) => c.id === id) ?? null;
  }, [categories]);

  const getCategoryBySlug = useCallback((slug: string) => {
    return categories.find((c) => c.slug === slug) ?? null;
  }, [categories]);

  return {
    categories,
    isLoading,
    error,
    setCategories,
    setIsLoading,
    setError,
    getCategoryById,
    getCategoryBySlug,
  };
}
