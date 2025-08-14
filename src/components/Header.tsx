import React, { useState } from 'react';
import { Menu, X, Leaf, Bell, User, Search, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
    <header className="bg-gray-900 shadow-sm border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Symbiotic City</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#marketplace" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
              Marketplace
            </a>
            <a href="#community" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
              Community
            </a>
            <a href="#events" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
              Events
            </a>
            <a href="#projects" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
              Projects
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Welcome, {user.user_metadata?.name || user.email}</span>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleAuthClick('signin')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleAuthClick('signup')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-emerald-400 hover:bg-gray-800 transition-all duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-3">
              <a href="#marketplace" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
                Marketplace
              </a>
              <a href="#community" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
                Community
              </a>
              <a href="#events" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
                Events
              </a>
              <a href="#projects" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
                Projects
              </a>
              <div className="pt-3 border-t border-gray-700">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>
              {!user && (
                <div className="pt-3 border-t border-gray-700 flex flex-col space-y-2">
                  <button 
                    onClick={() => handleAuthClick('signin')}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium text-left"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleAuthClick('signup')}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    
    <AuthModal 
      isOpen={authModalOpen} 
      onClose={() => setAuthModalOpen(false)} 
      initialMode={authMode}
    />
    </>
  );
};

export default Header;