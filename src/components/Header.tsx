import React, { useState } from 'react';
import { Menu, X, Leaf, Bell, User, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Symbiotic City</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#marketplace" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
              Marketplace
            </a>
            <a href="#community" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
              Community
            </a>
            <a href="#events" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
              Events
            </a>
            <a href="#projects" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
              Projects
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200">
              <User className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-all duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 py-4">
            <div className="flex flex-col space-y-3">
              <a href="#marketplace" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                Marketplace
              </a>
              <a href="#community" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                Community
              </a>
              <a href="#events" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                Events
              </a>
              <a href="#projects" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium">
                Projects
              </a>
              <div className="pt-3 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;