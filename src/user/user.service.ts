import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/base/base.service';
import { User } from 'src/common/schemas/user.schema';
import { BaseResponse } from 'src/common/base/base.response';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel('User') private userModel: Model<User>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User> {
    return this.model.findOne({ email: email }).populate('role').exec();
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
}
