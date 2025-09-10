import { useState, useEffect } from 'react';

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  provider: string;
  location: string;
  rating: number;
  image: string;
  badge: string;
  author_id: string;
  created_at: string;
  type: 'sell' | 'trade' | 'free';
  tradeFor?: string;
  condition?: 'new' | 'like-new' | 'good' | 'fair';
}

// Mock data for demonstration
const mockListings: MarketplaceListing[] = [
  {
    id: '1',
    title: 'Organic Vegetables Box',
    description: 'Fresh, locally grown organic vegetables delivered weekly. Support local farmers while eating healthy!',
    category: 'Food & Produce',
    price: '₹2,075/week',
    provider: 'Green Valley Farm',
    location: 'Pune, Maharashtra',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Organic',
    author_id: 'farmer1',
    created_at: '2024-02-01T10:00:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '2',
    title: 'Solar Panel Installation Kit',
    description: 'Complete residential solar panel system with inverter and mounting hardware. Reduce your energy bills by up to 80%!',
    category: 'Green Energy',
    price: '₹2,36,550',
    provider: 'SolarTech Solutions',
    location: 'Bengaluru, Karnataka',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'High Efficiency',
    author_id: 'solartech1',
    created_at: '2024-02-02T08:30:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '3',
    title: 'Wind Turbine - Small Scale',
    description: 'Perfect for residential use, this compact wind turbine generates clean energy for your home. Easy installation.',
    category: 'Green Energy',
    price: '₹99,600',
    provider: 'WindPower Co.',
    location: 'Rajkot, Gujarat',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Eco-Friendly',
    author_id: 'windpower1',
    created_at: '2024-02-02T12:15:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '4',
    title: 'Handmade Pottery Set',
    description: 'Beautiful ceramic bowls and mugs crafted by local artisans. Perfect for your kitchen or as gifts.',
    category: 'Crafts & Art',
    price: '₹3,735',
    provider: 'Clay Works Studio',
    location: 'Jaipur, Rajasthan',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Handmade',
    author_id: 'artist1',
    created_at: '2024-02-03T14:30:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '5',
    title: 'Energy Storage Battery',
    description: 'Lithium-ion battery system for storing solar energy. Works with existing solar installations.',
    category: 'Green Energy',
    price: '₹1,53,550',
    provider: 'BatteryMax Inc.',
    location: 'Hyderabad, Telangana',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Long-lasting',
    author_id: 'batterymax1',
    created_at: '2024-02-04T10:45:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '6',
    title: 'Bike Repair Services',
    description: 'Professional bike maintenance and repair. Quick turnaround, fair prices, and eco-friendly practices.',
    category: 'Services',
    price: '₹1,660-4,980',
    provider: 'Cycle Fix Pro',
    location: 'Mumbai, Maharashtra',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Professional',
    author_id: 'service1',
    created_at: '2024-02-05T09:15:00Z',
    type: 'sell',
    condition: 'good'
  },
  {
    id: '7',
    title: 'Smart Energy Monitor',
    description: 'Track your home energy usage in real-time. Compatible with smart home systems and mobile apps.',
    category: 'Green Energy',
    price: '₹7,387',
    provider: 'EcoMonitor Tech',
    location: 'Bengaluru, Karnataka',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Smart Tech',
    author_id: 'ecomonitor1',
    created_at: '2024-02-06T16:20:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '8',
    title: 'Free Compost Bin',
    description: 'Giving away a large compost bin. Perfect condition, just upgrading to a larger one. Help reduce waste!',
    category: 'Garden & Outdoor',
    price: 'Free',
    provider: 'Priya M.',
    location: 'Chandigarh',
    rating: 5.0,
    image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Free',
    author_id: 'resident1',
    created_at: '2024-02-07T11:20:00Z',
    type: 'free',
    condition: 'good'
  },
  {
    id: '9',
    title: 'Geothermal Heat Pump',
    description: 'Efficient heating and cooling system that uses earth\'s natural temperature. Professional installation available.',
    category: 'Green Energy',
    price: '₹2,90,500',
    provider: 'GeoThermal Pro',
    location: 'Coimbatore, Tamil Nadu',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/159376/construction-site-build-construction-work-159376.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Professional',
    author_id: 'geothermal1',
    created_at: '2024-02-08T13:30:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '10',
    title: 'Recycled Furniture Set',
    description: 'Beautiful dining table and chairs made from reclaimed wood. Unique pieces with character and history.',
    category: 'Furniture',
    price: '₹26,560',
    provider: 'Reclaimed Creations',
    location: 'Delhi NCR',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Reclaimed',
    author_id: 'reclaimed1',
    created_at: '2024-02-09T15:45:00Z',
    type: 'sell',
    condition: 'like-new'
  }
];

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      setListings(mockListings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return { listings, loading, error, refetch: fetchListings };
};