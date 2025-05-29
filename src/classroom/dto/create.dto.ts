import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateDtoClassroom {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nama kelas',
    example: 'Kelas 7A',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Grade/Tingkat kelas',
    example: '7',
  })
  grade: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID Guru wali kelas',
    example: '60d21b2f9e3fbd6d6c98e6b0',
  })
  guru_id: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Status aktif kelas',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean;
}
