import { BaseSchema } from 'src/common/base/base.schema';
import { Document } from 'mongoose';
import slugify from 'slugify';

const SchoolSchemaDefinition = {
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
};

const PopulateDefinition = [];

export const SchoolSchema = new BaseSchema(
  SchoolSchemaDefinition,
  PopulateDefinition,
);

SchoolSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface School extends Document {
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
