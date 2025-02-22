import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { Document } from 'mongoose';
import { Permission } from '../decorators/permissions.decorator';

interface BaseDTO {
  createDto: any;
  updateDto: any;
}

@Controller()
export abstract class BaseController<T extends Document, DTO extends BaseDTO> {
  constructor(private readonly baseService: BaseService<T>) {}

  @Post()
  @Permission('POST')
  async create(@Body() createDto: DTO['createDto']): Promise<T> {
    return this.baseService.create(createDto);
  }

  @Get()
  @Permission('GET')
  async findAll(): Promise<T[]> {
    return this.baseService.findAll();
  }

  @Get(':id')
  @Permission('GET')
  async findById(@Param('id') id: string): Promise<T> {
    return this.baseService.findById(id);
  }

  @Put(':id')
  @Permission('PUT')
  async update(
    @Param('id') id: string,
    @Body() updateDto: DTO['updateDto'],
  ): Promise<T> {
    return this.baseService.update(id, updateDto);
  }

  @Permission('DELETE')
  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<T> {
    return this.baseService.delete(id);
  }
}
