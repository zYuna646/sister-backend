import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/base/base.service';
import { User } from 'src/common/schemas/user.schema';
import { BaseResponse } from 'src/common/base/base.response';
import { CreateGuruDto } from './dto/create-guru.dto';
import { CreateSiswaDto } from './dto/create-siswa.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel('User') private userModel: Model<User>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User> {
    return this.model.findOne({ email: email }).populate('role').exec();
  }

  // Create Guru dengan role otomatis
  async createGuru(
    createGuruDto: CreateGuruDto,
    query?: any,
  ): Promise<BaseResponse<User>> {
    try {
      // Find guru role
      const guruRole = await this.model.db
        .model('Role')
        .findOne({ slug: 'guru' });

      if (!guruRole) {
        return new BaseResponse<User>(
          HttpStatus.NOT_FOUND,
          'Guru role not found',
          null,
        );
      }

      const userToCreate = {
        name: createGuruDto.name,
        email: createGuruDto.email,
        password: createGuruDto.password,
        role: guruRole._id,
        foto: createGuruDto.foto || null,
        details: {
          nip: createGuruDto.nip,
          is_active: createGuruDto.is_active ?? true,
          jabatan_id: createGuruDto.jabatan_id || null,
        },
        school_id: query?.school_id || null,
      };

      const user = await this.model.create(userToCreate);
      const populatedUser = await this.model
        .findById(user._id)
        .populate('role')
        .exec();

      return new BaseResponse<User>(
        HttpStatus.CREATED,
        'Guru created successfully',
        populatedUser,
      );
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return new BaseResponse<User>(
          HttpStatus.CONFLICT,
          `${field} already exists`,
          null,
          error.message,
        );
      }
      return new BaseResponse<User>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating guru',
        null,
        error.message,
      );
    }
  }

  // Create Siswa dengan role otomatis
  async createSiswa(
    createSiswaDto: CreateSiswaDto,
    query?: any,
  ): Promise<BaseResponse<User>> {
    try {
      // Find siswa role
      const siswaRole = await this.model.db
        .model('Role')
        .findOne({ slug: 'siswa' });

      if (!siswaRole) {
        return new BaseResponse<User>(
          HttpStatus.NOT_FOUND,
          'Siswa role not found',
          null,
        );
      }

      const userToCreate = {
        name: createSiswaDto.name,
        email: createSiswaDto.email,
        password: createSiswaDto.password,
        role: siswaRole._id,
        foto: createSiswaDto.foto || null,
        details: {
          nisn: createSiswaDto.nisn,
        },
        school_id: query?.school_id || null,
      };

      const user = await this.model.create(userToCreate);
      const populatedUser = await this.model
        .findById(user._id)
        .populate('role')
        .exec();

      return new BaseResponse<User>(
        HttpStatus.CREATED,
        'Siswa created successfully',
        populatedUser,
      );
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return new BaseResponse<User>(
          HttpStatus.CONFLICT,
          `${field} already exists`,
          null,
          error.message,
        );
      }
      return new BaseResponse<User>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating siswa',
        null,
        error.message,
      );
    }
  }

  // Get all guru
  async findAllGuru(query?: any): Promise<BaseResponse<User[]>> {
    try {
      const filter: any = {};

      // Find guru role
      const guruRole = await this.model.db
        .model('Role')
        .findOne({ slug: 'guru' });

      if (!guruRole) {
        return new BaseResponse<User[]>(
          HttpStatus.NOT_FOUND,
          'Guru role not found',
          [],
        );
      }

      filter.role = guruRole._id;

      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const entities = await this.model.find(filter).populate('role').exec();

      return new BaseResponse<User[]>(
        HttpStatus.OK,
        'Guru fetched successfully',
        entities,
      );
    } catch (error) {
      return new BaseResponse<User[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching guru',
        null,
        error.message,
      );
    }
  }

  // Get all siswa
  async findAllSiswa(query?: any): Promise<BaseResponse<User[]>> {
    try {
      const filter: any = {};

      // Find siswa role
      const siswaRole = await this.model.db
        .model('Role')
        .findOne({ slug: 'siswa' });

      if (!siswaRole) {
        return new BaseResponse<User[]>(
          HttpStatus.NOT_FOUND,
          'Siswa role not found',
          [],
        );
      }

      filter.role = siswaRole._id;

      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const entities = await this.model.find(filter).populate('role').exec();

      return new BaseResponse<User[]>(
        HttpStatus.OK,
        'Siswa fetched successfully',
        entities,
      );
    } catch (error) {
      return new BaseResponse<User[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching siswa',
        null,
        error.message,
      );
    }
  }

  // Override create untuk validasi role dan details
  override async create(
    createDto: any,
    query?: any,
  ): Promise<BaseResponse<User>> {
    try {
      // Validate role dan details consistency
      if (createDto.role && createDto.details) {
        const role = await this.model.db.model('Role').findById(createDto.role);
        if (role) {
          if (role.slug === 'guru' && !createDto.details.nip) {
            throw new BadRequestException('NIP is required for guru role');
          }
          if (role.slug === 'siswa' && !createDto.details.nisn) {
            throw new BadRequestException('NISN is required for siswa role');
          }
        }
      }

      return super.create(createDto, query);
    } catch (error) {
      return new BaseResponse<User>(
        HttpStatus.BAD_REQUEST,
        error.message,
        null,
        error.message,
      );
    }
  }

  // Override findAll to properly populate and filter by school_id
  override async findAll(query?: any): Promise<BaseResponse<User[]>> {
    try {
      // Build filter based on query params
      const filter: any = {};

      // If school_id is provided in query, filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const entities = await this.model.find(filter).populate('role').exec();

      return new BaseResponse<User[]>(
        HttpStatus.OK,
        'Users fetched successfully',
        entities,
      );
    } catch (error) {
      return new BaseResponse<User[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching users',
        null,
        error.message,
      );
    }
  }

  // Override findById to always populate role for permission checking
  override async findById(id: string, query?: any): Promise<any> {
    try {
      const filter: any = { _id: id };

      // If school_id is provided in query, also filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const entity = await this.model
        .findOne(filter)
        .populate('role')
        .populate('school_id')
        .exec();

      if (!entity) {
        return {
          statusCode: 404,
          message: 'Entity not found',
          data: null,
        };
      }
      return {
        statusCode: 200,
        message: 'Entity fetched successfully',
        data: entity,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error fetching entity',
        data: null,
        error: error.message,
      };
    }
  }

  // Upload user profile photo
  async uploadProfilePhoto(
    userId: string,
    filePath: string,
    query?: any,
  ): Promise<BaseResponse<User>> {
    try {
      const filter: any = { _id: userId };

      // If school_id is provided in query, also filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const user = await this.model.findOne(filter);

      if (!user) {
        return new BaseResponse<User>(
          HttpStatus.NOT_FOUND,
          'User not found',
          null,
        );
      }

      // Update user photo
      user.foto = filePath;
      await user.save();

      const updatedUser = await this.model
        .findById(userId)
        .populate('role')
        .populate('school_id')
        .exec();

      return new BaseResponse<User>(
        HttpStatus.OK,
        'Profile photo uploaded successfully',
        updatedUser,
      );
    } catch (error) {
      return new BaseResponse<User>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error uploading profile photo',
        null,
        error.message,
      );
    }
  }
}
