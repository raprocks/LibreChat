import { Schema, Document, Types } from 'mongoose';

export interface ITodo extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true },
);

// Create a compound index on user and title with unique constraint.
todoSchema.index({ user: 1, title: 1 }, { unique: true });

export default todoSchema;
