import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('aboutPage.hero.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('aboutPage.hero.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('aboutPage.mission.title')}</h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('aboutPage.mission.description1')}
              </p>
              <p className="text-gray-600">
                {t('aboutPage.mission.description2')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-32 h-32 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t('aboutPage.values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutPage.values.communityFirst.title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.values.communityFirst.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutPage.values.environmentalImpact.title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.values.environmentalImpact.description')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutPage.values.innovationAction.title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.values.innovationAction.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="bg-green-600 rounded-lg text-white p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t('aboutPage.impact.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,847</div>
              <div className="text-green-100">{t('aboutPage.impact.members')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">156</div>
              <div className="text-green-100">{t('aboutPage.impact.projects')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,245</div>
              <div className="text-green-100">{t('aboutPage.impact.co2Saved')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">89%</div>
              <div className="text-green-100">{t('aboutPage.impact.satisfaction')}</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t('aboutPage.howItWorks.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutPage.howItWorks.step1.title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.howItWorks.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutPage.howItWorks.step2.title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.howItWorks.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('aboutPage.howItWorks.step3.title')}</h3>
              <p className="text-gray-600">
                {t('aboutPage.howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t('aboutPage.team.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="/api/placeholder/120/120"
                alt="Team member"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">{t('aboutPage.team.sarahChen.name')}</h3>
              <p className="text-green-600 mb-2">{t('aboutPage.team.sarahChen.role')}</p>
              <p className="text-gray-600 text-sm">
                {t('aboutPage.team.sarahChen.description')}
              </p>
            </div>

            <div className="text-center">
              <img
                src="/api/placeholder/120/120"
                alt="Team member"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">{t('aboutPage.team.marcusJohnson.name')}</h3>
              <p className="text-green-600 mb-2">{t('aboutPage.team.marcusJohnson.role')}</p>
              <p className="text-gray-600 text-sm">
                {t('aboutPage.team.marcusJohnson.description')}
              </p>
            </div>

            <div className="text-center">
              <img
                src="/api/placeholder/120/120"
                alt="Team member"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">{t('aboutPage.team.lisaRodriguez.name')}</h3>
              <p className="text-green-600 mb-2">{t('aboutPage.team.lisaRodriguez.role')}</p>
              <p className="text-gray-600 text-sm">
                {t('aboutPage.team.lisaRodriguez.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('aboutPage.callToAction.title')}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('aboutPage.callToAction.description')}
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors">
            {t('aboutPage.callToAction.button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
