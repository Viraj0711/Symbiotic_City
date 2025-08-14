import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
}

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('city_data')
        .select('*')
        .eq('type', 'marketplace')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedListings: MarketplaceListing[] = data?.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description || '',
        category: item.properties?.category || 'General',
        price: item.properties?.price || 'Contact for pricing',
        provider: item.properties?.provider || 'Local Provider',
        location: item.properties?.location || 'City Center',
        rating: item.properties?.rating || 4.5,
        image: item.properties?.image || 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400',
        badge: item.properties?.badge || 'Available',
        author_id: item.author_id,
        created_at: item.created_at,
      })) || [];

      setListings(formattedListings);
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