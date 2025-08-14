import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
  status: string;
  author_id: string;
  created_at: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('city_data')
        .select('*')
        .eq('type', 'event')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEvents: Event[] = data?.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description || '',
        date: item.properties?.date || new Date().toLocaleDateString(),
        time: item.properties?.time || '10:00 AM - 2:00 PM',
        location: item.properties?.location || 'Community Center',
        attendees: item.properties?.attendees || 0,
        category: item.properties?.category || 'Community',
        image: item.properties?.image || 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400',
        status: item.properties?.status || 'open',
        author_id: item.author_id,
        created_at: item.created_at,
      })) || [];

      setEvents(formattedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
};