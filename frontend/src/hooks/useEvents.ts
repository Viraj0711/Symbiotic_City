import { useState, useEffect } from 'react';

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

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Community Clean-Up Day',
    description: 'Join your neighbors for a city-wide clean-up event. We\'ll provide supplies and refreshments. Let\'s make our neighborhoods shine!',
    date: 'March 15, 2026',
    time: '9:00 AM - 1:00 PM',
    location: 'Central Park Pavilion',
    attendees: 45,
    category: 'Environment',
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'open',
    author_id: 'admin1',
    created_at: '2026-02-01T10:00:00Z',
    type: 'volunteer'
  },
  {
    id: '2',
    title: 'Digital Skills Workshop',
    description: 'Learn essential digital skills including online safety, digital communication, and basic computer literacy. All ages welcome!',
    date: 'March 20, 2026',
    time: '2:00 PM - 5:00 PM',
    location: 'Community Library',
    attendees: 28,
    category: 'Education',
    image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'open',
    author_id: 'admin2',
    created_at: '2026-02-05T14:30:00Z',
    type: 'workshop'
  },
  {
    id: '3',
    title: 'Urban Gardening Masterclass',
    description: 'Learn how to grow your own food in small spaces. We\'ll cover container gardening, composting, and seasonal planting tips.',
    date: 'March 25, 2026',
    time: '10:00 AM - 3:00 PM',
    location: 'Green Spaces Community Garden',
    attendees: 67,
    category: 'Sustainability',
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

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setEvents(mockEvents);
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