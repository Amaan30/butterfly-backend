// models/Post.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  media?: string;
  mediaType?: string;
  author: mongoose.Types.ObjectId;
  likes?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: String },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
