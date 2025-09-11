import express from 'express';

const router = express.Router();

interface EmergencyServiceQuery {
  lat: number;
  lng: number;
  radius?: number; // in kilometers, default 25 for Indian cities
  type?: 'police' | 'hospital' | 'fire' | 'all';
}

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

// Mock data for emergency services in major Indian cities
// In a real application, this would integrate with Google Places API, Overpass API, or other mapping services
const mockEmergencyServices: EmergencyService[] = [
  {
    id: '1',
    name: 'Mumbai Police Station - Colaba',
    type: 'police',
    address: 'Shahid Bhagat Singh Road, Colaba, Mumbai, Maharashtra 400001',
    phone: '+91-22-2202-0502',
    emergencyPhone: '100',
    distance: 0,
    isOpen: true,
    lat: 18.9067,
    lng: 72.8147,
    website: 'https://mumbaipolice.gov.in',
    hours: '24/7'
  },
  {
    id: '2',
    name: 'Fortis Hospital Mulund',
    type: 'hospital',
    address: 'Mulund Goregaon Link Road, Mulund West, Mumbai, Maharashtra 400078',
    phone: '+91-22-6754-4444',
    emergencyPhone: '102',
    distance: 0,
    isOpen: true,
    lat: 19.1722,
    lng: 72.9511,
    website: 'https://fortishealthcare.com',
    hours: '24/7'
  },
  {
    id: '3',
    name: 'Mumbai Fire Brigade Station 12',
    type: 'fire',
    address: 'LBS Road, Ghatkopar West, Mumbai, Maharashtra 400086',
    phone: '+91-22-2511-1111',
    emergencyPhone: '101',
    distance: 0,
    isOpen: true,
    lat: 19.0896,
    lng: 72.9081,
    website: 'https://mumbaifire.gov.in',
    hours: '24/7'
  },
  {
    id: '4',
    name: 'Delhi Police Station - Connaught Place',
    type: 'police',
    address: 'Connaught Place, New Delhi, Delhi 110001',
    phone: '+91-11-2334-4444',
    emergencyPhone: '100',
    distance: 0,
    isOpen: true,
    lat: 28.6304,
    lng: 77.2177,
    website: 'https://delhipolice.gov.in',
    hours: '24/7'
  },
  {
    id: '5',
    name: 'AIIMS New Delhi',
    type: 'hospital',
    address: 'Ansari Nagar, New Delhi, Delhi 110029',
    phone: '+91-11-2658-8500',
    emergencyPhone: '102',
    distance: 0,
    isOpen: true,
    lat: 28.5672,
    lng: 77.2100,
    website: 'https://aiims.edu',
    hours: '24/7'
  },
  {
    id: '6',
    name: 'Delhi Fire Service Station 7',
    type: 'fire',
    address: 'Kashmere Gate, Delhi 110006',
    phone: '+91-11-2396-4444',
    emergencyPhone: '101',
    distance: 0,
    isOpen: true,
    lat: 28.6667,
    lng: 77.2267,
    website: 'https://dfs.delhi.gov.in',
    hours: '24/7'
  },
  {
    id: '7',
    name: 'Bangalore Medical College Hospital',
    type: 'hospital',
    address: 'Fort Road, Chamarajpet, Bengaluru, Karnataka 560018',
    phone: '+91-80-2670-1150',
    emergencyPhone: '102',
    distance: 0,
    isOpen: true,
    lat: 12.9591,
    lng: 77.5797,
    website: 'https://bmcri.edu.in',
    hours: '24/7'
  },
  {
    id: '8',
    name: 'Bengaluru Police - Cubbon Park',
    type: 'police',
    address: 'Kasturba Road, Bengaluru, Karnataka 560001',
    phone: '+91-80-2294-2444',
    emergencyPhone: '100',
    distance: 0,
    isOpen: true,
    lat: 12.9719,
    lng: 77.5937,
    website: 'https://ksp.gov.in',
    hours: '24/7'
  }
];

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers (updated for Indian metric system)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// GET /api/emergency-services - Get nearby emergency services
router.get('/', (req, res) => {
  try {
    const { lat, lng, radius = 25, type = 'all' } = req.query as any;

    // Validate required parameters
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    // Validate coordinates
    if (isNaN(userLat) || isNaN(userLng) || userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    // Calculate distances and filter by radius
    let services = mockEmergencyServices.map(service => ({
      ...service,
      distance: calculateDistance(userLat, userLng, service.lat, service.lng)
    })).filter(service => service.distance <= searchRadius);

    // Filter by type if specified
    if (type !== 'all') {
      services = services.filter(service => service.type === type);
    }

    // Sort by distance
    services.sort((a, b) => a.distance - b.distance);

    // Limit to 20 results
    services = services.slice(0, 20);

    res.json({
      success: true,
      data: {
        services,
        count: services.length,
        location: { lat: userLat, lng: userLng },
        radius: searchRadius
      }
    });
  } catch (error) {
    console.error('Error fetching emergency services:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/emergency-services/:id - Get specific emergency service
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const service = mockEmergencyServices.find(s => s.id === id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Emergency service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching emergency service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/emergency-services/search/address - Geocode address and find nearby services
router.get('/search/address', (req, res) => {
  try {
    const { address } = req.query as any;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    // In a real application, you would use a geocoding service like Google Geocoding API
    // For now, return mock coordinates for demo purposes (Mumbai coordinates)
    const mockCoordinates = {
      lat: 19.0760 + (Math.random() - 0.5) * 0.1, // Random location around Mumbai
      lng: 72.8777 + (Math.random() - 0.5) * 0.1
    };

    // Find services near the geocoded address
    const services = mockEmergencyServices.map(service => ({
      ...service,
      distance: calculateDistance(mockCoordinates.lat, mockCoordinates.lng, service.lat, service.lng)
    })).filter(service => service.distance <= 25) // Updated to 25km radius
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20);

    res.json({
      success: true,
      data: {
        services,
        count: services.length,
        location: mockCoordinates,
        address
      }
    });
  } catch (error) {
    console.error('Error geocoding address:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
