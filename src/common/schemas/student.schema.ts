import { BaseSchema } from 'src/common/base/base.schema';
import { Document } from 'mongoose';
import slugify from 'slugify';

const StudentSchemaDefinition = {
  name: { type: String, required: true },
  slug: { type: String, default: '' },
};

const PopulateDefinition = {};

export const StudentSchema = new BaseSchema(
  StudentSchemaDefinition,
  PopulateDefinition,
);

StudentSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface Student extends Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
