import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';

const NewsSchemaDefinition = {
  title: { type: String, required: true },
  slug: { type: String, default: '' },
  summary: { type: String, default: '' },
  content: { type: String, required: true },
  thumbnail: { type: String, default: '' }, // Path to image file
  is_featured: { type: Boolean, default: false },
  view_count: { type: Number, default: 0 },
  publish_date: { type: Date, default: Date.now },
  is_published: { type: Boolean, default: true },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsCategory',
    required: true,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
};

const PopulateDefinition = ['category_id', 'school_id', 'author_id'];

export const NewsSchema = new BaseSchema(
  NewsSchemaDefinition,
  PopulateDefinition,
);

NewsSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface News extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  is_featured: boolean;
  view_count: number;
  publish_date: Date;
  is_published: boolean;
  category_id: mongoose.Schema.Types.ObjectId;
  school_id: mongoose.Schema.Types.ObjectId;
  author_id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
