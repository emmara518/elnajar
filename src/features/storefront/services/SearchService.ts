import type { ApiResponse, ApiListResponse } from '@/types';
import type { SearchSuggestion, Product, ProductListParams } from '../types';

export interface SearchService {
  search(params: ProductListParams): Promise<ApiListResponse<Product>>;
  getSuggestions(query: string): Promise<ApiResponse<SearchSuggestion[]>>;
  getPopularSearches(): Promise<ApiResponse<string[]>>;
}
