import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
    <header className="bg-gray-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg" style={{backgroundColor: '#059669'}}>
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Symbiotic City</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <Link to="/marketplace" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                Marketplace
              </Link>
              <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/marketplace" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    General Marketplace
                  </Link>
                  <Link to="/green-energy-marketplace" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    🌱 Green Energy Market
                  </Link>
                  <Link to="/site-owner-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    ⚡ Site Owner Dashboard
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/community" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Community
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Events
            </Link>
            <Link to="/projects" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              Projects
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar className="w-80" />
            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/dashboard"
                  className="flex items-center space-x-2 p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 hover:border-green-500 transition-colors"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleAuthNavigation('/login')}
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleAuthNavigation('/signup')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-green-600 hover:bg-gray-50 transition-all duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link to="/marketplace" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                Marketplace
              </Link>
              <Link to="/community" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                Community
              </Link>
              <Link to="/events" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                Events
              </Link>
              <Link to="/projects" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                Projects
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                About
              </Link>
              <div className="pt-3 border-t border-gray-200">
                <SearchBar 
                  placeholder="Search..."
                  className="w-full"
                  showSuggestions={false}
                />
              </div>
              {user ? (
                <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
                  <div className="flex items-center space-x-3 pb-2">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                      />
                    ) : (
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#059669'}}>
                        {getUserInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                    Profile
                  </Link>
                  <Link to="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium">
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-left text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
                  <button 
                    onClick={() => handleAuthNavigation('/login')}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium text-left"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleAuthNavigation('/signup')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
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