import { useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchStore } from '../stores/search.store';

export function SearchOverlay() {
  const { isOpen, query, suggestions, popularSearches, recentSearches, setQuery, closeSearch, addRecentSearch } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeSearch]);

  const handleSubmit = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      closeSearch();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, addRecentSearch, closeSearch, navigate]);

  const handleSuggestionClick = useCallback((text: string) => {
    addRecentSearch(text);
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(text)}`);
  }, [addRecentSearch, closeSearch, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" role="dialog" aria-modal="true" aria-label="بحث" onClick={closeSearch}>
      <div className="bg-white" dir="rtl" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} role="search">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                placeholder="ابحث عن منتجات..."
                className="flex-1 h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="p-3 text-gray-500 hover:text-gray-700"
                aria-label="إغلاق البحث"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-6">
            {popularSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">عمليات البحث الشائعة</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      type="button"
                      onClick={() => { handleSuggestionClick(search); }}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">عمليات البحث الأخيرة</h3>
                <ul className="space-y-2">
                  {recentSearches.map((item) => (
                    <li key={item.query}>
                      <button
                        type="button"
                        onClick={() => { handleSuggestionClick(item.query); }}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {item.query}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">اقتراحات</h3>
                <ul className="space-y-2">
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <li key={suggestion.text}>
                      <Link
                        to={suggestion.url}
                        onClick={() => { handleSuggestionClick(suggestion.text); }}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {suggestion.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
