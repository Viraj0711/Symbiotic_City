import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../config/database';

interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't return password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: null
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters'],
    default: null
  },
  role: {
    type: String,
    enum: ['USER', 'SITE_OWNER', 'ADMIN', 'MODERATOR'],
    default: 'USER'
  },
  siteOwnerData: {
    companyName: String,
    certifications: [String],
    verified: { type: Boolean, default: false },
    sites: [{ type: Schema.Types.ObjectId, ref: 'HydrogenSite' }],
    businessLicense: String,
    greenCertifications: [String]
  },
  preferences: {
    energyTypes: { type: [String], default: ['hydrogen', 'solar', 'wind'] },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 1000 }
    },
    deliveryRadius: { type: Number, default: 50 },
    sustainabilityGoals: [String]
  },
  wallet: {
    balance: { type: Number, default: 0 },
    greenCredits: { type: Number, default: 100 },
    carbonOffset: { type: Number, default: 0 }
  },
  purchases: [{
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    productId: { type: Schema.Types.ObjectId, ref: 'EnergyProduct' },
    amount: Number,
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'pending' }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this as IUserDocument;
  
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    user.password = await bcrypt.hash(user.password, 12);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const user = this as IUserDocument;
  return bcrypt.compare(candidatePassword, user.password);
};

// Static method to find user by email (including password for authentication)
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email }).select('+password');
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
export default User;