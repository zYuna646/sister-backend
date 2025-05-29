import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';

const ClassroomSchemaDefinition = {
  name: { type: String, required: true },
  grade: { type: String, required: true },
  guru_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  is_active: { type: Boolean, default: true },
};

const PopulateDefinition = ['guru_id', 'school_id'];

export const ClassroomSchema = new BaseSchema(
  ClassroomSchemaDefinition,
  PopulateDefinition,
);

export interface Classroom extends Document {
  name: string;
  grade: string;
  guru_id: mongoose.Schema.Types.ObjectId;
  school_id: mongoose.Schema.Types.ObjectId;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
