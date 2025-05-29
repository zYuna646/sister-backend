import { Module } from '@nestjs/common';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomSchema } from 'src/common/schemas/classroom.schema';
import { UserSchema } from 'src/common/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Classroom', schema: ClassroomSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
  exports: [ClassroomService],
})
export class ClassroomModule {}
