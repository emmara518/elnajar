import type { ExampleListParams } from './index';

export type GetExampleListRequest = ExampleListParams;

export interface CreateExampleRequest {
  name: string;
  description: string;
  status: string;
}

export interface UpdateExampleRequest {
  name?: string;
  description?: string;
  status?: string;
}
