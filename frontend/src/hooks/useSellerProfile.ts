import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface SellerProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: 'individual' | 'business' | 'organization';
  description?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: any;
  stripe_account_id?: string;
  stripe_onboarding_complete: boolean;
  kyc_status: 'pending' | 'verified' | 'rejected';
  ratings?: { average: number; count: number };
  total_sales: number;
  total_orders: number;
  commission_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface SellerStats {
  total_orders: number;
  total_revenue_cents: number;
  pending_orders: number;
  total_products: number;
  active_products: number;
  pending_payout_cents: number;
}

export const useSellerProfile = () => {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/seller/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setProfile(null);
          setStats(null);
          setError(null);
          return;
        }
        throw new Error('Failed to fetch seller profile');
      }

      const data = await response.json();
      setProfile(data.seller_profile);
      setStats(data.stats);
      setError(null);
    } catch (err) {
      console.error('Error fetching seller profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const applyAsSeller = async (data: {
    business_name: string;
    business_type: string;
    description?: string;
    business_email?: string;
    business_phone?: string;
    business_address?: any;
  }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/seller/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply as seller');
      }

      const result = await response.json();
      setProfile(result.seller_profile);
      return result;
    } catch (err) {
      console.error('Error applying as seller:', err);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<SellerProfile>) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/seller/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update seller profile');
      }

      const result = await response.json();
      setProfile(result.seller_profile);
      return result;
    } catch (err) {
      console.error('Error updating seller profile:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    stats,
    loading,
    error,
    refetch: fetchProfile,
    applyAsSeller,
    updateProfile
  };
};
