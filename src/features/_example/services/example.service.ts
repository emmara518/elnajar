import type { ApiResponse, ApiListResponse } from '@/types';
import type {
  ExampleItem,
  CreateExamplePayload,
  UpdateExamplePayload,
  ExampleListParams,
} from '../types';
import type { ExampleRepository } from '../api';

export class ExampleService {
  constructor(private readonly repository: ExampleRepository) {}

  async list(params: ExampleListParams): Promise<ApiListResponse<ExampleItem>> {
    const response = await this.repository.list(params);
    if (response.error !== null) {
      return { data: [], error: response.error, total: 0 };
    }
    return response;
  }

  async getById(id: string): Promise<ApiResponse<ExampleItem>> {
    return this.repository.getById(id);
  }

  async create(payload: CreateExamplePayload): Promise<ApiResponse<ExampleItem>> {
    return this.repository.create(payload);
  }

  async update(id: string, payload: UpdateExamplePayload): Promise<ApiResponse<ExampleItem>> {
    return this.repository.update(id, payload);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.repository.delete(id);
  }
}
