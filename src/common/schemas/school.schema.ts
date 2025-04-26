import { BaseSchema } from 'src/common/base/base.schema';
import { Document } from 'mongoose';
import slugify from 'slugify';
import * as crypto from 'crypto';

const SchoolSchemaDefinition = {
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  npsn: { type: String, required: true, unique: true },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  api_key: { type: String, default: '' },
  visi: [{ type: String }],
  misi: [{ type: String }],
  isActive: { type: Boolean, default: true },
};

const PopulateDefinition = [];

export const SchoolSchema = new BaseSchema(
  SchoolSchemaDefinition,
  PopulateDefinition,
);

// Generate API key function
const generateApiKey = (): string => {
  return `sk_school_${crypto.randomBytes(16).toString('hex')}`;
};

SchoolSchema.pre('save', function (next) {
  // Generate API key if this is a new document or api_key is empty
  if (this.isNew || !this.api_key) {
    this.api_key = generateApiKey();
  }

  if (this.isModified('name')) {
    this.slug = slugify(this.name as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface School extends Document {
  name: string;
  slug: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  api_key: string;
  visi: string[];
  misi: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
