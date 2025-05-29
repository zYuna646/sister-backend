import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId, IsBoolean } from 'class-validator';

export class UpdateDtoClassroom {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Nama kelas',
    example: 'Kelas 7B',
    required: false,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Grade/Tingkat kelas',
    example: '8',
    required: false,
  })
  grade?: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'ID Guru wali kelas',
    example: '60d21b2f9e3fbd6d6c98e6b0',
    required: false,
  })
  guru_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Status aktif kelas',
    example: false,
    required: false,
  })
  is_active?: boolean;
}
