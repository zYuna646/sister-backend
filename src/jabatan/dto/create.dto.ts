import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsBoolean,
} from 'class-validator';

export class CreateDtoJabatan {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nama jabatan',
    example: 'Kepala Sekolah',
  })
  nama: string;

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
    default: true,
    required: false,
  })
  is_active?: boolean;
}
