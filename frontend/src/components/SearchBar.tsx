import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

const SearchBar = ({ 
  placeholder = "Search projects, events, marketplace...", 
  className = "",
  showSuggestions = true 
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const { 
    searchQuery, 
    setSearchQuery, 
    recentSearches, 
    popularSearches,
    performSearch 
  } = useSearch();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    await performSearch(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync with global search query
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const filteredPopularSearches = popularSearches.filter(search =>
    search.toLowerCase().includes(localQuery.toLowerCase()) && 
    search.toLowerCase() !== localQuery.toLowerCase()
  ).slice(0, 5);

  const showDropdown = isFocused && showSuggestions && (
    localQuery.length === 0 || 
    filteredPopularSearches.length > 0 || 
    recentSearches.length > 0
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{color: '#000000'}} />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
        />
        {localQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {localQuery.length === 0 ? (
            // Show recent and popular searches when input is empty
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between group"
                      >
                        <span>{search}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Popular Searches</span>
                </div>
                <div className="space-y-1">
                  {popularSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between group"
                    >
                      <span>{search}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Show filtered suggestions when typing
            <div className="p-2">
              {filteredPopularSearches.length > 0 && (
                <div className="space-y-1">
                  {filteredPopularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-3"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span>
                        <span className="text-gray-400">
                          {search.substring(0, search.toLowerCase().indexOf(localQuery.toLowerCase()))}
                        </span>
                        <span className="font-medium text-gray-900">
                          {search.substring(
                            search.toLowerCase().indexOf(localQuery.toLowerCase()),
                            search.toLowerCase().indexOf(localQuery.toLowerCase()) + localQuery.length
                          )}
                        </span>
                        <span className="text-gray-400">
                          {search.substring(search.toLowerCase().indexOf(localQuery.toLowerCase()) + localQuery.length)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              {localQuery.trim() && (
                <button
                  onClick={() => handleSearch(localQuery)}
                  className="w-full text-left px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors flex items-center space-x-3 border-t border-gray-100 mt-2 pt-3"
                >
                  <Search className="h-4 w-4" />
                  <span>Search for "<strong>{localQuery}</strong>"</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;