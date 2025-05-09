import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';

const NewsCategorySchemaDefinition = {
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  description: { type: String, default: '' },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    default: null,
    required: false,
  },
  is_active: { type: Boolean, default: true },
};

const PopulateDefinition = ['school_id'];

export const NewsCategorySchema = new BaseSchema(
  NewsCategorySchemaDefinition,
  PopulateDefinition,
);

NewsCategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface NewsCategory extends Document {
  name: string;
  slug: string;
  description: string;
  school_id: mongoose.Schema.Types.ObjectId | null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
