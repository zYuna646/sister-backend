import { Controller } from '@nestjs/common';
import { Document } from 'mongoose';
import { BaseService } from './base.service';
import { BaseResponse } from './base.response';

@Controller()
export abstract class BaseController<T extends Document> {
  constructor(protected readonly baseService: BaseService<T>) {}

  abstract create(createDto: any): Promise<BaseResponse<T>>;

  abstract findAll(): Promise<BaseResponse<T[]>>;

  abstract findById(id: string): Promise<BaseResponse<T>>;

  abstract update(id: string, updateDto: any): Promise<BaseResponse<T>>;

  abstract softDelete(id: string): Promise<BaseResponse<T>>;
}
