import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryCategoryController } from './gallery-category.controller';
import { GalleryCategoryService } from './gallery-category.service';
import { GalleryCategorySchema } from 'src/common/schemas/gallery-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GalleryCategory', schema: GalleryCategorySchema },
    ]),
  ],
  controllers: [GalleryCategoryController],
  providers: [GalleryCategoryService],
  exports: [GalleryCategoryService],
})
export class GalleryCategoryModule {}
