export type { ExampleItem, ExampleStatus, ExampleFilter, ExampleSort, ExampleListParams, ExampleListResponse, CreateExamplePayload, UpdateExamplePayload } from './types';
export type { CreateExampleRequest, UpdateExampleRequest } from './types/api';

export { exampleRoutes } from './routes';
export type { ExampleRouteHandle } from './routes';

export { useExampleStore, initialExampleState } from './stores';
export type { ExampleStore, ExampleState, ExampleActions } from './stores';
export { selectItems, selectSelectedItem, selectIsLoading, selectError, selectTotal, selectPagination } from './stores';

export { useExample, useExampleActions, useExamplePermissions } from './hooks';
export type { ExamplePermission } from './hooks';

export { ExampleService } from './services';
export { exampleStatusSchema, createExampleSchema, updateExampleSchema, exampleFilterSchema } from './schemas';
export type { CreateExampleFormData, UpdateExampleFormData, ExampleFilterFormData } from './schemas';

export type { ExampleRepository } from './api';
export { fromDTO, toCreateDTO, toUpdateDTO } from './api';
export type { ExampleDTO } from './api';

export { EXAMPLE_PAGE_SIZE, EXAMPLE_STATUS_OPTIONS, EXAMPLE_SORT_OPTIONS } from './constants';
export { sortExamples, filterExamples, formatExampleStatus } from './utils';
