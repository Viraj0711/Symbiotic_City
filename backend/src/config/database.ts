import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout to 10 seconds
});

const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Connecting to PostgreSQL (Supabase)...');
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    
    console.log(`✅ PostgreSQL Connected: ${result.rows[0].now}`);
    console.log(`📊 Database: Supabase`);
    
    client.release();

    // Handle pool events
    pool.on('connect', () => {
      console.log('🟢 New client connected to PostgreSQL');
    });

    pool.on('error', (err) => {
      console.error('🔴 PostgreSQL pool error:', err);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await pool.end();
      console.log('� PostgreSQL pool closed through app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await pool.end();
      console.log('🔴 PostgreSQL pool closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL:', error);
    console.warn('⚠️  Continuing without database connection. Please check your Supabase credentials.');
    // Don't exit process - allow server to run without database for testing
  }
};

// Database interface types for TypeScript
export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: 'USER' | 'SITE_OWNER' | 'ADMIN' | 'MODERATOR';
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  site_owner_data?: {
    company_name?: string;
    certifications?: string[];
    verified?: boolean;
    sites?: string[];
    business_license?: string;
    green_certifications?: string[];
  };
  preferences?: {
    energy_types?: string[];
    price_range?: {
      min?: number;
      max?: number;
    };
    delivery_radius?: number;
    sustainability_goals?: string[];
  };
  wallet?: {
    balance?: number;
    green_credits?: number;
    carbon_offset?: number;
  };
  is_active: boolean;
  email_verified: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IProject {
  id?: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  category: string;
  tags: string[];
  author_id: string;
  participants: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IEvent {
  id?: string;
  title: string;
  description: string;
  start_date: Date;
  end_date?: Date;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  category: string;
  tags: string[];
  organizer_id: string;
  attendees: string[];
  max_attendees?: number;
  is_virtual: boolean;
  virtual_link?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IEnergyProduct {
  id?: string;
  title: string;
  description: string;
  category: 'hydrogen' | 'solar' | 'wind' | 'battery_storage' | 'green_certificate';
  site_id?: string;
  owner_id: string;
  pricing: {
    amount: number;
    unit: string;
    currency: string;
    discounts?: {
      bulk: number;
      long_term: number;
    };
  };
  availability: {
    quantity: number;
    unit: string;
    available_from: Date;
    available_until: Date;
  };
  specifications: {
    purity?: number;
    capacity?: number;
    efficiency?: number;
    certification_level: string;
    sustainability_score: number;
  };
  delivery: {
    methods: string[];
    radius: number;
    cost: number;
    estimated_time: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  images: string[];
  certifications: string[];
  analytics: {
    views: number;
    inquiries: number;
    sales: number;
    revenue: number;
  };
  status: 'active' | 'inactive' | 'sold_out' | 'pending_approval';
  featured: boolean;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface IOrder {
  id?: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  site_id?: string;
  order_details: {
    quantity: number;
    unit: string;
    unit_price: number;
    total_price: number;
    currency: string;
    discount_applied?: number;
  };
  delivery: {
    method: string;
    address: string;
    scheduled_date: Date;
    delivery_window?: string;
    cost: number;
    tracking_number?: string;
  };
  payment: {
    method: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    transaction_id?: string;
    green_credits_used: number;
    cash_amount: number;
  };
  status: 'pending' | 'confirmed' | 'in_production' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';
  sustainability: {
    carbon_offset: number;
    sustainability_score: number;
    certifications: string[];
  };
  created_at: Date;
  updated_at: Date;
}

export default connectDB;
