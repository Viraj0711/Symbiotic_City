import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Leaf, Award, MapPin, Star, Eye, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EnergyProduct {
  id: string;
  title: string;
  description: string;
  category: 'hydrogen' | 'solar' | 'wind' | 'battery_storage' | 'green_certificate';
  ownerId: string;
  ownerName: string;
  ownerVerified: boolean;
  pricing: {
    amount: number;
    unit: string;
    currency: string;
    discounts?: {
      bulk: number;
      longTerm: number;
    };
  };
  availability: {
    quantity: number;
    unit: string;
    availableFrom: string;
    availableUntil: string;
  };
  specifications: {
    purity?: number;
    capacity?: number;
    efficiency?: number;
    certificationLevel: string;
    sustainabilityScore: number;
  };
  delivery: {
    methods: string[];
    radius: number;
    cost: number;
    estimatedTime: string;
  };
  location: {
    city: string;
    state: string;
    distance?: number;
  };
  images: string[];
  certifications: string[];
  reviews: {
    averageRating: number;
    totalReviews: number;
  };
  analytics: {
    views: number;
    inquiries: number;
    sales: number;
  };
  status: 'active' | 'inactive' | 'sold_out';
  featured: boolean;
  tags: string[];
  createdAt: string;
}

const GreenEnergyMarketplace: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<EnergyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<EnergyProduct | null>(null);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🌱' },
    { id: 'hydrogen', name: 'Hydrogen', icon: '⚡' },
    { id: 'solar', name: 'Solar Energy', icon: '☀️' },
    { id: 'wind', name: 'Wind Energy', icon: '💨' },
    { id: 'battery_storage', name: 'Battery Storage', icon: '🔋' },
    { id: 'green_certificate', name: 'Green Certificates', icon: '🏆' }
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price_low', name: 'Price: Low to High' },
    { id: 'price_high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest First' },
    { id: 'distance', name: 'Nearest First' }
  ];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Mock data for demo - replace with actual API call
      const mockProducts: EnergyProduct[] = [
        {
          id: '1',
          title: 'Premium Green Hydrogen - 99.9% Purity',
          description: 'High-purity green hydrogen produced using renewable energy sources. Perfect for industrial applications and fuel cells.',
          category: 'hydrogen',
          ownerId: 'owner1',
          ownerName: 'EcoHydrogen Solutions',
          ownerVerified: true,
          pricing: {
            amount: 8.50,
            unit: 'kg',
            currency: 'USD',
            discounts: { bulk: 15, longTerm: 10 }
          },
          availability: {
            quantity: 500,
            unit: 'kg',
            availableFrom: '2025-09-08',
            availableUntil: '2025-12-31'
          },
          specifications: {
            purity: 99.9,
            certificationLevel: 'ISO 14687',
            sustainabilityScore: 95
          },
          delivery: {
            methods: ['pickup', 'delivery', 'pipeline'],
            radius: 100,
            cost: 150,
            estimatedTime: '2-5 days'
          },
          location: {
            city: 'San Francisco',
            state: 'CA',
            distance: 25
          },
          images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'],
          certifications: ['ISO 14687', 'Green-e', 'EPA Certified'],
          reviews: {
            averageRating: 4.8,
            totalReviews: 47
          },
          analytics: {
            views: 1243,
            inquiries: 89,
            sales: 23
          },
          status: 'active',
          featured: true,
          tags: ['premium', 'industrial', 'fuel-cell'],
          createdAt: '2025-08-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Solar Energy Certificates - Residential',
          description: 'Direct solar energy from our 50MW photovoltaic farm. Clean, renewable electricity with certified sustainability credentials.',
          category: 'solar',
          ownerId: 'owner2',
          ownerName: 'SunPower Green',
          ownerVerified: true,
          pricing: {
            amount: 25.00,
            unit: 'MWh',
            currency: 'USD'
          },
          availability: {
            quantity: 1000,
            unit: 'MWh',
            availableFrom: '2025-09-01',
            availableUntil: '2025-11-30'
          },
          specifications: {
            efficiency: 22.5,
            certificationLevel: 'IEC 61215 Certified',
            sustainabilityScore: 88
          },
          delivery: {
            methods: ['grid_injection', 'direct_supply'],
            radius: 150,
            cost: 50,
            estimatedTime: '1-2 days'
          },
          location: {
            city: 'Phoenix',
            state: 'AZ',
            distance: 150
          },
          images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800'],
          certifications: ['IEC 61215', 'UL Listed', 'Green-e'],
          reviews: {
            averageRating: 4.6,
            totalReviews: 128
          },
          analytics: {
            views: 2156,
            inquiries: 156,
            sales: 67
          },
          status: 'active',
          featured: true,
          tags: ['residential', 'solar-panels', 'grid-tied'],
          createdAt: '2025-08-20T14:30:00Z'
        },
        {
          id: '4',
          title: 'Renewable Energy Certificates (RECs)',
          description: 'Tradeable certificates representing the environmental benefits of renewable energy generation. Perfect for carbon offsetting.',
          category: 'green_certificate',
          ownerId: 'owner4',
          ownerName: 'Green Certificate Exchange',
          ownerVerified: true,
          pricing: {
            amount: 15.00,
            unit: 'certificate',
            currency: 'USD'
          },
          availability: {
            quantity: 5000,
            unit: 'certificates',
            availableFrom: '2025-09-01',
            availableUntil: '2025-12-31'
          },
          specifications: {
            certificationLevel: 'Green-e Certified',
            sustainabilityScore: 95
          },
          delivery: {
            methods: ['digital_certificate'],
            radius: 0,
            cost: 0,
            estimatedTime: 'Instant'
          },
          location: {
            city: 'Austin',
            state: 'TX',
            distance: 200
          },
          images: ['https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'],
          certifications: ['Green-e', 'NAREC', 'EPA Verified'],
          reviews: {
            averageRating: 4.8,
            totalReviews: 89
          },
          analytics: {
            views: 1890,
            inquiries: 234,
            sales: 145
          },
          status: 'active',
          featured: false,
          tags: ['carbon-offset', 'renewable', 'verified'],
          createdAt: '2025-08-28T11:20:00Z'
        },
        {
          id: '3',
          title: 'Wind Energy Storage System',
          description: 'Advanced battery storage system storing excess wind energy. Perfect for backup power and grid stabilization.',
          category: 'battery_storage',
          ownerId: 'owner3',
          ownerName: 'WindStore Technologies',
          ownerVerified: true,
          pricing: {
            amount: 120.00,
            unit: 'kWh',
            currency: 'USD',
            discounts: { bulk: 20, longTerm: 10 }
          },
          availability: {
            quantity: 200,
            unit: 'kWh',
            availableFrom: '2025-09-10',
            availableUntil: '2025-10-15'
          },
          specifications: {
            capacity: 50,
            efficiency: 95,
            certificationLevel: 'UL Listed',
            sustainabilityScore: 82
          },
          delivery: {
            methods: ['grid_injection', 'direct_supply'],
            radius: 75,
            cost: 200,
            estimatedTime: '1-3 days'
          },
          location: {
            city: 'Austin',
            state: 'TX',
            distance: 45
          },
          images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
          certifications: ['UL Listed', 'IEEE Standards', 'ISO 50001'],
          reviews: {
            averageRating: 4.7,
            totalReviews: 34
          },
          analytics: {
            views: 876,
            inquiries: 42,
            sales: 12
          },
          status: 'active',
          featured: false,
          tags: ['storage', 'grid-scale', 'backup'],
          createdAt: '2025-08-25T09:15:00Z'
        }
      ];

      // Apply filters
      let filteredProducts = mockProducts;
      
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
      }

      if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          filteredProducts.sort((a, b) => a.pricing.amount - b.pricing.amount);
          break;
        case 'price_high':
          filteredProducts.sort((a, b) => b.pricing.amount - a.pricing.amount);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.reviews.averageRating - a.reviews.averageRating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'distance':
          filteredProducts.sort((a, b) => (a.location.distance || 0) - (b.location.distance || 0));
          break;
        default: // featured
          filteredProducts.sort((a, b) => Number(b.featured) - Number(a.featured));
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (productId: string, quantity: number = 1) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '🌱';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-white mt-4">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Green Energy Marketplace
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Buy and sell clean energy solutions. Connect directly with green energy producers and contribute to a sustainable future.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search energy products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Method
                  </label>
                  <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white">
                    <option value="">All Methods</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="pipeline">Pipeline</option>
                    <option value="grid_injection">Grid Injection</option>
                    <option value="digital_certificate">Digital Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Distance
                  </label>
                  <select className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white">
                    <option value="">Any Distance</option>
                    <option value="25">Within 25 miles</option>
                    <option value="50">Within 50 miles</option>
                    <option value="100">Within 100 miles</option>
                    <option value="200">Within 200 miles</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300">
            {products.length} products found
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600' : 'bg-gray-700'}`}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-white rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
                <div className="bg-white rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600' : 'bg-gray-700'}`}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-white h-1 rounded"></div>
                <div className="bg-white h-1 rounded"></div>
                <div className="bg-white h-1 rounded"></div>
              </div>
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <Leaf className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or browse different categories.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
          }>
            {products.map(product => (
              <div
                key={product.id}
                className={`bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 ${
                  viewMode === 'grid' ? '' : 'flex'
                }`}
              >
                {/* Product Image */}
                <div className={`relative ${viewMode === 'grid' ? 'h-48' : 'w-64 h-48 flex-shrink-0'}`}>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {getCategoryIcon(product.category)} {product.category}
                    </span>
                  </div>
                  {product.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button className="bg-gray-900 bg-opacity-80 text-white p-1.5 rounded-full hover:bg-opacity-100 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="bg-gray-900 bg-opacity-80 text-white p-1.5 rounded-full hover:bg-opacity-100 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-2">{product.title}</h3>
                    <div className="flex items-center text-yellow-400 ml-2">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm ml-1">{product.reviews.averageRating}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>

                  {/* Owner Info */}
                  <div className="flex items-center mb-3">
                    <div className="text-sm">
                      <span className="text-gray-400">By </span>
                      <span className="text-emerald-400 font-medium">{product.ownerName}</span>
                      {product.ownerVerified && (
                        <Award className="inline h-4 w-4 text-emerald-500 ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    {product.specifications.purity && (
                      <div className="text-gray-400">
                        Purity: <span className="text-white">{product.specifications.purity}%</span>
                      </div>
                    )}
                    {product.specifications.efficiency && (
                      <div className="text-gray-400">
                        Efficiency: <span className="text-white">{product.specifications.efficiency}%</span>
                      </div>
                    )}
                    {product.specifications.capacity && (
                      <div className="text-gray-400">
                        Capacity: <span className="text-white">{product.specifications.capacity} kWh</span>
                      </div>
                    )}
                    <div className="text-gray-400">
                      Sustainability: <span className="text-emerald-400">{product.specifications.sustainabilityScore}%</span>
                    </div>
                  </div>

                  {/* Location and Delivery */}
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{product.location.city}, {product.location.state}</span>
                    {product.location.distance && (
                      <span className="ml-2">• {product.location.distance} miles away</span>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        ${product.pricing.amount}
                        <span className="text-sm text-gray-400 font-normal">/{product.pricing.unit}</span>
                      </div>
                      {product.pricing.discounts?.bulk && (
                        <div className="text-xs text-emerald-400">
                          {product.pricing.discounts.bulk}% bulk discount available
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-4 py-2 border border-emerald-600 text-emerald-400 rounded-lg font-medium hover:bg-emerald-900 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Analytics for site owners */}
                  {user?.role === 'USER' && product.ownerId === user._id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-white font-semibold">{product.analytics.views}</div>
                          <div className="text-gray-400">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">{product.analytics.inquiries}</div>
                          <div className="text-gray-400">Inquiries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">{product.analytics.sales}</div>
                          <div className="text-gray-400">Sales</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedProduct.title}</h2>
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="ml-1">{selectedProduct.reviews.averageRating}</span>
                    <span className="text-gray-400 ml-2">({selectedProduct.reviews.totalReviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    ${selectedProduct.pricing.amount}
                    <span className="text-lg text-gray-400 font-normal">/{selectedProduct.pricing.unit}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{selectedProduct.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Specifications</h3>
                  <div className="space-y-2">
                    {selectedProduct.specifications.purity && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Purity:</span>
                        <span className="text-white">{selectedProduct.specifications.purity}%</span>
                      </div>
                    )}
                    {selectedProduct.specifications.efficiency && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Efficiency:</span>
                        <span className="text-white">{selectedProduct.specifications.efficiency}%</span>
                      </div>
                    )}
                    {selectedProduct.specifications.capacity && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Capacity:</span>
                        <span className="text-white">{selectedProduct.specifications.capacity} kWh</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sustainability Score:</span>
                      <span className="text-emerald-400">{selectedProduct.specifications.sustainabilityScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Certification:</span>
                      <span className="text-white">{selectedProduct.specifications.certificationLevel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Availability & Delivery</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Available Quantity:</span>
                      <span className="text-white">{selectedProduct.availability.quantity} {selectedProduct.availability.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery Methods:</span>
                      <span className="text-white">{selectedProduct.delivery.methods.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery Cost:</span>
                      <span className="text-white">${selectedProduct.delivery.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Time:</span>
                      <span className="text-white">{selectedProduct.delivery.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery Radius:</span>
                      <span className="text-white">{selectedProduct.delivery.radius} miles</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => addToCart(selectedProduct.id)}
                  className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border border-emerald-600 text-emerald-400 rounded-lg font-medium hover:bg-emerald-900 transition-colors flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Badge */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="font-semibold">{cart.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreenEnergyMarketplace;