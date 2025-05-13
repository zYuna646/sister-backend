import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { NewsCategory } from 'src/common/schemas/news-category.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsCategoryService extends BaseService<NewsCategory> {
  constructor(
    @InjectModel('NewsCategory') private newsCategoryModel: Model<NewsCategory>,
  ) {
    super(newsCategoryModel);
  }
}
