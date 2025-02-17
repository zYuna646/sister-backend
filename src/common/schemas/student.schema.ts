import { BaseSchema } from 'src/common/base/base.schema';
import { Document, Schema, Types } from 'mongoose';

const StudentSchemaDefinition = {
  name: { type: String, required: true },
  nisn: { type: String, required: true, unique: true },
  school_id: { type: Schema.Types.ObjectId, ref: 'School', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
};

const PopulateDefinition = {};

export const StudentSchema = new BaseSchema(
  StudentSchemaDefinition,
  PopulateDefinition,
);

StudentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export interface Student extends Document {
  name: string;
  nisn: string;
  school_id: Types.ObjectId;
  user_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
