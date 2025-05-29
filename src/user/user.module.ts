import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { GuruController } from './guru.controller';
import { SiswaController } from './siswa.controller';
import { UserService } from './user.service';
import { UserSchema } from 'src/common/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController, GuruController, SiswaController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
