import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { School } from 'src/common/schemas/school.schema';
import { Model } from 'mongoose';
import { BaseResponse } from 'src/common/base/base.response';
import { HttpStatus } from '@nestjs/common';
import { UpdateDtoSchool } from './dto/update.dto';

@Injectable()
export class SchoolService extends BaseService<School> {
  constructor(@InjectModel('School') private schoolModel: Model<School>) {
    super(schoolModel);
  }

  async findByApiKey(apiKey: string): Promise<BaseResponse<School>> {
    try {
      const school = await this.model.findOne({ api_key: apiKey }).exec();

      if (!school) {
        return new BaseResponse<School>(
          HttpStatus.NOT_FOUND,
          'School not found with the provided API key',
          null,
        );
      }

      return new BaseResponse<School>(
        HttpStatus.OK,
        'School found successfully',
        school,
      );
    } catch (error) {
      return new BaseResponse<School>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error finding school by API key',
        null,
        error.message,
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateDtoSchool,
    query?: any,
  ): Promise<BaseResponse<School>> {
    const filter: any = {};
    if (query?.school_id) {
      filter._id = query.school_id;
    }
    return super.update(id, updateDto, filter);
  }

  async findById(id: string, query?: any): Promise<BaseResponse<School>> {
    const filter: any = {};
    if (query?.school_id) {
      filter._id = query.school_id;
    }
    return super.findById(id, filter);
  }

  async delete(id: string, query?: any): Promise<BaseResponse<School>> {
    const filter: any = {};
    if (query?.school_id) {
      filter._id = query.school_id;
    }
    return super.delete(id, filter);
  }
}
