import React from 'react';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';

const Marketplace = () => {
  const listings = [
    {
      id: 1,
      title: 'Solar Panel Installation',
      category: 'Energy',
      provider: 'Green Tech Solutions',
      rating: 4.9,
      location: 'Downtown District',
      price: 'From $2,500',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Certified'
    },
    {
      id: 2,
      title: 'Community Garden Plots',
      category: 'Agriculture',
      provider: 'Urban Farmers Co-op',
      rating: 4.8,
      location: 'Riverside Area',
      price: '$50/month',
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Popular'
    },
    {
      id: 3,
      title: 'Bike Sharing Service',
      category: 'Transport',
      provider: 'EcoRide Network',
      rating: 4.7,
      location: 'City Wide',
      price: '$15/day',
      image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'New'
    }
  ];

  return (
    <section id="marketplace" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Sustainable Marketplace
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover eco-friendly products and services from local businesses committed to sustainability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
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
                    <span className="text-sm font-medium text-gray-700">{listing.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-3">{listing.provider}</p>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">{listing.price}</span>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center space-x-2 bg-white border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200">
            <span>View All Listings</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;