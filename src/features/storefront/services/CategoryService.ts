import type { ApiListResponse, ApiResponse } from '@/types';
import type { Category, CategoryListParams } from '../types';

export interface CategoryService {
  list(params?: CategoryListParams): Promise<ApiListResponse<Category>>;
  getById(id: string): Promise<ApiResponse<Category>>;
  getBySlug(slug: string): Promise<ApiResponse<Category>>;
  getRootCategories(): Promise<ApiListResponse<Category>>;
}
