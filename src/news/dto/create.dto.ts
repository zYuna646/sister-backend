import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDtoNews {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'News title',
    example: 'School Annual Festival',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'News summary/brief description',
    example: 'A brief overview of the annual school festival event',
    required: false,
  })
  summary?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Full content of the news article',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  })
  content: string;

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
    default: false,
  })
  is_featured?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'View count',
    example: 0,
    required: false,
    default: 0,
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
    default: true,
  })
  is_published?: boolean;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category ID reference',
    example: '60a6c5ec0f16d826d864f293',
  })
  category_id: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'School ID reference',
    example: '60a6c5ec0f16d826d864f292',
  })
  school_id: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Author (User) ID reference',
    example: '60a6c5ec0f16d826d864f291',
  })
  author_id: string;
}
