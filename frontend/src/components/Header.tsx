import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAuthNavigation = (path: '/login' | '/signup') => {
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 mr-8">
            <div className="p-2 rounded-lg bg-emerald-600 shadow-sm">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Symbiotic City</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            <Link 
              to="/marketplace" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePath('/marketplace') 
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Marketplace
            </Link>
            <Link 
              to="/community" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePath('/community') 
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Community
            </Link>
            <Link 
              to="/events" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePath('/events') 
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Events
            </Link>
            <Link 
              to="/projects" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePath('/projects') 
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Projects
            </Link>
            <Link 
              to="/emergency" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePath('/emergency') 
                  ? 'text-red-600 bg-red-50 shadow-sm' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Emergency
            </Link>
            <Link 
              to="/about" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActivePath('/about') 
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm' 
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <div className="hidden lg:block">
              <SearchBar className="w-72" />
            </div>
            <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors duration-200 rounded-lg hover:bg-gray-50">
              <Bell className="h-5 w-5" />
            </button>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath('/') 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/dashboard"
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActivePath('/dashboard') 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-400 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className={`w-8 h-8 rounded-full object-cover border-2 transition-colors ${
                        isActivePath('/dashboard') 
                          ? 'border-emerald-500' 
                          : 'border-gray-300 hover:border-emerald-500'
                      }`}
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-emerald-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleAuthNavigation('/login')}
                  className="px-4 py-2 text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleAuthNavigation('/signup')}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-gray-50 transition-all duration-200 ml-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 space-y-1">
              <Link 
                to="/marketplace" 
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath('/marketplace') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                to="/community" 
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath('/community') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/events" 
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath('/events') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/projects" 
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath('/projects') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/emergency" 
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath('/emergency') 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Emergency
              </Link>
              <Link 
                to="/about" 
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath('/about') 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-4 mt-2 border-t border-gray-200">
                <div className="px-2">
                  <SearchBar 
                    placeholder="Search..."
                    className="w-full"
                    showSuggestions={false}
                  />
                </div>
              </div>
              {user ? (
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                        {getUserInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link 
                      to="/dashboard" 
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActivePath('/dashboard') 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {handleSignOut(); setIsMenuOpen(false);}}
                      className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 mt-2 border-t border-gray-200 space-y-2">
                  <button 
                    onClick={() => {handleAuthNavigation('/login'); setIsMenuOpen(false);}}
                    className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {handleAuthNavigation('/signup'); setIsMenuOpen(false);}}
                    className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 shadow-sm"
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
    </>
  );
};

export default Header;