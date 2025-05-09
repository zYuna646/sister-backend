import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { News } from 'src/common/schemas/news.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsService extends BaseService<News> {
  constructor(@InjectModel('News') private newsModel: Model<News>) {
    super(newsModel);
  }
}
