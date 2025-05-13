import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';

const GallerySchemaDefinition = {
  title: { type: String, required: true },
  slug: { type: String, default: '' },
  description: { type: String, default: '' },
  image_path: { type: String, required: true },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryCategory',
    required: true,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
};

const PopulateDefinition = ['category_id', 'school_id'];

export const GallerySchema = new BaseSchema(
  GallerySchemaDefinition,
  PopulateDefinition,
);

GallerySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface Gallery extends Document {
  title: string;
  slug: string;
  description: string;
  image_path: string;
  category_id: mongoose.Schema.Types.ObjectId;
  school_id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
