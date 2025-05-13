import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { News } from 'src/common/schemas/news.schema';
import { Model } from 'mongoose';
import { CreateDtoNews } from './dto/create.dto';
import { UpdateDtoNews } from './dto/update.dto';
import { BaseResponse } from 'src/common/base/base.response';

@Injectable()
export class NewsService extends BaseService<News> {
  constructor(@InjectModel('News') private newsModel: Model<News>) {
    super(newsModel);
  }

  async create(
    createDto: CreateDtoNews,
    userId?: string,
  ): Promise<BaseResponse<News>> {
    // If author_id is not provided and userId is available, use userId as author_id
    if (!createDto.author_id && userId) {
      createDto.author_id = userId;
    }
    return super.create(createDto);
  }

  async update(
    id: string,
    updateDto: UpdateDtoNews,
    userId?: string,
  ): Promise<BaseResponse<News>> {
    // If author_id is not provided and userId is available, use userId as author_id
    if (!updateDto.author_id && userId) {
      updateDto.author_id = userId;
    }
    return super.update(id, updateDto);
  }
}
