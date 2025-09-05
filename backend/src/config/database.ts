import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/symbiotic_city';
    
    console.log('🔄 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('🟡 Mongoose disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔴 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    console.warn('⚠️  Continuing without database connection. Please install MongoDB or use MongoDB Atlas.');
    // Don't exit process - allow server to run without database for testing
  }
};

// Database interface types for TypeScript
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  category: string;
  tags: string[];
  authorId: string;
  participants: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  category: string;
  tags: string[];
  organizerId: string;
  attendees: string[];
  maxAttendees?: number;
  isVirtual: boolean;
  virtualLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMarketplaceItem {
  _id?: string;
  title: string;
  description: string;
  type: 'SELL' | 'TRADE' | 'GIVE_AWAY';
  category: string;
  tags: string[];
  price?: number;
  currency?: string;
  images: string[];
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
  sellerId: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default connectDB;
