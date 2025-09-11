import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface EmergencyMapProps {
  center: [number, number];
  services: EmergencyService[];
  userLocation: UserLocation;
}

// Custom icons for different service types
const createCustomIcon = (type: string, color: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        ${type === 'police' ? '👮' : type === 'hospital' ? '🏥' : '🚒'}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const userLocationIcon = L.divIcon({
  html: `
    <div style="
      background-color: #3B82F6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
    </style>
  `,
  className: 'user-location-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

const EmergencyMap: React.FC<EmergencyMapProps> = ({ center, services, userLocation }) => {
  const getServiceColor = (type: string) => {
    switch (type) {
      case 'police':
        return '#2563EB'; // Blue
      case 'hospital':
        return '#DC2626'; // Red
      case 'fire':
        return '#EA580C'; // Orange
      default:
        return '#6B7280'; // Gray
    }
  };

  const callService = (phone: string) => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const openDirections = (service: EmergencyService) => {
    if (typeof window !== 'undefined') {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${service.lat},${service.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="emergency-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User location marker */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold text-blue-600">Your Location</h3>
            <p className="text-sm text-gray-600">Emergency services within 25km radius</p>
          </div>
        </Popup>
      </Marker>

      {/* Emergency service markers */}
      {services.map((service) => (
        <Marker
          key={service.id}
          position={[service.lat, service.lng]}
          icon={createCustomIcon(service.type, getServiceColor(service.type))}
        >
          <Popup maxWidth={300} className="emergency-popup">
            <div className="p-2">
              <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{service.address}</p>
              
              <div className="space-y-1 mb-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Phone:</span>
                  <span className="text-blue-600">{service.phone}</span>
                </div>
                
                {service.emergencyPhone && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Emergency:</span>
                    <span className="text-red-600 font-semibold">{service.emergencyPhone}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Distance:</span>
                  <span>{service.distance.toFixed(1)} km</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Status:</span>
                  <span className={service.isOpen ? 'text-green-600' : 'text-red-600'}>
                    {service.isOpen ? 'Open 24/7' : 'Closed'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => callService(service.phone)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm font-medium transition-colors"
                >
                  Call
                </button>
                <button
                  onClick={() => openDirections(service)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm font-medium transition-colors"
                >
                  Directions
                </button>
                {service.emergencyPhone && (
                  <button
                    onClick={() => callService(service.emergencyPhone!)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm font-medium transition-colors"
                  >
                    SOS
                  </button>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EmergencyMap;