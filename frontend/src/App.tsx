import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SearchResults from './pages/SearchResults';
import GreenEnergyMarketplace from './components/GreenEnergyMarketplace';
import SiteOwnerDashboard from './components/SiteOwnerDashboard';

// Import all pages
import {
  Home,
  Projects,
  Events,
  Marketplace,
  Community,
  Dashboard,
  About,
  Contact,
  Settings,
  HelpCenter,
  PrivacyPolicy,
  TermsOfService,
  Guidelines,
  Login,
  Signup,
  ForgotPassword
} from './pages';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/events" element={<Events />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/green-energy-marketplace" element={<GreenEnergyMarketplace />} />
                <Route path="/site-owner-dashboard" element={<SiteOwnerDashboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;