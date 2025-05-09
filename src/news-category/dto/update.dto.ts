import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDtoNewsCategory {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category name',
    example: 'School Events',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category description',
    example: 'News about school events and activities',
    required: false,
  })
  description?: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'School ID reference (null for global categories)',
    example: '60a6c5ec0f16d826d864f292',
    required: false,
  })
  school_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is the category active',
    example: true,
    required: false,
  })
  is_active?: boolean;
}
