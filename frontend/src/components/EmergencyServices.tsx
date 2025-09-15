import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import emergencyServicesService, { EmergencyService as APIEmergencyService } from '../services/emergencyServices';

// Fix default marker icons for Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface EmergencyService extends APIEmergencyService {}

interface UserLocation {
  lat: number;
  lng: number;
}

// Custom icons for different service types
const createCustomIcon = (type: string, color: string) => {
  return L.divIcon({
    html: `
      <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        ${getServiceIconSVG(type)}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const getServiceIconSVG = (type: string) => {
  switch (type) {
    case 'police':
      return '<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>';
    case 'hospital':
      return '<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6v2h16V6c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zm0 12h16v-2H4v2z"/></svg>';
    case 'fire':
      return '<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M13.5 0.5C13.5 0.5 21 8 21 14C21 17.3137 18.3137 20 15 20C11.6863 20 9 17.3137 9 14C9 11 10.5 9.5 10.5 9.5C10.5 9.5 12 8 13 11C13 11 15 10 15 12.5C15 12.5 17 11.5 17 14C17 15.3284 16.3284 16.5 15 16.5C13.6716 16.5 13 15.3284 13 14C13 14 12 14.5 12 16C12 17.6569 13.3431 19 15 19C16.6569 19 18 17.6569 18 16C18 16 21 15 21 14C21 8 13.5 0.5 13.5 0.5Z"/></svg>';
    default:
      return '<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';
  }
};

const getServiceColor = (type: string) => {
  switch (type) {
    case 'police':
      return '#3B82F6'; // Blue
    case 'hospital':
      return '#EF4444'; // Red
    case 'fire':
      return '#F97316'; // Orange
    default:
      return '#6B7280'; // Gray
  }
};

// Component to handle map centering when user location changes
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (map && center && center.length === 2) {
      try {
        map.setView(center, 13);
      } catch (error) {
        console.error('Error setting map view:', error);
      }
    }
  }, [map, center]);
  
  return null;
};

const EmergencyServices: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'police' | 'hospital' | 'fire'>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]); // Default to Mumbai

  useEffect(() => {
    loadEmergencyServices();
  }, []);

  // Handle map errors
  useEffect(() => {
    const handleMapError = () => {
      console.error('Map failed to load, showing fallback');
      setMapError(true);
      setMapLoading(false);
    };

    // Set a timeout to show error if map doesn't load within 10 seconds
    const mapTimeout = setTimeout(() => {
      if (mapLoading && !mapError) {
        handleMapError();
      }
    }, 10000);

    return () => clearTimeout(mapTimeout);
  }, [mapLoading, mapError]);

  const loadEmergencyServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user location
      const location = await emergencyServicesService.getCurrentLocation();
      setUserLocation(location);
      setMapCenter([location.lat, location.lng]);

      // Fetch nearby emergency services
      const response = await emergencyServicesService.getNearbyServices(
        location.lat,
        location.lng,
        25, // 25 km radius for Indian cities
        'all'
      );

      setServices(response.data.services);
      setMapLoading(false);
    } catch (error) {
      console.error('Error loading emergency services:', error);
      setError('Unable to retrieve your location or emergency services. Showing default services in Mumbai.');
      
      // Fall back to Mumbai with Indian mock data
      const mumbaiLocation = { lat: 19.0760, lng: 72.8777 };
      setUserLocation(mumbaiLocation);
      setMapCenter([mumbaiLocation.lat, mumbaiLocation.lng]);
      
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
      setMapLoading(false);
    } finally {
      setLoading(false);
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
        <span className="ml-3 text-gray-600">Getting your location...</span>
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
            <p className="text-red-700">For immediate emergencies, dial 100 (Police), 101 (Fire), 108 (Ambulance)</p>
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
            <span className="text-green-800">Location detected - showing nearest emergency services within 25km</span>
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

      {/* Interactive Map */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 w-full relative">
          {mapLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          {mapError ? (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Map unavailable</h3>
                <p className="text-gray-600">Unable to load the map. You can still view emergency services below.</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%', minHeight: '384px' }}
              className="z-0"
              whenReady={() => setMapLoading(false)}
            >
              <MapController center={mapCenter} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location marker */}
              {userLocation && (
                <Marker 
                  position={[userLocation.lat, userLocation.lng]}
                  icon={L.divIcon({
                    html: `
                      <div style="background-color: #10B981; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
                      </div>
                    `,
                    className: 'user-location-marker',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  })}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>Your Location</strong>
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Emergency service markers */}
              {filteredServices.map((service) => (
                <Marker
                  key={service.id}
                  position={[service.lat, service.lng]}
                  icon={createCustomIcon(service.type, getServiceColor(service.type))}
                >
                  <Popup>
                    <div className="max-w-sm">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-full`} style={{ backgroundColor: getServiceColor(service.type) }}>
                          <div dangerouslySetInnerHTML={{ __html: getServiceIconSVG(service.type) }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.distance.toFixed(1)} km away</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3 text-sm">{service.address}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">{service.phone}</span>
                        </div>
                        
                        {service.emergencyPhone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.181 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-red-600 font-medium">Emergency: {service.emergencyPhone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${service.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`${service.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            {service.isOpen ? 'Open 24/7' : 'Closed'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => callService(service.phone)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
                        >
                          Call
                        </button>
                        <button
                          onClick={() => openDirections(service)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
                        >
                          Directions
                        </button>
                        {service.emergencyPhone && (
                          <button
                            onClick={() => callService(service.emergencyPhone!)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
                          >
                            Emergency
                          </button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Emergency Services Cards (fallback or additional view) */}
      {(mapError || filteredServices.length > 0) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {mapError ? 'Emergency Services Near You' : 'Service Details'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full flex-shrink-0`} style={{ backgroundColor: getServiceColor(service.type) }}>
                    <div className="w-5 h-5 text-white" dangerouslySetInnerHTML={{ __html: getServiceIconSVG(service.type) }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">{service.name}</h4>
                      <span className="text-sm text-gray-500 ml-2">{service.distance.toFixed(1)} km</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.address}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => callService(service.phone)}
                        className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
                      >
                        Call
                      </button>
                      <button
                        onClick={() => openDirections(service)}
                        className="flex-1 min-w-0 bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
                      >
                        Directions
                      </button>
                      {service.emergencyPhone && (
                        <button
                          onClick={() => callService(service.emergencyPhone!)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
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
        </div>
      )}

      {/* Map Legend - only show when map is working */}
      {!mapError && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Map Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border border-white shadow"></div>
              <span className="text-sm text-gray-700">Your Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full border border-white shadow"></div>
              <span className="text-sm text-gray-700">Police Stations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full border border-white shadow"></div>
              <span className="text-sm text-gray-700">Hospitals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-600 rounded-full border border-white shadow"></div>
              <span className="text-sm text-gray-700">Fire Stations</span>
            </div>
          </div>
        </div>
      )}

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

export default EmergencyServices;
