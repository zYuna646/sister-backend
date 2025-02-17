import { BaseSchema } from 'src/common/base/base.schema';
import { Document, Schema, Types } from 'mongoose';
import slugify from 'slugify';

const SchoolSchemaDefinition = {
  name: { type: String, required: true },
  slug: { type: String, default: '' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
};

const PopulateDefinition = {};

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
  user_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
