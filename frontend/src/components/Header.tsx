import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import SearchBar from './SearchBar';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
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
    <header className="bg-gray-50 shadow-sm border-b border-gray-200">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg" style={{backgroundColor: '#059669'}}>
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Symbiotic City</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8">
            <Link 
              to="/marketplace" 
              className={`${isActivePath('/marketplace') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base`}
            >
              {t('header.marketplace')}
            </Link>
            <Link 
              to="/community" 
              className={`${isActivePath('/community') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base`}
            >
              {t('header.community')}
            </Link>
            <Link 
              to="/events" 
              className={`${isActivePath('/events') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base`}
            >
              {t('header.events')}
            </Link>
            <Link 
              to="/projects" 
              className={`${isActivePath('/projects') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base`}
            >
              {t('header.projects')}
            </Link>
            <Link 
              to="/emergency" 
              className={`${isActivePath('/emergency') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'} transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base`}
            >
              {t('header.emergency')}
            </Link>
            <Link 
              to="/about" 
              className={`${isActivePath('/about') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base`}
            >
              {t('header.about')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
            <SearchBar className="w-60 lg:w-72 xl:w-80" />
            <LanguageSelector />
            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            {user ? (
              <div className="flex items-center space-x-1 lg:space-x-2">
                <Link 
                  to="/"
                  className={`${isActivePath('/') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base`}
                >
                  {t('header.home')}
                </Link>
                <Link 
                  to="/dashboard"
                  className={`flex items-center space-x-2 p-1 ${isActivePath('/dashboard') ? 'text-green-600' : 'text-gray-400 hover:text-green-600'} transition-colors duration-200`}
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className={`w-8 h-8 rounded-full object-cover border-2 ${isActivePath('/dashboard') ? 'border-green-500' : 'border-gray-300 hover:border-green-500'} transition-colors`}
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
              <div className="flex items-center space-x-1 lg:space-x-2">
                <button 
                  onClick={() => handleAuthNavigation('/login')}
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium whitespace-nowrap text-sm lg:text-base"
                >
                  {t('header.signIn')}
                </button>
                <button 
                  onClick={() => handleAuthNavigation('/signup')}
                  className="bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 whitespace-nowrap text-sm lg:text-base"
                >
                  {t('header.signUp')}
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
            <div className="flex flex-col space-y-4">
              <Link 
                to="/marketplace" 
                className={`${isActivePath('/marketplace') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium py-1`}
              >
                {t('header.marketplace')}
              </Link>
              <Link 
                to="/community" 
                className={`${isActivePath('/community') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium py-1`}
              >
                {t('header.community')}
              </Link>
              <Link 
                to="/events" 
                className={`${isActivePath('/events') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium py-1`}
              >
                {t('header.events')}
              </Link>
              <Link 
                to="/projects" 
                className={`${isActivePath('/projects') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium py-1`}
              >
                {t('header.projects')}
              </Link>
              <Link 
                to="/emergency" 
                className={`${isActivePath('/emergency') ? 'text-red-600' : 'text-gray-600 hover:text-red-600'} transition-colors duration-200 font-medium py-1`}
              >
                {t('header.emergency')}
              </Link>
              <Link 
                to="/about" 
                className={`${isActivePath('/about') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium py-1`}
              >
                {t('header.about')}
              </Link>
              <div className="pt-3 border-t border-gray-200">
                <SearchBar 
                  placeholder="Search..."
                  className="w-full"
                  showSuggestions={false}
                />
              </div>
              <div className="pt-2">
                <LanguageSelector />
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
                  <Link 
                    to="/dashboard" 
                    className={`${isActivePath('/dashboard') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'} transition-colors duration-200 font-medium`}
                  >
                    {t('header.dashboard')}
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-left text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
                  >
                    {t('header.signOut')}
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
                  <button 
                    onClick={() => handleAuthNavigation('/login')}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium text-left"
                  >
                    {t('header.signIn')}
                  </button>
                  <button 
                    onClick={() => handleAuthNavigation('/signup')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    {t('header.signUp')}
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