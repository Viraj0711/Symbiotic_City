import React from 'react';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../hooks/useMarketplace';

const Marketplace = () => {
  const { listings, loading, error } = useMarketplace();

  if (loading) {
    return (
      <section id="marketplace" className="py-16 lg:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading marketplace...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="marketplace" className="py-16 lg:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Error loading marketplace: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="marketplace" className="py-16 lg:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Sustainable Marketplace
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover eco-friendly products and services from local businesses committed to sustainability.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No marketplace listings available yet.</p>
            <p className="text-gray-500 mt-2">Be the first to add a sustainable product or service!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {listing.badge}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-600">{listing.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-300">{listing.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{listing.title}</h3>
                <p className="text-gray-400 mb-3">{listing.provider}</p>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">{listing.price}</span>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="text-center">
          <button className="inline-flex items-center space-x-2 bg-gray-800 border border-emerald-600 text-emerald-400 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-900 transition-all duration-200">
            <span>View All Listings</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;