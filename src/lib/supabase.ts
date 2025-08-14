import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          role: 'USER' | 'ADMIN' | 'MODERATOR';
          image: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          role?: 'USER' | 'ADMIN' | 'MODERATOR';
          image?: string | null;
          is_active?: boolean;
        };
        Update: {
          name?: string | null;
          email?: string;
          role?: 'USER' | 'ADMIN' | 'MODERATOR';
          image?: string | null;
          is_active?: boolean;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          excerpt: string | null;
          slug: string;
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          published: boolean;
          published_at: string | null;
          author_id: string;
          view_count: number;
          like_count: number;
          featured: boolean;
          tags: any;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          excerpt?: string | null;
          slug: string;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          published?: boolean;
          published_at?: string | null;
          author_id: string;
          view_count?: number;
          like_count?: number;
          featured?: boolean;
          tags?: any;
          metadata?: any;
        };
        Update: {
          title?: string;
          content?: string;
          excerpt?: string | null;
          slug?: string;
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          published?: boolean;
          published_at?: string | null;
          view_count?: number;
          like_count?: number;
          featured?: boolean;
          tags?: any;
          metadata?: any;
        };
      };
      city_data: {
        Row: {
          id: string;
          name: string;
          type: string;
          description: string | null;
          latitude: number;
          longitude: number;
          properties: any;
          author_id: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          type: string;
          description?: string | null;
          latitude: number;
          longitude: number;
          properties?: any;
          author_id: string;
          is_verified?: boolean;
        };
        Update: {
          name?: string;
          type?: string;
          description?: string | null;
          latitude?: number;
          longitude?: number;
          properties?: any;
          is_verified?: boolean;
        };
      };
    };
  };
};