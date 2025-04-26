import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolSchema } from 'src/common/schemas/school.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'School', schema: SchoolSchema }]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [
    MongooseModule.forFeature([{ name: 'School', schema: SchoolSchema }]),
  ],
})
export class SchoolModule {}
