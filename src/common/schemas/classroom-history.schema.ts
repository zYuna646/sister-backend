import { Schema } from 'mongoose';

export const ClassroomHistorySchema = new Schema(
  {
    classroom_id: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      default: null,
    },
    is_current: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false, timestamps: false },
);

export interface ClassroomHistory {
  classroom_id: string;
  start_date: Date;
  end_date?: Date;
  is_current: boolean;
}
