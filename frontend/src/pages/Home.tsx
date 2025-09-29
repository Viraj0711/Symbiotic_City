import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Projects from '../components/Projects';
import Events from '../components/Events';
import Marketplace from '../components/Marketplace';

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen" style={{backgroundColor: '#E2EAD6'}}>
      <Hero />
      <Features />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{color: '#059669'}}>
              {t('home.communityHighlights')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.communityHighlightsSubtext')}
            </p>
          </div>
          
          {/* Featured Projects Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8" style={{color: '#059669'}}>{t('home.featuredProjects')}</h3>
            <Projects limit={3} />
          </div>
          
          {/* Upcoming Events Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8" style={{color: '#059669'}}>{t('home.upcomingEvents')}</h3>
            <Events limit={3} />
          </div>
          
          {/* Marketplace Preview */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8" style={{color: '#059669'}}>{t('home.marketplace')}</h3>
            <Marketplace limit={4} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
