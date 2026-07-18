import type { ApiError } from './common';

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiListResponse<T> {
  data: T[];
  error: ApiError | null;
  total: number;
}
