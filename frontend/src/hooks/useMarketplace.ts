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
    price: '$25/week',
    provider: 'Green Valley Farm',
    location: 'Farm District',
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
    title: 'Handmade Pottery Set',
    description: 'Beautiful ceramic bowls and mugs crafted by local artisans. Perfect for your kitchen or as gifts.',
    category: 'Crafts & Art',
    price: '$45',
    provider: 'Clay Works Studio',
    location: 'Arts Quarter',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Handmade',
    author_id: 'artist1',
    created_at: '2024-02-03T14:30:00Z',
    type: 'sell',
    condition: 'new'
  },
  {
    id: '3',
    title: 'Bike Repair Services',
    description: 'Professional bike maintenance and repair. Quick turnaround, fair prices, and eco-friendly practices.',
    category: 'Services',
    price: '$20-60',
    provider: 'Cycle Fix Pro',
    location: 'Transportation Hub',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Professional',
    author_id: 'service1',
    created_at: '2024-02-05T09:15:00Z',
    type: 'sell',
    condition: 'good'
  },
  {
    id: '4',
    title: 'Free Compost Bin',
    description: 'Giving away a large compost bin. Perfect condition, just upgrading to a larger one. Help reduce waste!',
    category: 'Garden & Outdoor',
    price: 'Free',
    provider: 'Sarah M.',
    location: 'Residential Area',
    rating: 5.0,
    image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Free',
    author_id: 'resident1',
    created_at: '2024-02-07T11:20:00Z',
    type: 'free',
    condition: 'good'
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