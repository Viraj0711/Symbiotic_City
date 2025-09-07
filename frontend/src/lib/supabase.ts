// API Client for Symbiotic City Backend
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// User interface matching backend
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: 'USER' | 'SITE_OWNER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response interfaces
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  expiresIn: string;
}

export interface ApiError {
  error: string;
  details?: any[];
}

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Authentication endpoints
  async register(email: string, password: string, name: string, role?: 'USER' | 'SITE_OWNER'): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role: role || 'USER' }),
    });
    
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.token);
    return response;
  }

  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  async updateProfile(updates: {
    name?: string;
    bio?: string;
    location?: string;
    avatar?: string;
  }): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL);

// Legacy export for compatibility (can be removed later)
export const supabase = {
  auth: {
    signUp: async () => {
      throw new Error('Please use the new API client methods');
    },
    signInWithPassword: async () => {
      throw new Error('Please use the new API client methods');
    },
    signOut: async () => {
      throw new Error('Please use the new API client methods');
    },
  },
};