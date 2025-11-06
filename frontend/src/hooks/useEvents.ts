import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
  type: string;
  start_date?: string;
  end_date?: string;
  organizer_id?: string;
  max_attendees?: number;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage, t } = useLanguage();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch events from the backend
      const response = await fetch(`${API_BASE_URL}/events`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      // Transform database events to match the Event interface
      const transformedEvents: Event[] = (data.events || []).map((event: any) => ({
        id: event.id,
        title: event.title || 'Untitled Event',
        description: event.description || 'No description available',
        date: event.start_date || event.created_at,
        time: event.start_date ? new Date(event.start_date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : 'TBD',
        location: typeof event.location === 'string' 
          ? event.location 
          : event.location?.city || event.location?.address || 'Location TBD',
        attendees: event.attendees ? event.attendees.length : 0,
        category: event.category || 'General',
        image: event.image || 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
        status: event.status || 'open',
        author_id: event.organizer_id || event.author_id || 'unknown',
        created_at: event.created_at,
        type: event.category?.toLowerCase() || 'general',
        start_date: event.start_date,
        end_date: event.end_date,
        organizer_id: event.organizer_id,
        max_attendees: event.max_attendees
      }));
      
      setEvents(transformedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Set empty array on error so the page still renders
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentLanguage]);

  return { events, loading, error, refetch: fetchEvents };
};