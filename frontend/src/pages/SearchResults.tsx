import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { searchResults, isSearching, performSearch } = useSearch();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const filterOptions = [
    { value: 'all', label: 'All Results', count: searchResults.length },
    { value: 'project', label: 'Projects', count: searchResults.filter(r => r.type === 'project').length },
    { value: 'event', label: 'Events', count: searchResults.filter(r => r.type === 'event').length },
    { value: 'marketplace', label: 'Marketplace', count: searchResults.filter(r => r.type === 'marketplace').length },
    { value: 'community', label: 'Community', count: searchResults.filter(r => r.type === 'community').length },
  ];

  const filteredResults = selectedFilter === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === selectedFilter);

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0; // relevance (keep original order)
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return '🚀';
      case 'event': return '📅';
      case 'marketplace': return '🛒';
      case 'community': return '👥';
      case 'user': return '👤';
      default: return '📄';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'marketplace': return 'bg-purple-100 text-purple-800';
      case 'community': return 'bg-orange-100 text-orange-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <Search className="h-5 w-5" />
            <span>Search results for:</span>
            <span className="font-semibold text-gray-900">"{query}"</span>
          </div>
          
          {!isSearching && (
            <p className="text-gray-600">
              Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
              {selectedFilter !== 'all' && ` in ${filterOptions.find(f => f.value === selectedFilter)?.label}`}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>
              
              {/* Content Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Content Type</h4>
                <div className="space-y-2">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFilter(option.value)}
                      className={`w-full flex justify-between items-center p-2 rounded-lg text-left transition-colors ${
                        selectedFilter === option.value
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span>{option.label}</span>
                      <span className="text-sm">{option.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {isSearching ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-gray-600">Searching...</span>
              </div>
            ) : sortedResults.length > 0 ? (
              <div className="space-y-6">
                {sortedResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      {result.image && (
                        <div className="sm:w-32 h-24 flex-shrink-0">
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTypeIcon(result.type)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(result.type)}`}>
                              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <Link
                          to={result.url}
                          className="block group"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
                            {result.title}
                            <ExternalLink className="inline-block ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{result.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {result.author && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{result.author}</span>
                            </div>
                          )}
                          
                          {result.date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(result.date).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Tag className="h-4 w-4" />
                              <div className="flex flex-wrap gap-1">
                                {result.tags.slice(0, 3).map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                                {result.tags.length > 3 && (
                                  <span className="text-gray-400 text-xs">+{result.tags.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find anything matching "{query}". Try adjusting your search terms.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Suggestions:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your spelling</li>
                    <li>• Try different keywords</li>
                    <li>• Use more general terms</li>
                    <li>• Browse by category using the filters</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
                <p className="text-gray-600">Enter a search term to find projects, events, marketplace items, and more.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;