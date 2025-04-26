import * as mongoose from 'mongoose';
import 'dotenv/config';
import { UserSchema } from './common/schemas/user.schema';
import { RoleSchema } from './common/schemas/role.schema';
import { SchoolSchema } from './common/schemas/school.schema';

const User = mongoose.model('User', UserSchema);
const Role = mongoose.model('Role', RoleSchema);
const School = mongoose.model('School', SchoolSchema);

// Define permissions for each role (more specific with resources)
const rolePermissions = {
  superAdmin: ['*'], // All permissions
  admin: [
    'GET USER',
    'POST USER',
    'PUT USER',
    'DELETE USER',
    'GET ROLE',
    'POST ROLE',
    'PUT ROLE',
    'DELETE ROLE',
    'GET SCHOOL',
    'POST SCHOOL',
    'PUT SCHOOL',
    'DELETE SCHOOL',
    'GET AUTH',
    'POST AUTH',
  ],
  guru: [
    'GET USER',
    'PUT USER', // Can view and update their own profile
    'GET SCHOOL', // Can view school information
    'GET AUTH',
    'POST AUTH', // Can authenticate
  ],
  siswa: [
    'GET USER',
    'PUT USER', // Can view and update their own profile
    'GET SCHOOL', // Can view school information
    'GET AUTH',
    'POST AUTH', // Can authenticate
  ],
  pendaftar: [
    'GET USER', // Can view their profile
    'GET SCHOOL', // Can view school information
    'GET AUTH',
    'POST AUTH', // Can authenticate
  ],
};

// Interface for roles record
interface RolesRecord {
  [key: string]: any;
}

async function bootstrap() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Berhasil terkoneksi ke MongoDB');

    // Skip dropping the database since it requires admin privileges
    // Instead, just delete all existing records
    await Role.deleteMany({});
    await School.deleteMany({});
    await User.deleteMany({});
    console.log('Existing records deleted');

    // Create all roles
    const createdRoles: RolesRecord = {};
    for (const [roleName, permissions] of Object.entries(rolePermissions)) {
      const role = await Role.create({
        name: roleName.charAt(0).toUpperCase() + roleName.slice(1), // Capitalize first letter
        permissions: permissions,
      });
      createdRoles[roleName] = role;
      console.log(`Role ${roleName} created with permissions:`, permissions);
    }

    // Create schools
    const mainSchool = await School.create({
      name: 'Main High School',
      npsn: '12345678', // Added required NPSN field
      address: 'Jl. Pendidikan No. 1',
      phone: '021-1234567',
      email: 'info@mainhighschool.com',
      visi: [
        'Menjadi sekolah unggul dalam pendidikan karakter',
        'Menghasilkan lulusan berkualitas dan berdaya saing global',
      ],
      misi: [
        'Menyelenggarakan pendidikan berkualitas tinggi',
        'Membentuk siswa dengan karakter yang kuat',
        'Mengembangkan potensi siswa dalam bidang akademik dan non-akademik',
      ],
      isActive: true,
    });

    const secondarySchool = await School.create({
      name: 'Secondary High School',
      npsn: '87654321', // Added required NPSN field
      address: 'Jl. Pendidikan No. 2',
      phone: '021-7654321',
      email: 'info@secondaryhighschool.com',
      visi: [
        'Menjadi pusat pengembangan pendidikan berbasis teknologi',
        'Menghasilkan lulusan yang inovatif dan adaptif',
      ],
      misi: [
        'Mengintegrasikan teknologi dalam pembelajaran',
        'Membangun lingkungan belajar yang kolaboratif',
        'Menerapkan metode pembelajaran berbasis proyek',
      ],
      isActive: true,
    });

    // Use plaintext password - hashing will be handled by the pre-save hook in UserSchema
    const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Create superAdmin user (no school_id)
    await User.create({
      name: process.env.ADMIN_NAME || 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'superadmin@example.com',
      password: plainPassword,
      role: createdRoles.superAdmin._id,
      // superAdmin doesn't have a school_id
    });

    // Create admin user (with school_id)
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: plainPassword,
      role: createdRoles.admin._id,
      school_id: mainSchool._id,
    });

    // Create guru user
    await User.create({
      name: 'Guru Example',
      email: 'guru@example.com',
      password: plainPassword,
      role: createdRoles.guru._id,
      school_id: mainSchool._id,
    });

    // Create siswa user
    await User.create({
      name: 'Siswa Example',
      email: 'siswa@example.com',
      password: plainPassword,
      role: createdRoles.siswa._id,
      school_id: mainSchool._id,
    });

    // Create pendaftar user for secondary school
    await User.create({
      name: 'Pendaftar Example',
      email: 'pendaftar@example.com',
      password: plainPassword,
      role: createdRoles.pendaftar._id,
      school_id: secondarySchool._id,
    });

    console.log('Seeder berhasil dijalankan');
  } catch (error) {
    console.error('Gagal melakukan seeding:', error);
  } finally {
    // Tutup koneksi MongoDB
    await mongoose.disconnect();
    console.log('Koneksi MongoDB ditutup');
  }
}

bootstrap();
