import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { School } from 'src/common/schemas/school.schema';
import { Model } from 'mongoose';

@Injectable()
export class SchoolService extends BaseService<School> {
  constructor(@InjectModel('School') private schoolModel: Model<School>) {
    super(schoolModel);
  }
}
