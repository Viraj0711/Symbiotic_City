import express from 'express';

const router = express.Router();

interface EmergencyServiceQuery {
  lat: number;
  lng: number;
  radius?: number; // in miles, default 5
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

// Mock data for emergency services
// In a real application, this would integrate with Google Places API, Overpass API, or other mapping services
const mockEmergencyServices: EmergencyService[] = [
  {
    id: '1',
    name: 'Central Police Station',
    type: 'police',
    address: '123 Main Street, Downtown',
    phone: '(555) 123-4567',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7128,
    lng: -74.0060,
    website: 'https://example.com/police',
    hours: '24/7'
  },
  {
    id: '2',
    name: 'City General Hospital',
    type: 'hospital',
    address: '456 Health Ave, Medical District',
    phone: '(555) 234-5678',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7589,
    lng: -73.9851,
    website: 'https://example.com/hospital',
    hours: '24/7'
  },
  {
    id: '3',
    name: 'Fire Station 12',
    type: 'fire',
    address: '789 Safety Blvd, Emergency District',
    phone: '(555) 345-6789',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7282,
    lng: -74.0776,
    website: 'https://example.com/fire',
    hours: '24/7'
  },
  {
    id: '4',
    name: 'Westside Police Precinct',
    type: 'police',
    address: '321 West End Avenue',
    phone: '(555) 456-7890',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7831,
    lng: -73.9712,
    website: 'https://example.com/police-west',
    hours: '24/7'
  },
  {
    id: '5',
    name: 'Memorial Medical Center',
    type: 'hospital',
    address: '987 Care Lane, Healthcare Plaza',
    phone: '(555) 567-8901',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7505,
    lng: -73.9934,
    website: 'https://example.com/memorial',
    hours: '24/7'
  },
  {
    id: '6',
    name: 'Fire Station 7',
    type: 'fire',
    address: '654 Rescue Road',
    phone: '(555) 678-9012',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7300,
    lng: -74.0000,
    website: 'https://example.com/fire-7',
    hours: '24/7'
  },
  {
    id: '7',
    name: 'University Hospital',
    type: 'hospital',
    address: '741 Academic Way',
    phone: '(555) 789-0123',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7200,
    lng: -73.9800,
    website: 'https://example.com/university-hospital',
    hours: '24/7'
  },
  {
    id: '8',
    name: 'North Police Station',
    type: 'police',
    address: '852 Northern Blvd',
    phone: '(555) 890-1234',
    emergencyPhone: '911',
    distance: 0,
    isOpen: true,
    lat: 40.7900,
    lng: -74.0200,
    website: 'https://example.com/north-police',
    hours: '24/7'
  }
];

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959; // Earth's radius in miles
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
    const { lat, lng, radius = 5, type = 'all' } = req.query as any;

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
    // For now, return mock coordinates for demo purposes
    const mockCoordinates = {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Random location around NYC
      lng: -74.0060 + (Math.random() - 0.5) * 0.1
    };

    // Find services near the geocoded address
    const services = mockEmergencyServices.map(service => ({
      ...service,
      distance: calculateDistance(mockCoordinates.lat, mockCoordinates.lng, service.lat, service.lng)
    })).filter(service => service.distance <= 5)
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
