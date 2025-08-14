import React from 'react';
import { ArrowRight, Users, Building2, TreePine, Leaf } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Co-create a
              <span className="text-emerald-600"> Sustainable</span> Future
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Connect with residents, businesses, and local authorities to build stronger, 
              smarter communities. Discover eco-friendly initiatives, share resources, 
              and collaborate on projects that make a real impact.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">10k+ Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">500+ Businesses</span>
              </div>
              <div className="flex items-center space-x-2">
                <TreePine className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">200+ Projects</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Join Community</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200">
                Explore Projects
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Green Initiative</h3>
                    <p className="text-sm text-gray-600">Community garden project</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-emerald-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                  <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full"></div>
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs text-gray-600">
                    +12
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;