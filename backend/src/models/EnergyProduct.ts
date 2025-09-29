import mongoose, { Document, Schema } from 'mongoose';

export interface IEnergyProduct extends Document {
  title: string;
  description: string;
  category: 'hydrogen' | 'solar' | 'wind' | 'battery_storage' | 'green_certificate';
  siteId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  pricing: {
    amount: number;
    unit: string; // kWh, kg, certificate, etc.
    currency: string;
    discounts?: {
      bulk: number;
      longTerm: number;
    };
  };
  availability: {
    quantity: number;
    unit: string;
    availableFrom: Date;
    availableUntil: Date;
  };
  specifications: {
    purity?: number; // For hydrogen
    capacity?: number; // For batteries/storage
    efficiency?: number; // For solar/wind
    certificationLevel: string;
    sustainabilityScore: number;
  };
  delivery: {
    methods: string[]; // ['pickup', 'delivery', 'pipeline', 'grid_injection']
    radius: number;
    cost: number;
    estimatedTime: string;
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
  reviews: [{
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }];
  analytics: {
    views: number;
    inquiries: number;
    sales: number;
    revenue: number;
  };
  status: 'active' | 'inactive' | 'sold_out' | 'pending_approval';
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EnergyProductSchema = new Schema<IEnergyProduct>({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  category: { 
    type: String, 
    enum: ['hydrogen', 'solar', 'wind', 'battery_storage', 'green_certificate'],
    required: true 
  },
  siteId: { 
    type: Schema.Types.ObjectId, 
    ref: 'HydrogenSite',
    required: true 
  },
  ownerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  pricing: {
    amount: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    currency: { type: String, default: 'INR' },
    discounts: {
      bulk: { type: Number, default: 0 },
      longTerm: { type: Number, default: 0 }
    }
  },
  availability: {
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    availableFrom: { type: Date, required: true },
    availableUntil: { type: Date, required: true }
  },
  specifications: {
    purity: Number,
    capacity: Number,
    efficiency: Number,
    certificationLevel: { type: String, required: true },
    sustainabilityScore: { type: Number, min: 0, max: 100, default: 75 }
  },
  delivery: {
    methods: [String],
    radius: { type: Number, default: 50 },
    cost: { type: Number, default: 0 },
    estimatedTime: String
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  images: [String],
  certifications: [String],
  reviews: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  analytics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'sold_out', 'pending_approval'],
    default: 'pending_approval'
  },
  featured: { type: Boolean, default: false },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
EnergyProductSchema.index({ category: 1, status: 1 });
EnergyProductSchema.index({ ownerId: 1 });
EnergyProductSchema.index({ location: '2dsphere' });
EnergyProductSchema.index({ 'pricing.amount': 1 });
EnergyProductSchema.index({ featured: 1, status: 1 });

export default mongoose.model<IEnergyProduct>('EnergyProduct', EnergyProductSchema);