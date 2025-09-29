import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

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

// Base project data without translations
const baseProjects = [
  {
    id: '1',
    progress: 75,
    participants: 127,
    image: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user1',
    created_at: '2024-01-15T10:00:00Z',
    status: 'ACTIVE' as const,
    location: 'Downtown District',
    tags: ['sustainability', 'food security', 'community']
  },
  {
    id: '2',
    progress: 45,
    participants: 89,
    image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user2',
    created_at: '2024-02-01T14:30:00Z',
    status: 'ACTIVE' as const,
    location: 'City Center',
    tags: ['technology', 'recycling', 'innovation']
  },
  {
    id: '3',
    progress: 90,
    participants: 234,
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user3',
    created_at: '2024-01-20T09:15:00Z',
    status: 'ACTIVE' as const,
    location: 'Educational District',
    tags: ['education', 'youth', 'mentorship']
  },
  {
    id: '4',
    progress: 30,
    participants: 156,
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user4',
    created_at: '2024-02-10T16:45:00Z',
    status: 'ACTIVE' as const,
    location: 'Transportation Hub',
    tags: ['transportation', 'sustainability', 'mobility']
  },
  {
    id: '5',
    progress: 60,
    participants: 178,
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user5',
    created_at: '2024-01-25T11:20:00Z',
    status: 'ACTIVE' as const,
    location: 'Public Parks',
    tags: ['digital access', 'connectivity', 'inclusion']
  },
  {
    id: '6',
    progress: 85,
    participants: 98,
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600',
    author_id: 'user6',
    created_at: '2024-02-05T13:10:00Z',
    status: 'ACTIVE' as const,
    location: 'Market Square',
    tags: ['local economy', 'food', 'community']
  }
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create translated projects
      const translatedProjects: Project[] = baseProjects.map(project => ({
        ...project,
        title: t(`projectData.${project.id}.title`),
        description: t(`projectData.${project.id}.description`),
        category: t(`projectData.${project.id}.category`),
        timeLeft: t(`projectData.${project.id}.timeLeft`),
        impact: t(`projectData.${project.id}.impact`)
      }));
      
      setProjects(translatedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [t]); // Re-fetch when language changes

  return { projects, loading, error, refetch: fetchProjects };
};