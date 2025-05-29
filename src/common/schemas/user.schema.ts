import { BaseSchema } from 'src/common/base/base.schema';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from './role.schema';
import { UserDetails } from './user-details.schema';

const SALT_ROUNDS = 10;

const UserSchemaDefinition = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    default: null,
  },
  foto: {
    type: String,
    default: null,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
};

const PopulateDefinition = ['role'];

export const UserSchema = new BaseSchema(
  UserSchemaDefinition,
  PopulateDefinition,
);

// Pre-save hook untuk validasi details berdasarkan role
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Validasi details berdasarkan role
  if (this.isModified('details') || this.isModified('role')) {
    if (this.populated('role') || (this.role as any)?.name) {
      const role = this.populated('role')
        ? this.role
        : await this.model('Role').findById(this.role);

      if (role && this.details) {
        const roleDoc = role as any;
        const detailsDoc = this.details as any;
        if (roleDoc.slug === 'guru') {
          // Validasi untuk guru
          if (!detailsDoc.nip) {
            return next(new Error('NIP is required for guru role'));
          }
        } else if (roleDoc.slug === 'siswa') {
          // Validasi untuk siswa
          if (!detailsDoc.nisn) {
            return next(new Error('NISN is required for siswa role'));
          }
        }
      }
    }
  }

  this.updatedAt = new Date();
  next();
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.password;
  return obj;
};

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: Role | mongoose.Schema.Types.ObjectId;
  school_id?: mongoose.Schema.Types.ObjectId;
  foto?: string;
  details?: UserDetails;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
