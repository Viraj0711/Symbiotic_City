import React from 'react';
import EmergencyServicesFixed from '../components/EmergencyServicesFixed';

const EmergencyServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency Services</h1>
          <p className="text-gray-600">
            Find nearby emergency services including police stations, hospitals, and fire stations.
            Your safety is our priority.
          </p>
        </div>
        <EmergencyServicesFixed />
      </div>
    </div>
  );
};

export default EmergencyServicesPage;