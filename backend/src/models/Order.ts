import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  siteId: mongoose.Types.ObjectId;
  orderDetails: {
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    discountApplied?: number;
  };
  delivery: {
    method: string;
    address: string;
    scheduledDate: Date;
    deliveryWindow: string;
    cost: number;
    trackingNumber?: string;
  };
  payment: {
    method: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    greenCreditsUsed: number;
    cashAmount: number;
  };
  status: 'pending' | 'confirmed' | 'in_production' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';
  timeline: [{
    status: string;
    timestamp: Date;
    note?: string;
  }];
  sustainability: {
    carbonOffset: number;
    sustainabilityScore: number;
    certifications: string[];
  };
  communication: [{
    from: mongoose.Types.ObjectId;
    message: string;
    timestamp: Date;
    type: 'message' | 'system' | 'update';
  }];
  reviews: {
    buyer?: {
      rating: number;
      comment: string;
      date: Date;
    };
    seller?: {
      rating: number;
      comment: string;
      date: Date;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  buyerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  sellerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'EnergyProduct',
    required: true 
  },
  siteId: { 
    type: Schema.Types.ObjectId, 
    ref: 'HydrogenSite',
    required: true 
  },
  orderDetails: {
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    discountApplied: Number
  },
  delivery: {
    method: { type: String, required: true },
    address: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    deliveryWindow: String,
    cost: { type: Number, default: 0 },
    trackingNumber: String
  },
  payment: {
    method: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    greenCreditsUsed: { type: Number, default: 0 },
    cashAmount: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_production', 'ready', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  sustainability: {
    carbonOffset: { type: Number, default: 0 },
    sustainabilityScore: { type: Number, default: 0 },
    certifications: [String]
  },
  communication: [{
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['message', 'system', 'update'], default: 'message' }
  }],
  reviews: {
    buyer: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: Date
    },
    seller: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: Date
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
OrderSchema.index({ buyerId: 1, status: 1 });
OrderSchema.index({ sellerId: 1, status: 1 });
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);