import { Module } from '@nestjs/common';
import { LandingSchoolsController } from './landing-schools.controller';
import { LandingSchoolsService } from './landing-schools.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LandingSchoolsSchema } from 'src/common/schemas/landing-schools.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LandingSchools', schema: LandingSchoolsSchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/landing-schools',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [LandingSchoolsController],
  providers: [LandingSchoolsService],
  exports: [LandingSchoolsService],
})
export class LandingSchoolsModule {}
