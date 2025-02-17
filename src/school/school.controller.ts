import { Controller } from '@nestjs/common';
import { BaseController } from 'src/common/base/base.controller';
import { School } from 'src/common/schemas/school.schema';
import { SchoolService } from './school.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';

interface DTO {
  createDto: CreateDto;
  updateDto: UpdateDto;
}

@Controller('school')
export class SchoolController extends BaseController<School, DTO> {
  constructor(protected readonly schoolService: SchoolService) {
    super(schoolService);
  }
}
