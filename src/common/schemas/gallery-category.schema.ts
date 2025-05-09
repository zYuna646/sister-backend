import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';

const GalleryCategorySchemaDefinition = {
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  description: { type: String, default: '' },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
};

const PopulateDefinition = ['school_id'];

export const GalleryCategorySchema = new BaseSchema(
  GalleryCategorySchemaDefinition,
  PopulateDefinition,
);

GalleryCategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface GalleryCategory extends Document {
  name: string;
  slug: string;
  description: string;
  school_id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
