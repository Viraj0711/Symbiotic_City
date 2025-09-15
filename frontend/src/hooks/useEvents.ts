import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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
}

// Base events data without translations
const baseEvents = [
  {
    id: '1',
    date: '2026-03-15T09:00:00Z',
    time: '9:00 AM - 1:00 PM',
    attendees: 45,
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'open',
    author_id: 'admin1',
    created_at: '2026-02-01T10:00:00Z',
    type: 'volunteer'
  },
  {
    id: '2',
    date: '2026-03-20T14:00:00Z',
    time: '2:00 PM - 5:00 PM',
    attendees: 28,
    image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'open',
    author_id: 'admin2',
    created_at: '2026-02-05T14:30:00Z',
    type: 'workshop'
  },
  {
    id: '3',
    date: '2026-03-25T10:00:00Z',
    time: '10:00 AM - 3:00 PM',
    attendees: 67,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'open',
    author_id: 'expert1',
    created_at: '2026-02-08T09:15:00Z',
    type: 'masterclass'
  }
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage, t } = useLanguage();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Map base data to full events with translations
      const translatedEvents: Event[] = baseEvents.map((item, index) => ({
        ...item,
        title: t(`eventsData.${index}.title`),
        description: t(`eventsData.${index}.description`),
        location: t(`eventsData.${index}.location`),
        category: t(`eventsData.${index}.category`)
      }));
      
      setEvents(translatedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentLanguage, t]);

  return { events, loading, error, refetch: fetchEvents };
};