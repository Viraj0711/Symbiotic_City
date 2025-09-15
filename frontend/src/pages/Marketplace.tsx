import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace, MarketplaceListing } from '../hooks/useMarketplace';
import { useLanguage } from '../contexts/LanguageContext';

const Marketplace: React.FC = () => {
  const { listings, loading, error } = useMarketplace();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['all', 'Green Energy', 'Food & Produce', 'Crafts & Art', 'Services', 'Garden & Outdoor', 'Furniture', 'Electronics', 'Clothing', 'Books'];

  const getCategoryName = (category: string) => {
    if (category === 'all') return t('marketplacePage.allCategories');
    const categoryMap: { [key: string]: string } = {
      'Green Energy': t('marketplacePage.categories.greenEnergy'),
      'Food & Produce': t('marketplacePage.categories.foodProduce'),
      'Crafts & Art': t('marketplacePage.categories.craftsArt'),
      'Services': t('marketplacePage.categories.services'),
      'Garden & Outdoor': t('marketplacePage.categories.gardenOutdoor'),
      'Furniture': t('marketplacePage.categories.furniture'),
      'Electronics': t('marketplacePage.categories.electronics'),
      'Clothing': t('marketplacePage.categories.clothing'),
      'Books': t('marketplacePage.categories.books')
    };
    return categoryMap[category] || category;
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'sell': return t('marketplacePage.sell');
      case 'trade': return t('marketplacePage.trade');
      case 'free': return t('marketplacePage.free');
      default: return type.toUpperCase();
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return t('marketplacePage.new');
      case 'like-new': return t('marketplacePage.likeNew');
      case 'good': return t('marketplacePage.good');
      case 'fair': return t('marketplacePage.fair');
      default: return condition.replace('-', ' ').toUpperCase();
    }
  };

  // Handle different button actions
  const handleItemAction = (item: MarketplaceListing) => {
    // Navigate to product detail page for comprehensive interaction
    navigate(`/marketplace/product/${item.id}`);
  };

  const filteredItems = listings.filter((item: MarketplaceListing) => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} showImage={true} lines={2} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('marketplacePage.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('marketplacePage.description')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('marketplacePage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>

            {/* List Item Button */}
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              {t('marketplacePage.listItem')}
            </button>
          </div>
        </div>

        {/* Marketplace Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('marketplacePage.errorTitle')}</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('marketplacePage.noItemsTitle')}</h3>
            <p className="text-gray-600">{t('marketplacePage.noItemsDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'sell' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'trade' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getTypeText(item.type)}
                    </span>
                    <span className="text-sm text-gray-500">{getCategoryName(item.category)}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{item.description}</p>
                  
                  {/* Price */}
                  <div className="mb-3">
                    {item.type === 'sell' && (
                      <div className="text-xl font-bold text-green-600">{item.price}</div>
                    )}
                    {item.type === 'trade' && (
                      <div className="text-sm text-gray-600">{t('marketplacePage.tradeFor')} {item.tradeFor || t('marketplacePage.openToOffers')}</div>
                    )}
                    {item.type === 'free' && (
                      <div className="text-lg font-bold text-green-600">{t('marketplacePage.free')}</div>
                    )}
                  </div>
                  
                  {/* Item Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Condition Badge */}
                  {item.condition && (
                    <div className="mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.condition === 'new' ? 'bg-green-100 text-green-800' :
                        item.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                        item.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getConditionText(item.condition)}
                      </span>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleItemAction(item)}
                      className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm flex items-center justify-center space-x-2"
                    >
                      <span>{t('marketplacePage.viewDetails')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
