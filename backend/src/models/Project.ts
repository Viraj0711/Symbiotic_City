import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from '../config/database';

interface IProjectDocument extends Omit<IProject, '_id'>, Document {}

const LocationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(coords: number[]) {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 && // longitude
               coords[1] >= -90 && coords[1] <= 90;     // latitude
      },
      message: 'Coordinates must be [longitude, latitude] with valid ranges'
    }
  },
  address: {
    type: String,
    maxlength: [200, 'Address cannot exceed 200 characters']
  }
});

const ProjectSchema = new Schema<IProjectDocument>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['PLANNING', 'ACTIVE', 'COMPLETED', 'PAUSED'],
    default: 'PLANNING'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Urban Gardening',
      'Renewable Energy',
      'Zero Waste',
      'Community Building',
      'Transportation',
      'Water Conservation',
      'Education',
      'Technology',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  authorId: {
    type: String,
    ref: 'User',
    required: [true, 'Author is required']
  },
  participants: [{
    type: String,
    ref: 'User'
  }],
  location: {
    type: LocationSchema,
    default: null
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(this: IProjectDocument, endDate: Date) {
        return !this.startDate || !endDate || endDate >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
ProjectSchema.index({ authorId: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ 'location.coordinates': '2dsphere' }); // For geospatial queries
ProjectSchema.index({ createdAt: -1 });

// Virtual for participant count
ProjectSchema.virtual('participantCount').get(function() {
  return this.participants?.length || 0;
});

// Virtual for project duration
ProjectSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.endDate) return null;
  const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

export const Project = mongoose.model<IProjectDocument>('Project', ProjectSchema);
export default Project;