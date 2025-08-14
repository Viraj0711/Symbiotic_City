import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Symbiotic City</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Building stronger, smarter, and more connected communities 
              for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                LinkedIn
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Facebook
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Marketplace
              </a>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Community
              </a>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Events
              </a>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Projects
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Help Center
              </a>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Guidelines
              </a>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-300">hello@symbioticCity.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-300">123 Green Street, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Symbiotic City. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;