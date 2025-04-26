import { Controller } from '@nestjs/common';
import { Document } from 'mongoose';
import { BaseService } from './base.service';
import { BaseResponse } from './base.response';

@Controller()
export abstract class BaseController<T extends Document> {
  constructor(protected readonly baseService: BaseService<T>) {}

  abstract create(createDto: any, query?: any): Promise<BaseResponse<T>>;

  abstract findAll(query?: any): Promise<BaseResponse<T[]>>;

  abstract findById(id: string, query?: any): Promise<BaseResponse<T>>;

  abstract update(
    id: string,
    updateDto: any,
    query?: any,
  ): Promise<BaseResponse<T>>;

  abstract softDelete(id: string, query?: any): Promise<BaseResponse<T>>;
}
