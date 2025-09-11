import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Indian Emergency Service Numbers
export const EMERGENCY_NUMBERS = {
  police: '100',        // Police Emergency
  ambulance: '102',     // Ambulance Services  
  fire: '101',         // Fire Services
  general: '112',      // Universal Emergency Number
  childHelpline: '1098', // Child Helpline
  womenHelpline: '1091', // Women Helpline
  disasterResponse: '108', // Emergency Medical Response
  trafficHelpline: '1073', // Traffic Helpline
  touristHelpline: '1363'  // Tourist Helpline
};

export const DEFAULT_RADIUS = 25; // km - Updated for Indian cities coverage

export interface EmergencyService {
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

export interface EmergencyServicesResponse {
  success: boolean;
  data: {
    services: EmergencyService[];
    count: number;
    location: { lat: number; lng: number };
    radius: number;
  };
}

export interface EmergencyServiceResponse {
  success: boolean;
  data: EmergencyService;
}

export interface AddressSearchResponse {
  success: boolean;
  data: {
    services: EmergencyService[];
    count: number;
    location: { lat: number; lng: number };
    address: string;
  };
}

class EmergencyServicesService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/emergency-services`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Get nearby emergency services based on user's location
   */
  async getNearbyServices(
    lat: number,
    lng: number,
    radius: number = 25, // Updated default radius to 25km for better coverage in Indian cities
    type: 'all' | 'police' | 'hospital' | 'fire' = 'all'
  ): Promise<EmergencyServicesResponse> {
    try {
      const response = await this.api.get('/', {
        params: { lat, lng, radius, type }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby emergency services:', error);
      throw new Error('Failed to fetch emergency services');
    }
  }

  /**
   * Get specific emergency service by ID
   */
  async getServiceById(id: string): Promise<EmergencyServiceResponse> {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching emergency service:', error);
      throw new Error('Failed to fetch emergency service');
    }
  }

  /**
   * Search for emergency services by address
   */
  async searchByAddress(address: string): Promise<AddressSearchResponse> {
    try {
      const response = await this.api.get('/search/address', {
        params: { address }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by address:', error);
      throw new Error('Failed to search by address');
    }
  }

  /**
   * Get user's current location using browser geolocation
   */
  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          let message = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers (updated for Indian metric system)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Open directions to a service using Google Maps
   */
  openDirections(service: EmergencyService, userLocation?: { lat: number; lng: number }): void {
    let url: string;
    
    if (userLocation) {
      // Use current location as starting point
      url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodeURIComponent(service.address)}`;
    } else {
      // Let Google Maps determine current location
      url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(service.address)}`;
    }
    
    window.open(url, '_blank');
  }

  /**
   * Make a phone call
   */
  makeCall(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
  }

  /**
   * Make emergency call to Indian services
   */
  makeEmergencyCall(type: keyof typeof EMERGENCY_NUMBERS): void {
    const number = EMERGENCY_NUMBERS[type];
    if (number) {
      this.makeCall(number);
    } else {
      console.error('Invalid emergency service type');
    }
  }

  /**
   * Open service website
   */
  openWebsite(url: string): void {
    window.open(url, '_blank');
  }
}

export const emergencyServicesService = new EmergencyServicesService();
export default emergencyServicesService;
