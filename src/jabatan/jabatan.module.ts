import { Module } from '@nestjs/common';
import { JabatanController } from './jabatan.controller';
import { JabatanService } from './jabatan.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JabatanSchema } from 'src/common/schemas/jabatan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Jabatan', schema: JabatanSchema }]),
  ],
  controllers: [JabatanController],
  providers: [JabatanService],
  exports: [JabatanService],
})
export class JabatanModule {}
