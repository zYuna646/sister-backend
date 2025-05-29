import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';
import slugify from 'slugify';

const JabatanSchemaDefinition = {
  nama: { type: String, required: true },
  slug: { type: String, default: '' },
  jabatan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jabatan',
    default: null,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  is_active: { type: Boolean, default: true },
};

const PopulateDefinition = ['jabatan_id', 'school_id'];

export const JabatanSchema = new BaseSchema(
  JabatanSchemaDefinition,
  PopulateDefinition,
);

JabatanSchema.pre('save', function (next) {
  if (this.isModified('nama')) {
    this.slug = slugify(this.nama as string, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

export interface Jabatan extends Document {
  nama: string;
  slug: string;
  jabatan_id?: mongoose.Schema.Types.ObjectId | Jabatan;
  school_id: mongoose.Schema.Types.ObjectId;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
