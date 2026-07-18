import { create } from 'zustand';
import type { SearchSuggestion, SearchState } from '../types';

export interface SearchActions {
  setQuery: (query: string) => void;
  setSuggestions: (suggestions: SearchSuggestion[]) => void;
  setPopularSearches: (searches: string[]) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setSearching: (isSearching: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export type SearchStore = SearchState & SearchActions;

export const initialSearchState: SearchState = {
  query: '',
  suggestions: [],
  popularSearches: ['أحذية رياضية', 'هودي', 'اكسسوارات', 'عروض'],
  recentSearches: [],
  isSearching: false,
  isOpen: false,
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initialSearchState,

  setQuery: (query) => { set({ query }); },

  setSuggestions: (suggestions) => { set({ suggestions }); },

  setPopularSearches: (searches) => { set({ popularSearches: searches }); },

  addRecentSearch: (query) =>
    { set((state) => {
      const filtered = state.recentSearches.filter((s) => s.query !== query);
      return {
        recentSearches: [{ query, timestamp: new Date().toISOString() }, ...filtered].slice(0, 10),
      };
    }); },

  clearRecentSearches: () => { set({ recentSearches: [] }); },

  setSearching: (isSearching) => { set({ isSearching }); },

  openSearch: () => { set({ isOpen: true }); },

  closeSearch: () => { set({ isOpen: false, query: '', suggestions: [] }); },
}));
