import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDtoGallery {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Gallery image title',
    example: 'Sports Day 2023',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the image',
    example: 'Students participating in the annual sports competition',
    required: false,
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Path to the image file (will be filled by upload handler)',
    example: 'uploads/gallery/sports-day.jpg',
  })
  image_path: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Gallery category ID reference',
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
}
