import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Fetch projects from the backend
      const response = await fetch(`${API_BASE_URL}/projects`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      
      // Transform database projects to match the Project interface
      const transformedProjects: Project[] = (data.projects || []).map((project: any) => ({
        id: project.id,
        title: project.title || 'Untitled Project',
        description: project.description || 'No description available',
        progress: project.progress || 0,
        participants: project.participants ? project.participants.length : 0,
        category: project.category || 'General',
        timeLeft: project.end_date ? calculateTimeLeft(project.end_date) : 'Ongoing',
        impact: project.impact || 'Community Impact',
        image: project.image || 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600',
        author_id: project.author_id || 'unknown',
        created_at: project.created_at,
        status: (project.status?.toUpperCase() || 'ACTIVE') as 'ACTIVE' | 'COMPLETED' | 'PLANNED',
        location: typeof project.location === 'string' 
          ? project.location 
          : project.location?.city || project.location?.address || 'Location TBD',
        tags: project.tags || []
      }));
      
      setProjects(transformedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Set empty array on error so the page still renders
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Completed';
    if (diffDays === 0) return 'Ending today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month left';
    return `${diffMonths} months left`;
  };

  useEffect(() => {
    fetchProjects();
  }, []); // Fetch once on mount

  return { projects, loading, error, refetch: fetchProjects };
};