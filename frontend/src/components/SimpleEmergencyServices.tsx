import React, { useState, useEffect } from 'react';
import emergencyServicesService from '../services/emergencyServices';

interface EmergencyService {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire';
  address: string;
  phone: string;
  emergencyPhone?: string;
  distance: number;
  isOpen: boolean;
  lat: number;
  lng: number;
  website?: string;
  hours?: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

const SimpleEmergencyServices: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'police' | 'hospital' | 'fire'>('all');

  useEffect(() => {
    loadEmergencyServices();
  }, []);

  const loadEmergencyServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fall back to Mumbai with Indian mock data immediately for testing
      const mumbaiLocation = { lat: 19.0760, lng: 72.8777 };
      setUserLocation(mumbaiLocation);
      
      const mockServices: EmergencyService[] = [
        {
          id: '1',
          name: 'Mumbai Police Station - Colaba',
          type: 'police',
          address: 'Shahid Bhagat Singh Road, Colaba, Mumbai, Maharashtra 400001',
          phone: '+91-22-2202-0502',
          emergencyPhone: '100',
          distance: 0.8,
          isOpen: true,
          lat: 18.9067,
          lng: 72.8147
        },
        {
          id: '2',
          name: 'Fortis Hospital Mulund',
          type: 'hospital',
          address: 'Mulund Goregaon Link Road, Mulund West, Mumbai, Maharashtra 400078',
          phone: '+91-22-6754-4444',
          emergencyPhone: '102',
          distance: 1.2,
          isOpen: true,
          lat: 19.1722,
          lng: 72.9511
        },
        {
          id: '3',
          name: 'Mumbai Fire Brigade Station 12',
          type: 'fire',
          address: 'LBS Road, Ghatkopar West, Mumbai, Maharashtra 400086',
          phone: '+91-22-2511-1111',
          emergencyPhone: '101',
          distance: 0.5,
          isOpen: true,
          lat: 19.0896,
          lng: 72.9081
        }
      ];
      setServices(mockServices);
    } catch (error) {
      console.error('Error loading emergency services:', error);
      setError('Unable to load emergency services.');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'police':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'hospital':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'fire':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1-4 4-4 1.657 0 3 .895 3 2 0 1-1 2-1 2s3 1 3 3c0 .83-.327 1.58-.857 2.121z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'police':
        return 'text-blue-600 bg-blue-100';
      case 'hospital':
        return 'text-red-600 bg-red-100';
      case 'fire':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredServices = selectedType === 'all' 
    ? services 
    : services.filter(service => service.type === selectedType);

  const openDirections = (service: EmergencyService) => {
    emergencyServicesService.openDirections(service, userLocation || undefined);
  };

  const callService = (phone: string) => {
    emergencyServicesService.makeCall(phone);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-600">Loading emergency services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 text-white p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Emergency Services</h3>
            <p className="text-red-700">For immediate emergencies, dial 100 (Police), 101 (Fire), 102 (Ambulance)</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <button
              onClick={() => callService('100')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Call 100
            </button>
            <button
              onClick={() => callService('101')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Call 101
            </button>
            <button
              onClick={() => callService('102')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Call 102
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {/* Location Info */}
      {userLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-green-800">Showing emergency services in Mumbai (Demo Mode)</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Services', count: services.length },
              { key: 'police', label: 'Police', count: services.filter(s => s.type === 'police').length },
              { key: 'hospital', label: 'Hospitals', count: services.filter(s => s.type === 'hospital').length },
              { key: 'fire', label: 'Fire Stations', count: services.filter(s => s.type === 'fire').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedType(tab.key as typeof selectedType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedType === tab.key
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${getServiceColor(service.type)}`}>
                {getServiceIcon(service.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span className="text-sm text-gray-500">{service.distance.toFixed(1)} km</span>
                </div>
                
                <p className="text-gray-600 mb-3">{service.address}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{service.phone}</span>
                  </div>
                  
                  {service.emergencyPhone && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-600 font-medium">Emergency: {service.emergencyPhone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${service.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm ${service.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {service.isOpen ? 'Open 24/7' : 'Closed'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => callService(service.phone)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Call
                  </button>
                  <button
                    onClick={() => openDirections(service)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                  >
                    Directions
                  </button>
                  {service.emergencyPhone && (
                    <button
                      onClick={() => callService(service.emergencyPhone!)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      Emergency
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5.9-6.127 2.386l-.134.065A5.978 5.978 0 006 20v2a1 1 0 001 1h10a1 1 0 001-1v-2a5.978 5.978 0 00.262-2.549l-.134-.065A7.962 7.962 0 0112 15.001z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try selecting a different service type</p>
        </div>
      )}
    </div>
  );
};

export default SimpleEmergencyServices;