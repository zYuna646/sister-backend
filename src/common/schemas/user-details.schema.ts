import { Schema } from 'mongoose';
import {
  ClassroomHistorySchema,
  ClassroomHistory,
} from './classroom-history.schema';

// Schema untuk detail Guru
export const GuruDetailsSchema = new Schema(
  {
    nip: {
      type: String,
      required: true,
      unique: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    jabatan_id: {
      type: Schema.Types.ObjectId,
      ref: 'Jabatan',
      default: null,
    },
  },
  { _id: false, timestamps: false },
);

// Schema untuk detail Siswa
export const SiswaDetailsSchema = new Schema(
  {
    nisn: {
      type: String,
      required: true,
      unique: true,
    },
    classroom_history: {
      type: [ClassroomHistorySchema],
      default: [],
    },
  },
  { _id: false, timestamps: false },
);

// Interface untuk detail Guru
export interface GuruDetails {
  nip: string;
  is_active: boolean;
  jabatan_id?: string;
}

// Interface untuk detail Siswa
export interface SiswaDetails {
  nisn: string;
  classroom_history: ClassroomHistory[];
}

// Union type untuk details
export type UserDetails = GuruDetails | SiswaDetails;
