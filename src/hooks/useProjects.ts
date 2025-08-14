import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('city_data')
        .select('*')
        .eq('type', 'project')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = data?.map((item) => ({
        id: item.id,
        title: item.name,
        description: item.description || '',
        progress: item.properties?.progress || 0,
        participants: item.properties?.participants || 0,
        category: item.properties?.category || 'Community',
        timeLeft: item.properties?.timeLeft || '3 months',
        impact: item.properties?.impact || 'Positive impact',
        image: item.properties?.image || 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?auto=compress&cs=tinysrgb&w=400',
        author_id: item.author_id,
        created_at: item.created_at,
      })) || [];

      setProjects(formattedProjects);
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