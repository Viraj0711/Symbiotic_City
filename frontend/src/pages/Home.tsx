import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Projects from '../components/Projects';
import Events from '../components/Events';
import Marketplace from '../components/Marketplace';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#E2EAD6'}}>
      <Hero />
      <Features />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Community Highlights
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover ongoing projects, upcoming events, and sustainable marketplace items
            </p>
          </div>
          
          {/* Featured Projects Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">Featured Projects</h3>
            <Projects limit={3} />
          </div>
          
          {/* Upcoming Events Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">Upcoming Events</h3>
            <Events limit={3} />
          </div>
          
          {/* Marketplace Preview */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8">Marketplace</h3>
            <Marketplace limit={4} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
