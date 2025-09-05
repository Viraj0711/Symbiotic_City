import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SearchResults from './pages/SearchResults';

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
  Profile,
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
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/events" element={<Events />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/community" element={<Community />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
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