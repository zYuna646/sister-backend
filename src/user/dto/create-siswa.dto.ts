import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateSiswaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the siswa',
    example: 'Jane Doe',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the siswa',
    example: 'siswa@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password for the siswa account',
    example: 'password123',
  })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Path to siswa profile photo',
    example: 'uploads/users/siswa-photo-123456.jpg',
    required: false,
  })
  foto?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'NISN (Nomor Induk Siswa Nasional) of the siswa',
    example: '1234567890',
  })
  nisn: string;
}
