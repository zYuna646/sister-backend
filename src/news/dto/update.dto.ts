import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateDtoNews {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'News title',
    example: 'School Annual Festival',
    required: false,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'News summary/brief description',
    example: 'A brief overview of the annual school festival event',
    required: false,
  })
  summary?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Full content of the news article',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    required: false,
  })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Path to the thumbnail image',
    example: 'uploads/news/thumbnail-123.jpg',
    required: false,
  })
  thumbnail?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether this news is featured',
    example: false,
    required: false,
  })
  is_featured?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'View count',
    example: 0,
    required: false,
  })
  view_count?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    description: 'Publication date',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  publish_date?: Date;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Whether the news is published',
    example: true,
    required: false,
  })
  is_published?: boolean;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'Category ID reference',
    example: '60a6c5ec0f16d826d864f293',
    required: false,
  })
  category_id?: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'School ID reference',
    example: '60a6c5ec0f16d826d864f292',
    required: false,
  })
  school_id?: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'Author (User) ID reference',
    example: '60a6c5ec0f16d826d864f291',
    required: false,
  })
  author_id?: string;
}
