import type { PaginationParams, PaginatedResponse } from '@/types';

export interface ExampleItem {
  id: string;
  name: string;
  description: string;
  status: ExampleStatus;
  createdAt: string;
  updatedAt: string;
}

export type ExampleStatus = 'active' | 'inactive' | 'archived';

export interface ExampleFilter {
  status?: ExampleStatus;
  search?: string;
}

export type ExampleSort = 'name' | 'createdAt' | 'status';

export interface ExampleListParams extends PaginationParams {
  filter?: ExampleFilter;
  sort?: ExampleSort;
  order?: 'asc' | 'desc';
}

export type ExampleListResponse = PaginatedResponse<ExampleItem>;

export type CreateExamplePayload = {
  name: string;
  description: string;
  status: ExampleStatus;
};

export type UpdateExamplePayload = Partial<CreateExamplePayload>;
