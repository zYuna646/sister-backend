import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId, IsBoolean } from 'class-validator';

export class UpdateDtoJabatan {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Nama jabatan',
    example: 'Wakil Kepala Sekolah',
    required: false,
  })
  nama?: string;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'Parent jabatan ID untuk hierarchy',
    example: '60d21b2f9e3fbd6d6c98e6b0',
    required: false,
  })
  jabatan_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Status aktif jabatan',
    example: true,
    required: false,
  })
  is_active?: boolean;
}
