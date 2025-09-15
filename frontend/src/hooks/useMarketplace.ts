import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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

// Base marketplace data without translations
const baseListings = [
  {
    id: '1',
    price: '₹2,075/week',
    location: 'Pune, Maharashtra',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'farmer1',
    created_at: '2024-02-01T10:00:00Z',
    type: 'sell' as const,
    condition: 'new' as const
  },
  {
    id: '2',
    price: '₹2,36,550',
    location: 'Bengaluru, Karnataka',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'solartech1',
    created_at: '2024-02-02T08:30:00Z',
    type: 'sell' as const,
    condition: 'new' as const
  },
  {
    id: '3',
    price: '₹99,600',
    location: 'Rajkot, Gujarat',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'windpower1',
    created_at: '2024-02-02T12:15:00Z',
    type: 'sell' as const,
    condition: 'new' as const
  },
  {
    id: '4',
    price: '₹3,735',
    location: 'Jaipur, Rajasthan',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'artist1',
    created_at: '2024-02-03T14:30:00Z',
    type: 'sell' as const,
    condition: 'new' as const
  }
];

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage, t } = useLanguage();

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Map base data to full marketplace listings with translations
      const translatedListings: MarketplaceListing[] = baseListings.map((item, index) => ({
        ...item,
        title: t(`marketplaceData.${index}.title`),
        description: t(`marketplaceData.${index}.description`),
        category: t(`marketplaceData.${index}.category`),
        provider: t(`marketplaceData.${index}.provider`),
        badge: t(`marketplaceData.${index}.badge`)
      }));

      setListings(translatedListings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentLanguage, t]);

  return { listings, loading, error, refetch: fetchListings };
};