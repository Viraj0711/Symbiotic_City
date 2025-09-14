import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, ExternalLink, Send, ArrowUp, MessageSquare, Headphones } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import QuickContactModal from './QuickContactModal';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { showNotification } = useNotification();

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate newsletter signup
    setTimeout(() => {
      setSubscriptionMessage('Thank you for subscribing!');
      setEmail('');
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionMessage(''), 3000);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const startLiveChat = () => {
    showNotification({
      type: 'info',
      title: 'Live Chat',
      message: 'Live chat feature would open here! Our support team is available 24/7.',
      duration: 4000
    });
  };
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Symbiotic City</span>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Building stronger, smarter, and more connected communities 
              for a sustainable future.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Stay Updated</h4>
              <form onSubmit={handleNewsletterSignup} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-r-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {subscriptionMessage && (
                  <p className="text-emerald-400 text-sm">{subscriptionMessage}</p>
                )}
              </form>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/symbioticCity" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Twitter</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://linkedin.com/company/symbioticCity" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://facebook.com/symbioticCity" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Facebook</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <div className="space-y-2">
              <Link to="/marketplace" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Marketplace
              </Link>
              <Link to="/community" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Community
              </Link>
              <Link to="/events" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Events
              </Link>
              <Link to="/projects" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Projects
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Help Center
              </Link>
              <Link to="/guidelines" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Guidelines
              </Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href="mailto:hello@symbioticCity.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors group"
              >
                <Mail className="h-4 w-4 text-emerald-400 group-hover:text-emerald-300" />
                <span>hello@symbioticCity.com</span>
              </a>
              <a 
                href="tel:+15551234567"
                className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors group"
              >
                <Phone className="h-4 w-4 text-emerald-400 group-hover:text-emerald-300" />
                <span>+1 (555) 123-4567</span>
              </a>
              <a 
                href="https://maps.google.com/?q=123+Green+Street+City"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors group"
              >
                <MapPin className="h-4 w-4 text-emerald-400 group-hover:text-emerald-300" />
                <span>123 Green Street, City</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              
              {/* Quick Contact Button */}
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors group mt-3 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400 group-hover:text-emerald-300" />
                <span>Quick Contact</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 Symbiotic City. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={startLiveChat}
                className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors group px-3 py-1 rounded-lg border border-gray-600 hover:border-emerald-400"
              >
                <Headphones className="h-4 w-4" />
                <span className="text-sm">Live Support</span>
              </button>
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors group"
              >
                <span>Back to top</span>
                <ArrowUp className="h-4 w-4 group-hover:transform group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <QuickContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;