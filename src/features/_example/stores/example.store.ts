import { create } from 'zustand';
import type { ExampleItem, ExampleFilter, ExampleListParams } from '../types';
import { EXAMPLE_PAGE_SIZE } from '../constants';

export interface ExampleState {
  items: ExampleItem[];
  selectedItem: ExampleItem | null;
  isLoading: boolean;
  error: string | null;
  filter: ExampleFilter;
  page: number;
  totalPages: number;
  total: number;
}

export interface ExampleActions {
  setItems: (items: ExampleItem[]) => void;
  setSelectedItem: (item: ExampleItem | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: ExampleFilter) => void;
  setPage: (page: number) => void;
  reset: () => void;
  getListParams: () => ExampleListParams;
}

export type ExampleStore = ExampleState & ExampleActions;

export const initialExampleState: ExampleState = {
  items: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  filter: {},
  page: 1,
  totalPages: 0,
  total: 0,
};

export const useExampleStore = create<ExampleStore>((set, get) => ({
  ...initialExampleState,

  setItems: (items) => { set({ items }); },

  setSelectedItem: (selectedItem) => { set({ selectedItem }); },

  setLoading: (isLoading) => { set({ isLoading }); },

  setError: (error) => { set({ error }); },

  setFilter: (filter) => { set({ filter, page: 1 }); },

  setPage: (page) => { set({ page }); },

  reset: () => { set(initialExampleState); },

  getListParams: () => {
    const state = get();
    return {
      page: state.page,
      pageSize: EXAMPLE_PAGE_SIZE,
      filter: state.filter,
    };
  },
}));

export function selectItems(state: ExampleStore): ExampleItem[] {
  return state.items;
}

export function selectSelectedItem(state: ExampleStore): ExampleItem | null {
  return state.selectedItem;
}

export function selectIsLoading(state: ExampleStore): boolean {
  return state.isLoading;
}

export function selectError(state: ExampleStore): string | null {
  return state.error;
}

export function selectTotal(state: ExampleStore): number {
  return state.total;
}

export function selectPagination(state: ExampleStore): Pick<ExampleStore, 'page' | 'totalPages' | 'total'> {
  return {
    page: state.page,
    totalPages: state.totalPages,
    total: state.total,
  };
}
