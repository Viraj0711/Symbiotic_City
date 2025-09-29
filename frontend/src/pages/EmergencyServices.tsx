import React from 'react';
import EmergencyServicesFixed from '../components/EmergencyServicesFixed';
import { useLanguage } from '../contexts/LanguageContext';

const EmergencyServicesPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('emergencyPage.title')}</h1>
          <p className="text-gray-600">
            {t('emergencyPage.description')}
          </p>
        </div>
        <EmergencyServicesFixed />
      </div>
    </div>
  );
};

export default EmergencyServicesPage;