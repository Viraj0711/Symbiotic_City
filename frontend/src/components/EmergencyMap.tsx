import React from 'react';

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

const EmergencyMap: React.FC<EmergencyMapProps> = ({ center, services, userLocation }) => {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center[1] - 0.01},${center[0] - 0.01},${center[1] + 0.01},${center[0] + 0.01}&layer=mapnik&marker=${center[0]},${center[1]}`;

  const openGoogleMaps = () => {
    const servicesParams = services.map(s => `${s.lat},${s.lng}`).join('|');
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${servicesParams}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden relative">
      {/* Embedded OpenStreetMap */}
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 'none', minHeight: '384px' }}
        title="Emergency Services Map"
        loading="lazy"
        className="w-full h-full"
      />
      
      {/* Overlay with services info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-2">📍 Your Location</h4>
        <p className="text-sm text-gray-600 mb-3">
          Showing {services.length} emergency services within 25km
        </p>
        
        <div className="space-y-2 text-sm">
          {services.slice(0, 3).map((service) => (
            <div key={service.id} className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                service.type === 'police' ? 'bg-blue-500' :
                service.type === 'hospital' ? 'bg-red-500' : 'bg-orange-500'
              }`}></span>
              <span className="font-medium">{service.name}</span>
              <span className="text-gray-500">({service.distance.toFixed(1)}km)</span>
            </div>
          ))}
          {services.length > 3 && (
            <p className="text-gray-500 italic">+{services.length - 3} more services</p>
          )}
        </div>

        <button
          onClick={openGoogleMaps}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
        >
          Open in Google Maps
        </button>
      </div>

      {/* Bottom overlay with emergency numbers */}
      <div className="absolute bottom-4 right-4 bg-red-600/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex space-x-2">
          <button
            onClick={() => window.open('tel:100', '_self')}
            className="bg-white/90 hover:bg-white text-red-600 font-bold py-1 px-3 rounded text-sm transition-colors"
          >
            Police 100
          </button>
          <button
            onClick={() => window.open('tel:101', '_self')}
            className="bg-white/90 hover:bg-white text-red-600 font-bold py-1 px-3 rounded text-sm transition-colors"
          >
            Fire 101
          </button>
          <button
            onClick={() => window.open('tel:102', '_self')}
            className="bg-white/90 hover:bg-white text-red-600 font-bold py-1 px-3 rounded text-sm transition-colors"
          >
            Ambulance 102
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;