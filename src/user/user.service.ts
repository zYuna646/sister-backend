import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/base/base.service';
import { User } from 'src/common/schemas/user.schema';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel('User') private userModel: Model<User>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User> {
    return this.model.findOne({ email: email }).populate('role').exec();
  }

  // Override findById to always populate role for permission checking
  override async findById(id: string, query?: any): Promise<any> {
    try {
      const filter: any = { _id: id };

      // If school_id is provided in query, also filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const entity = await this.model.findOne(filter).populate('role').exec();
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
