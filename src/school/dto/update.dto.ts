import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDtoSchool {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'School name',
    example: 'ABC High School',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'School address',
    example: '123 Education St',
    required: false,
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'School phone number',
    example: '555-123-4567',
    required: false,
  })
  phone?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'School email address',
    example: 'info@abchighschool.com',
    required: false,
  })
  email?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'School active status',
    example: true,
    required: false,
  })
  isActive?: boolean;
}
