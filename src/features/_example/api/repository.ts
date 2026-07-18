import type { ApiResponse, ApiListResponse } from '@/types';
import type {
  ExampleItem,
  CreateExamplePayload,
  UpdateExamplePayload,
  ExampleListParams,
} from '../types';

export interface ExampleDTO {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function fromDTO(dto: ExampleDTO): ExampleItem {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    status: dto.status as ExampleItem['status'],
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function toCreateDTO(payload: CreateExamplePayload): Record<string, unknown> {
  return {
    name: payload.name,
    description: payload.description,
    status: payload.status,
  };
}

export function toUpdateDTO(payload: UpdateExamplePayload): Record<string, unknown> {
  const dto: Record<string, unknown> = {};
  if (payload.name !== undefined) dto.name = payload.name;
  if (payload.description !== undefined) dto.description = payload.description;
  if (payload.status !== undefined) dto.status = payload.status;
  return dto;
}

export interface ExampleRepository {
  list(params: ExampleListParams): Promise<ApiListResponse<ExampleItem>>;
  getById(id: string): Promise<ApiResponse<ExampleItem>>;
  create(payload: CreateExamplePayload): Promise<ApiResponse<ExampleItem>>;
  update(id: string, payload: UpdateExamplePayload): Promise<ApiResponse<ExampleItem>>;
  delete(id: string): Promise<ApiResponse<void>>;
}
