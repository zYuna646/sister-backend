import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateGuruDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the guru',
    example: 'John Doe',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the guru',
    example: 'guru@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password for the guru account',
    example: 'password123',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Path to guru profile photo',
    example: 'uploads/users/guru-photo-123456.jpg',
    required: false,
  })
  foto?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'NIP (Nomor Induk Pegawai) of the guru',
    example: '196701012000121001',
  })
  nip: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Active status of the guru',
    example: true,
    default: true,
    required: false,
  })
  is_active?: boolean;

  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    description: 'Jabatan ID assigned to the guru',
    example: '60d21b2f9e3fbd6d6c98e6b0',
    required: false,
  })
  jabatan_id?: string;
}
