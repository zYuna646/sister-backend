import { Controller } from '@nestjs/common';
import { BaseController } from 'src/common/base/base.controller';
import { Student } from 'src/common/schemas/student.schema';
import { StudentService } from './student.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

interface DTO {
  createDto: CreateDto;
  updateDto: UpdateDto;
}

@Controller('student')
export class StudentController extends BaseController<Student, DTO> {
  constructor(protected readonly studentService: StudentService) {
    super(studentService);
  }
}
