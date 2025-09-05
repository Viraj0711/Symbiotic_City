import { useState, useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  participants: number;
  category: string;
  timeLeft: string;
  impact: string;
  image: string;
  author_id: string;
  created_at: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED';
  location: string;
  tags: string[];
}

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Community Garden Initiative',
    description: 'Transform vacant lots into thriving community gardens that provide fresh produce for local families and create green spaces for neighborhoods.',
    progress: 75,
    participants: 127,
    category: 'Environment',
    timeLeft: '2 months',
    impact: 'High',
    image: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user1',
    created_at: '2024-01-15T10:00:00Z',
    status: 'ACTIVE',
    location: 'Downtown District',
    tags: ['sustainability', 'food security', 'community']
  },
  {
    id: '2',
    title: 'Smart Recycling Stations',
    description: 'Install AI-powered recycling stations throughout the city that sort waste automatically and reward residents for proper recycling habits.',
    progress: 45,
    participants: 89,
    category: 'Technology',
    timeLeft: '4 months',
    impact: 'Medium',
    image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user2',
    created_at: '2024-02-01T14:30:00Z',
    status: 'ACTIVE',
    location: 'City Center',
    tags: ['technology', 'recycling', 'innovation']
  },
  {
    id: '3',
    title: 'Youth Mentorship Program',
    description: 'Connect local professionals with youth to provide mentorship, career guidance, and skill development opportunities for the next generation.',
    progress: 90,
    participants: 234,
    category: 'Education',
    timeLeft: '1 month',
    impact: 'High',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user3',
    created_at: '2024-01-20T09:15:00Z',
    status: 'ACTIVE',
    location: 'Educational District',
    tags: ['education', 'youth', 'mentorship']
  },
  {
    id: '4',
    title: 'Bike Share Network',
    description: 'Establish a comprehensive bike-sharing system with electric bikes and smart docking stations to promote sustainable transportation.',
    progress: 30,
    participants: 156,
    category: 'Transportation',
    timeLeft: '6 months',
    impact: 'High',
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user4',
    created_at: '2024-02-10T16:45:00Z',
    status: 'ACTIVE',
    location: 'Transportation Hub',
    tags: ['transportation', 'sustainability', 'mobility']
  },
  {
    id: '5',
    title: 'Community Wi-Fi Access',
    description: 'Provide free, high-speed internet access in public spaces to bridge the digital divide and support remote work and education.',
    progress: 60,
    participants: 178,
    category: 'Digital',
    timeLeft: '3 months',
    impact: 'Medium',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user5',
    created_at: '2024-01-25T11:20:00Z',
    status: 'ACTIVE',
    location: 'Public Parks',
    tags: ['digital access', 'connectivity', 'inclusion']
  },
  {
    id: '6',
    title: 'Local Food Market',
    description: 'Create a weekly farmers market featuring local producers, artisans, and food vendors to support the local economy and healthy eating.',
    progress: 85,
    participants: 98,
    category: 'Economy',
    timeLeft: '2 weeks',
    impact: 'Medium',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user6',
    created_at: '2024-02-05T13:10:00Z',
    status: 'ACTIVE',
    location: 'Market Square',
    tags: ['local economy', 'food', 'community']
  }
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setProjects(mockProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
};