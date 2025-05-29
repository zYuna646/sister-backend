import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/base/base.service';
import { Classroom } from 'src/common/schemas/classroom.schema';
import { User } from 'src/common/schemas/user.schema';
import { BaseResponse } from 'src/common/base/base.response';

@Injectable()
export class ClassroomService extends BaseService<Classroom> {
  constructor(
    @InjectModel('Classroom') private classroomModel: Model<Classroom>,
    @InjectModel('User') private userModel: Model<User>,
  ) {
    super(classroomModel);
  }

  // Override findAll untuk filter berdasarkan sekolah dan guru
  override async findAll(query?: any): Promise<BaseResponse<Classroom[]>> {
    try {
      const filter: any = {};

      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      if (query?.guru_id) {
        filter.guru_id = query.guru_id;
      }

      if (query?.grade) {
        filter.grade = query.grade;
      }

      if (query?.is_active !== undefined) {
        filter.is_active = query.is_active === 'true';
      }

      const entities = await this.model
        .find(filter)
        .populate('guru_id')
        .populate('school_id')
        .exec();

      return new BaseResponse<Classroom[]>(
        HttpStatus.OK,
        'Classrooms fetched successfully',
        entities,
      );
    } catch (error) {
      return new BaseResponse<Classroom[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching classrooms',
        null,
        error.message,
      );
    }
  }

  // Get students in a classroom
  async getStudentsInClassroom(
    classroomId: string,
    query?: any,
  ): Promise<BaseResponse<User[]>> {
    try {
      // Find siswa role
      const siswaRole = await this.userModel.db
        .model('Role')
        .findOne({ slug: 'siswa' });

      if (!siswaRole) {
        return new BaseResponse<User[]>(
          HttpStatus.NOT_FOUND,
          'Siswa role not found',
          [],
        );
      }

      const filter: any = {
        role: siswaRole._id,
        'details.classroom_history.classroom_id': classroomId,
        'details.classroom_history.is_current': true,
      };

      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const students = await this.userModel
        .find(filter)
        .populate('role')
        .exec();

      return new BaseResponse<User[]>(
        HttpStatus.OK,
        'Students in classroom fetched successfully',
        students,
      );
    } catch (error) {
      return new BaseResponse<User[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching students in classroom',
        null,
        error.message,
      );
    }
  }

  // Assign siswa to classroom
  async assignStudentToClassroom(
    studentId: string,
    classroomId: string,
    startDate?: Date,
  ): Promise<BaseResponse<User>> {
    try {
      // Verify classroom exists
      const classroom = await this.model.findById(classroomId);
      if (!classroom) {
        return new BaseResponse<User>(
          HttpStatus.NOT_FOUND,
          'Classroom not found',
          null,
        );
      }

      // Get student
      const student = await this.userModel.findById(studentId);
      if (!student) {
        return new BaseResponse<User>(
          HttpStatus.NOT_FOUND,
          'Student not found',
          null,
        );
      }

      // Verify student is siswa
      const siswaRole = await this.userModel.db
        .model('Role')
        .findOne({ slug: 'siswa' });

      if (!siswaRole || student.role.toString() !== siswaRole._id.toString()) {
        return new BaseResponse<User>(
          HttpStatus.BAD_REQUEST,
          'User is not a student',
          null,
        );
      }

      // Set all current classroom history to not current
      if (student.details && (student.details as any).classroom_history) {
        (student.details as any).classroom_history.forEach((history: any) => {
          if (history.is_current) {
            history.is_current = false;
            history.end_date = new Date();
          }
        });
      }

      // Add new classroom history
      const newClassroomHistory = {
        classroom_id: classroomId,
        start_date: startDate || new Date(),
        end_date: null,
        is_current: true,
      };

      if (!(student.details as any).classroom_history) {
        (student.details as any).classroom_history = [];
      }
      (student.details as any).classroom_history.push(newClassroomHistory);

      await student.save();

      const updatedStudent = await this.userModel
        .findById(studentId)
        .populate('role')
        .exec();

      return new BaseResponse<User>(
        HttpStatus.OK,
        'Student assigned to classroom successfully',
        updatedStudent,
      );
    } catch (error) {
      return new BaseResponse<User>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error assigning student to classroom',
        null,
        error.message,
      );
    }
  }

  // Remove siswa from classroom
  async removeStudentFromClassroom(
    studentId: string,
    classroomId: string,
  ): Promise<BaseResponse<User>> {
    try {
      const student = await this.userModel.findById(studentId);
      if (!student) {
        return new BaseResponse<User>(
          HttpStatus.NOT_FOUND,
          'Student not found',
          null,
        );
      }

      // Find current classroom history and set end date
      if (student.details && (student.details as any).classroom_history) {
        const currentHistory = (student.details as any).classroom_history.find(
          (history: any) =>
            history.classroom_id.toString() === classroomId &&
            history.is_current,
        );

        if (currentHistory) {
          currentHistory.is_current = false;
          currentHistory.end_date = new Date();
        }
      }

      await student.save();

      const updatedStudent = await this.userModel
        .findById(studentId)
        .populate('role')
        .exec();

      return new BaseResponse<User>(
        HttpStatus.OK,
        'Student removed from classroom successfully',
        updatedStudent,
      );
    } catch (error) {
      return new BaseResponse<User>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error removing student from classroom',
        null,
        error.message,
      );
    }
  }

  // Override create untuk menambahkan school_id dari query
  override async create(
    createDto: any,
    query?: any,
  ): Promise<BaseResponse<Classroom>> {
    try {
      // Verify guru exists and is guru role
      const guru = await this.userModel
        .findById(createDto.guru_id)
        .populate('role');

      if (!guru) {
        return new BaseResponse<Classroom>(
          HttpStatus.NOT_FOUND,
          'Guru not found',
          null,
        );
      }

      const guruRole = await this.userModel.db
        .model('Role')
        .findOne({ slug: 'guru' });

      const roleId = (guru.role as any)._id || guru.role;
      if (!guruRole || roleId.toString() !== guruRole._id.toString()) {
        return new BaseResponse<Classroom>(
          HttpStatus.BAD_REQUEST,
          'Selected user is not a guru',
          null,
        );
      }

      const classroomToCreate = {
        ...createDto,
        school_id: query?.school_id,
      };

      return super.create(classroomToCreate);
    } catch (error) {
      return new BaseResponse<Classroom>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating classroom',
        null,
        error.message,
      );
    }
  }
}
