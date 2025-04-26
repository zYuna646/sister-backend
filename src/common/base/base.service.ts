import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

@Injectable()
export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(createDto: any, query?: any): Promise<BaseResponse<T>> {
    try {
      // If school_id is in the query, add it to the DTO
      if (query?.school_id) {
        createDto.school_id = query.school_id;
      }

      const createdEntity = new this.model(createDto);
      const savedEntity = await createdEntity.save();
      return new BaseResponse<T>(
        HttpStatus.CREATED,
        'Entity created successfully',
        savedEntity,
      );
    } catch (error) {
      return new BaseResponse<T>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error creating entity',
        null,
        error.message,
      );
    }
  }

  async findAll(query?: any): Promise<BaseResponse<T[]>> {
    try {
      // Build filter based on query params
      const filter: any = {};

      // If school_id is provided in query, filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const entities = await this.model.find(filter).exec();
      return new BaseResponse<T[]>(
        HttpStatus.OK,
        'Entities fetched successfully',
        entities,
      );
    } catch (error) {
      return new BaseResponse<T[]>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching entities',
        null,
        error.message,
      );
    }
  }

  async findById(id: string, query?: any): Promise<BaseResponse<T>> {
    try {
      const filter: any = { _id: id };

      // If school_id is provided in query, also filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const entity = await this.model.findOne(filter).exec();
      if (!entity) {
        return new BaseResponse<T>(
          HttpStatus.NOT_FOUND,
          'Entity not found',
          null,
        );
      }
      return new BaseResponse<T>(
        HttpStatus.OK,
        'Entity fetched successfully',
        entity,
      );
    } catch (error) {
      return new BaseResponse<T>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error fetching entity',
        null,
        error.message,
      );
    }
  }

  async update(
    id: string,
    updateDto: any,
    query?: any,
  ): Promise<BaseResponse<T>> {
    try {
      const filter: any = { _id: id };

      // If school_id is provided in query, also filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const updatedEntity = await this.model
        .findOneAndUpdate(filter, updateDto, { new: true })
        .exec();
      if (!updatedEntity) {
        return new BaseResponse<T>(
          HttpStatus.NOT_FOUND,
          'Entity not found to update',
          null,
        );
      }
      return new BaseResponse<T>(
        HttpStatus.OK,
        'Entity updated successfully',
        updatedEntity,
      );
    } catch (error) {
      return new BaseResponse<T>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error updating entity',
        null,
        error.message,
      );
    }
  }

  async delete(id: string, query?: any): Promise<BaseResponse<T>> {
    try {
      const filter: any = { _id: id };

      // If school_id is provided in query, also filter by it
      if (query?.school_id) {
        filter.school_id = query.school_id;
      }

      const deletedEntity = await this.model.findOneAndDelete(filter).exec();
      if (!deletedEntity) {
        return new BaseResponse<T>(
          HttpStatus.NOT_FOUND,
          'Entity not found to delete',
          null,
        );
      }
      return new BaseResponse<T>(
        HttpStatus.OK,
        'Entity deleted successfully',
        deletedEntity,
      );
    } catch (error) {
      return new BaseResponse<T>(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error deleting entity',
        null,
        error.message,
      );
    }
  }
}
