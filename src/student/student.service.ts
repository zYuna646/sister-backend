import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from 'src/common/schemas/student.schema';
import { Model } from 'mongoose';

@Injectable()
export class StudentService extends BaseService<Student> {
  constructor(@InjectModel('Student') private studentModel: Model<Student>) {
    super(studentModel);
  }
}
