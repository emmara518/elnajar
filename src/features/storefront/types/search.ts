export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand' | 'query';
  url: string;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: string;
}

export interface SearchState {
  query: string;
  suggestions: SearchSuggestion[];
  popularSearches: string[];
  recentSearches: SearchHistoryItem[];
  isSearching: boolean;
  isOpen: boolean;
}
