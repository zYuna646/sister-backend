import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
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
    description: 'School NPSN (Nomor Pokok Sekolah Nasional)',
    example: '12345678',
    required: false,
  })
  npsn?: string;

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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'API Key for school',
    example: 'sk_school_12345abcde',
    required: false,
  })
  api_key?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'School vision statements',
    example: ['Provide quality education', 'Create innovative learners'],
    required: false,
    type: [String],
  })
  visi?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'School mission statements',
    example: [
      'Implement modern teaching methods',
      'Develop character building',
    ],
    required: false,
    type: [String],
  })
  misi?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'School active status',
    example: true,
    required: false,
  })
  isActive?: boolean;
}
