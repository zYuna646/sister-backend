import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDtoGallery {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Gallery image title',
    example: 'Sports Day 2023',
    required: false,
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the image',
    example: 'Students participating in the annual sports competition',
    required: false,
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Path to the image file (will be filled by upload handler)',
    example: 'uploads/gallery/sports-day.jpg',
    required: false,
  })
  image_path?: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'Gallery category ID reference',
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
}
