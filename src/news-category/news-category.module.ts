import { Module } from '@nestjs/common';
import { NewsCategoryController } from './news-category.controller';
import { NewsCategoryService } from './news-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsCategorySchema } from 'src/common/schemas/news-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'NewsCategory', schema: NewsCategorySchema },
    ]),
  ],
  controllers: [NewsCategoryController],
  providers: [NewsCategoryService],
})
export class NewsCategoryModule {}
