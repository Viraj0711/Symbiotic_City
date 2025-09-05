import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'event' | 'marketplace' | 'community' | 'user';
  url: string;
  image?: string;
  tags?: string[];
  date?: string;
  author?: string;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  performSearch: (query: string) => Promise<void>;
  recentSearches: string[];
  popularSearches: string[];
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Mock data for demonstration
const mockData: SearchResult[] = [
  {
    id: '1',
    title: 'Community Garden Project',
    description: 'Building a sustainable community garden in downtown area',
    type: 'project',
    url: '/projects/1',
    image: '/api/placeholder/300/200',
    tags: ['sustainability', 'community', 'garden'],
    date: '2025-09-01',
    author: 'Green Thumb Initiative'
  },
  {
    id: '2',
    title: 'Urban Sustainability Workshop',
    description: 'Learn about eco-friendly practices for city living',
    type: 'event',
    url: '/events/2',
    image: '/api/placeholder/300/200',
    tags: ['workshop', 'sustainability', 'urban'],
    date: '2025-09-15',
    author: 'EcoCity Group'
  },
  {
    id: '3',
    title: 'Organic Vegetable Seeds',
    description: 'High-quality organic seeds for your home garden',
    type: 'marketplace',
    url: '/marketplace/3',
    image: '/api/placeholder/300/200',
    tags: ['organic', 'seeds', 'garden'],
    author: 'Green Seeds Co.'
  },
  {
    id: '4',
    title: 'Renewable Energy Discussion',
    description: 'Community discussion about solar panel installation',
    type: 'community',
    url: '/community/4',
    tags: ['renewable', 'energy', 'solar'],
    date: '2025-09-10',
    author: 'Solar Community'
  },
  {
    id: '5',
    title: 'Climate Action Workshop',
    description: 'Hands-on workshop for local climate action initiatives',
    type: 'event',
    url: '/events/5',
    image: '/api/placeholder/300/200',
    tags: ['climate', 'action', 'workshop'],
    date: '2025-09-20',
    author: 'Climate Action Network'
  },
  {
    id: '6',
    title: 'Sustainable Tech Marketplace',
    description: 'Eco-friendly technology products and solutions',
    type: 'marketplace',
    url: '/marketplace/6',
    image: '/api/placeholder/300/200',
    tags: ['technology', 'sustainable', 'eco-friendly'],
    author: 'EcoTech Solutions'
  },
  {
    id: '7',
    title: 'Urban Beekeeping Project',
    description: 'Supporting local bee populations in urban environments',
    type: 'project',
    url: '/projects/7',
    image: '/api/placeholder/300/200',
    tags: ['beekeeping', 'urban', 'environment'],
    date: '2025-08-25',
    author: 'City Beekeepers'
  },
  {
    id: '8',
    title: 'Green Transportation Initiative',
    description: 'Promoting bike-sharing and electric vehicle adoption',
    type: 'community',
    url: '/community/8',
    tags: ['transportation', 'green', 'electric'],
    author: 'Green Transit Group'
  }
];

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'sustainable garden', 'climate action', 'renewable energy'
  ]);

  const popularSearches = [
    'community garden',
    'sustainability workshop',
    'renewable energy',
    'organic farming',
    'climate action',
    'green technology',
    'urban beekeeping',
    'eco-friendly products'
  ];

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filter mock data based on query
    const lowercaseQuery = query.toLowerCase();
    const results = mockData.filter(item =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      item.author?.toLowerCase().includes(lowercaseQuery)
    );

    setSearchResults(results);
    setIsSearching(false);

    // Add to recent searches if not already there
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        performSearch,
        recentSearches,
        popularSearches,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};