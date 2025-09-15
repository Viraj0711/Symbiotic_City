import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SearchProvider } from './contexts/SearchContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Lazy load all pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Events = lazy(() => import('./pages/Events'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Community = lazy(() => import('./pages/Community'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Guidelines = lazy(() => import('./pages/Guidelines'));
const EmergencyServices = lazy(() => import('./pages/EmergencyServices'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const SiteOwnerDashboard = lazy(() => import('./components/SiteOwnerDashboard'));

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SearchProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen" style={{backgroundColor: '#E2EAD6'}}>
              <Header />
              <main>
                <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="text-lg">Loading...</div></div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/marketplace/product/:id" element={<ProductDetail />} />
                    <Route path="/emergency" element={<EmergencyServices />} />
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
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </SearchProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
