import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDtoGalleryCategory {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category name',
    example: 'School Events',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category description',
    example: 'Photos from school events and activities',
    required: false,
  })
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'School ID reference',
    example: '60a6c5ec0f16d826d864f292',
  })
  school_id: string;
}
