import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ description: 'Total number of items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevPage: boolean;
}

export class ResponseMeta {
  @ApiProperty({ type: PaginationMeta, required: false })
  pagination?: PaginationMeta;

  constructor(pagination?: PaginationMeta) {
    this.pagination = pagination;
  }
}

export class BaseResponse<T> {
  @ApiProperty({
    description: 'Status code of the response',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Message describing the result of the operation',
    example: 'Request successful',
  })
  message: string;

  @ApiProperty({
    description: 'Data returned by the API, could be any type',
    type: Object,
    nullable: true,
    example: null,
  })
  data: T | null;

  @ApiProperty({
    description: 'Error message if the request fails',
    type: String,
    nullable: true,
    example: null,
  })
  error: string | null;

  @ApiProperty({
    description: 'Additional metadata for the response',
    type: ResponseMeta,
    required: false,
  })
  meta?: ResponseMeta;

  constructor(
    statusCode: number,
    message: string,
    data: T | null = null,
    error: string | null = null,
    meta?: any,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
    this.meta = meta;
  }
}
