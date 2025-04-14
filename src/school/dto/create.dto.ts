import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDtoSchool {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'School name', example: 'ABC High School' })
  name: string;

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
    default: true,
    required: false,
  })
  isActive?: boolean;
}
