import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';

const LandingSchoolsSchemaDefinition = {
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  principal_message: { type: String, default: '' },
  principal_photo: { type: String, default: '' },
  hero_image: { type: String, default: '' },
};

const PopulateDefinition = ['school_id'];

export const LandingSchoolsSchema = new BaseSchema(
  LandingSchoolsSchemaDefinition,
  PopulateDefinition,
);

export interface LandingSchools extends Document {
  school_id: mongoose.Schema.Types.ObjectId;
  principal_message: string;
  principal_photo: string;
  hero_image: string;
  createdAt: Date;
  updatedAt: Date;
}
